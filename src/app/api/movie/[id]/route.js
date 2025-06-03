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

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('OMDB API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movie details from OMDB API' },
      { status: 500 }
    );
  }
} 