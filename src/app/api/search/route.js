import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie`,
      {
        params: {
          query,
          api_key: process.env.TMDB_API_KEY,
        },
      }
    );

    // Sort results by ranking score
    const sortedResults = response.data.results
      .map(movie => ({
        ...movie,
        ranking_score: movie.popularity * Math.log10(movie.vote_count + 1)
      }))
      .sort((a, b) => b.ranking_score - a.ranking_score)
      .slice(0, 10);

    return NextResponse.json({ results: sortedResults });
  } catch (error) {
    console.error('TMDb API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 }
    );
  }
} 