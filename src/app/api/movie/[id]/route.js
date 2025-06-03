import { NextResponse } from 'next/server';
import axios from 'axios';
import { query } from '@/app/lib/db';

export async function GET(request, { params }) {
  const { id } = params; // This is the OMDB imdbID

  if (!id) {
    return NextResponse.json(
      { error: 'Movie ID is required' },
      { status: 400 }
    );
  }

  try {
    // 1. Fetch movie details from OMDB using imdbID
    const omdbResponse = await axios.get(
      `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${id}&plot=full`
    );

    if (omdbResponse.data.Error) {
      return NextResponse.json(
        { error: omdbResponse.data.Error },
        { status: 404 }
      );
    }

    const movieDetails = omdbResponse.data;

    // 2. Try to find the movie in our database using imdbID
    let recommendations = [];
    let dbMovie = null;

    try {
        // Search by imdbID which is the primary key
        const dbResult = await query(
            'SELECT imdbid, title, plot, poster, imdbrating, embedding FROM movies WHERE imdbid = $1',
            [movieDetails.imdbID] // Use imdbID from OMDB data
        );

        if (dbResult.rows.length > 0) {
            dbMovie = dbResult.rows[0];

            // 3. If movie found in DB and has embedding, fetch recommendations
            if (dbMovie.embedding) {
                const similarMovies = await query(
                    `SELECT imdbid, title, poster, imdbrating, embedding <#> $1::vector as distance
                     FROM movies
                     WHERE imdbid != $2
                     ORDER BY distance ASC
                     LIMIT 5`,
                    [dbMovie.embedding, dbMovie.imdbid] // Use imdbid from dbMovie
                );
                // Map database result to a format the frontend expects for recommendations
                recommendations = similarMovies.rows.map(rec => ({
                    imdbid: rec.imdbid,
                    title: rec.title,
                    poster: rec.poster,
                    vote_average: parseFloat(rec.imdbrating) || 0 // Convert imdbrating to number for consistency if needed
                    // Add other fields if the frontend needs them
                }));
            }
        } else {
            // If movie not found by imdbID, try by title and year as a fallback (less reliable)
             const fallbackResult = await query(
                 'SELECT imdbid, title, plot, poster, imdbrating, embedding FROM movies WHERE title ILIKE $1 AND year = $2 LIMIT 1',
                 [`%${movieDetails.Title}%`, movieDetails.Year]
             );

            if (fallbackResult.rows.length > 0) {
                 dbMovie = fallbackResult.rows[0];
                 if (dbMovie.embedding) {
                      const similarMovies = await query(
                         `SELECT imdbid, title, poster, imdbrating, embedding <#> $1::vector as distance
                          FROM movies
                          WHERE imdbid != $2
                          ORDER BY distance ASC
                          LIMIT 5`,
                         [dbMovie.embedding, dbMovie.imdbid]
                      );
                     recommendations = similarMovies.rows.map(rec => ({
                         imdbid: rec.imdbid,
                         title: rec.title,
                         poster: rec.poster,
                         vote_average: parseFloat(rec.imdbrating) || 0
                     }));
                 }
            }
        }
    } catch (dbError) {
        console.error('Database query error for recommendations:', dbError);
        // Continue without recommendations if DB query fails
    }

    // 4. Return OMDB movie details and recommendations from DB
    // Ensure the main movie details also include the recommendation data structure
    return NextResponse.json({ ...movieDetails, recommendations });

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movie details or recommendations' },
      { status: 500 }
    );
  }
} 