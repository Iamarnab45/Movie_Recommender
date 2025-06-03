const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function generateEmbedding(text) {
  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set.');
    return null;
  }

  if (!text || text === 'N/A') {
      console.warn('Skipping embedding generation for empty or N/A text.');
      return null; // Return null for empty or N/A plot
  }

  try {
    const model = genAI.getGenerativeModel({ model: "embedding-001" });
    const result = await model.embedContent(text);
    const embedding = result.embedding.values;
    return embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    // Depending on how critical embeddings are, you might throw the error or return null
    throw error; // Re-throw the error to be handled by the caller
  }
}

async function storeMovieWithEmbedding(movie) {
  const { query } = require('./db');

  try {
    // Check if movie already exists using imdbID (primary key)
    const existingMovie = await query(
      'SELECT imdbid FROM movies WHERE imdbid = $1',
      [movie.imdbID]
    );

    if (existingMovie.rows.length > 0) {
      console.log(`Movie with imdbID ${movie.imdbID} already exists. Skipping.`);
      return existingMovie.rows[0];
    }

    // Generate embedding for movie Plot
    const embedding = await generateEmbedding(movie.Plot);

    // It's possible generateEmbedding returns null if Plot is empty/N/A, handle this
    if (!embedding) {
        console.warn(`Skipping storing movie ${movie.Title} due to missing or empty plot for embedding.`);
        return null; // Skip storing if embedding could not be generated
    }

    // Store movie with embedding using OMDB schema
    const result = await query(
      `INSERT INTO movies (
        imdbid, title, year, rated, released, runtime, genre, director,
        writer, actors, plot, language, country, awards, poster, metascore,
        imdbrating, imdbvotes, type, embedding
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING *`,
      [
        movie.imdbID,
        movie.Title,
        movie.Year,
        movie.Rated,
        movie.Released,
        movie.Runtime,
        movie.Genre,
        movie.Director,
        movie.Writer,
        movie.Actors,
        movie.Plot,
        movie.Language,
        movie.Country,
        movie.Awards,
        movie.Poster,
        movie.Metascore,
        movie.imdbRating,
        movie.imdbVotes,
        movie.Type,
        JSON.stringify(embedding) // Store embedding as JSON string
      ]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error storing movie:', error);
    throw error;
  }
}

module.exports = {
    generateEmbedding,
    storeMovieWithEmbedding,
}; 