const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function generateEmbedding(text) {
  if (!GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set.');
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "embedding-001" });
    const result = await model.embedContent(text);
    const embedding = result.embedding.values;
    return embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

async function storeMovieWithEmbedding(movie) {
  const { query } = require('./db');

  try {
    // Check if movie already exists
    const existingMovie = await query(
      'SELECT * FROM movies WHERE tmdb_id = $1',
      [movie.id]
    );

    if (existingMovie.rows.length > 0) {
      console.log(`Movie with tmdb_id ${movie.id} already exists. Skipping.`);
      return existingMovie.rows[0];
    }

    // Generate embedding for movie overview
    const embedding = await generateEmbedding(movie.overview);

    if (!embedding) {
        console.error('Failed to generate embedding for movie:', movie.title);
        return null;
    }

    // Store movie with embedding
    const result = await query(
      `INSERT INTO movies (
        tmdb_id, title, overview, poster_path, vote_average,
        vote_count, popularity, release_date, embedding
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        movie.id,
        movie.title,
        movie.overview,
        movie.poster_path,
        movie.vote_average,
        movie.vote_count,
        movie.popularity,
        movie.release_date,
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