import { NextResponse } from 'next/server';
import axios from 'axios';
import { query } from '@/app/lib/db';
import { storeMovieWithEmbedding } from '@/app/lib/gemini';

export async function GET(request, { params }) {
  try {
    const movieId = params.id;

    // First, check if the movie exists in our database
    const dbMovie = await query(
      'SELECT * FROM movies WHERE tmdb_id = $1',
      [movieId]
    );

    if (dbMovie.rows.length > 0) {
      const movie = dbMovie.rows[0];
      // If found in DB, fetch recommendations based on its embedding
      const similarMovies = await query(
        `SELECT tmdb_id, title, poster_path, vote_average, embedding <#> $1::vector as distance
         FROM movies
         WHERE tmdb_id != $2
         ORDER BY distance ASC
         LIMIT 5`,
        [movie.embedding, movieId]
      );

      return NextResponse.json({
        movie: { // Format movie data for frontend consistency
          id: movie.tmdb_id,
          title: movie.title,
          overview: movie.overview,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
          vote_count: movie.vote_count,
          popularity: movie.popularity,
          release_date: movie.release_date,
        },
        recommendations: similarMovies.rows.map(rec => ({
           // Format recommendations for frontend consistency
          id: rec.tmdb_id,
          tmdb_id: rec.tmdb_id,
          title: rec.title,
          poster_path: rec.poster_path,
          vote_average: rec.vote_average,
        })),
      });
    }

    // If movie not found in DB, try fetching from TMDb (for real movie IDs)
    // Fetch movie details from TMDb
    const tmdbResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/${params.id}`,
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
        },
      }
    );

    const movie = tmdbResponse.data;

    // Store movie in database with embedding
    await storeMovieWithEmbedding(movie);

    // Get similar movies using vector similarity
    const similarMovies = await query(
      `SELECT *, embedding <#> (SELECT embedding FROM movies WHERE tmdb_id = $1) as distance
       FROM movies
       WHERE tmdb_id != $1
       ORDER BY distance ASC
       LIMIT 5`,
      [params.id]
    );

    return NextResponse.json({
      movie,
      recommendations: similarMovies.rows,
    });
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movie details' },
      { status: 500 }
    );
  }
} 