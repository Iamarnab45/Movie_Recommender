'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import React from 'react';

export default function MoviePage({ params }) {
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const unwrappedParams = React.use(params);

  useEffect(() => {
    const fetchMovieAndRecommendations = async () => {
      try {
        const response = await axios.get(`/api/movie/${unwrappedParams.id}`);
        setMovie(response.data.movie);
        setRecommendations(response.data.recommendations);
      } catch (error) {
        console.error('Error fetching movie:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieAndRecommendations();
  }, [unwrappedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-500">Movie not found</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="text-blue-500 hover:underline mb-8 inline-block">
          ← Back to Search
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="relative h-[600px]">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
            <div className="flex gap-4 mb-4">
              <span className="text-gray-600">
                Released: {new Date(movie.release_date).toLocaleDateString()}
              </span>
              <span className="text-gray-600">
                Rating: {movie.vote_average.toFixed(1)} ⭐
              </span>
            </div>
            <p className="text-gray-700 mb-6">{movie.overview}</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-6">Similar Movies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec) => (
            <Link key={rec.tmdb_id} href={`/movie/${rec.tmdb_id}`}>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-[300px]">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${rec.poster_path}`}
                    alt={rec.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{rec.title}</h3>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Rating: {rec.vote_average.toFixed(1)} ⭐</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
} 