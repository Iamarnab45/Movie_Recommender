import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(
      `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${encodeURIComponent(query)}`
    );

    if (response.data.Error) {
      return NextResponse.json(
        { error: response.data.Error },
        { status: 404 }
      );
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('OMDB API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movies from OMDB API' },
      { status: 500 }
    );
  }
} 