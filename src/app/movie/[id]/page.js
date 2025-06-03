'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`/api/movie/${id}`);
        setMovie(response.data);
      } catch (err) {
        setError('Failed to fetch movie details. Please try again.');
        console.error('Movie details error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Movie not found</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3">
              <img
                src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-movie.jpg'}
                alt={movie.Title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8 md:w-2/3">
              <h1 className="text-4xl font-bold mb-4">{movie.Title}</h1>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-900">Year</p>
                  <p className="font-semibold text-gray-900">{movie.Year}</p>
                </div>
                <div>
                  <p className="text-gray-900">Released</p>
                  <p className="font-semibold text-gray-900">{movie.Released}</p>
                </div>
                <div>
                  <p className="text-gray-900">Runtime</p>
                  <p className="font-semibold text-gray-900">{movie.Runtime}</p>
                </div>
                <div>
                  <p className="text-gray-900">Genre</p>
                  <p className="font-semibold text-gray-900">{movie.Genre}</p>
                </div>
                <div>
                  <p className="text-gray-900">Director</p>
                  <p className="font-semibold text-gray-900">{movie.Director}</p>
                </div>
                <div>
                  <p className="text-gray-900">Writer</p>
                  <p className="font-semibold text-gray-900">{movie.Writer}</p>
                </div>
                <div>
                  <p className="text-gray-900">Actors</p>
                  <p className="font-semibold text-gray-900">{movie.Actors}</p>
                </div>
                <div>
                  <p className="text-gray-900">Language</p>
                  <p className="font-semibold text-gray-900">{movie.Language}</p>
                </div>
              </div>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Plot</h2>
                <p className="text-gray-900">{movie.Plot}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-900">IMDb Rating</p>
                  <p className="font-semibold text-gray-900">{movie.imdbRating}</p>
                </div>
                <div>
                  <p className="text-gray-900">IMDb Votes</p>
                  <p className="font-semibold text-gray-900">{movie.imdbVotes}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 