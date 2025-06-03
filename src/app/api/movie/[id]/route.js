import { NextResponse } from 'next/server';
import axios from 'axios';
import { query } from '@/app/lib/db';
import { storeMovieWithEmbedding } from '@/app/lib/gemini';

export async function GET(request, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: 'Movie ID is required' },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(
      `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${id}&plot=full`
    );

    if (response.data.Error) {
      return NextResponse.json(
        { error: response.data.Error },
        { status: 404 }
      );
    }

    const movieDetails = response.data;

    let recommendations = [];
    let dbMovie = null;

    try {
      const dbResult = await query(
        'SELECT tmdb_id, title, overview, poster_path, vote_average, embedding FROM movies WHERE title ILIKE $1 AND release_date >= $2 AND release_date <= $3 LIMIT 1',
        [`%${movieDetails.Title}%`, `${movieDetails.Year}-01-01`, `${movieDetails.Year}-12-31`]
      );

      if (dbResult.rows.length > 0) {
        dbMovie = dbResult.rows[0];

        if (dbMovie.embedding) {
          const similarMovies = await query(
            `SELECT tmdb_id, title, poster_path, vote_average, embedding <#> $1::vector as distance
             FROM movies
             WHERE tmdb_id != $2
             ORDER BY distance ASC
             LIMIT 5`,
            [dbMovie.embedding, dbMovie.tmdb_id]
          );
          recommendations = similarMovies.rows;
        }
      }
    } catch (dbError) {
      console.error('Database query error for recommendations:', dbError);
    }

    return NextResponse.json({ ...movieDetails, recommendations });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movie details or recommendations' },
      { status: 500 }
    );
  }
} 