'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`/api/movie/${id}`);
        setMovie(response.data);
        setRecommendations(response.data.recommendations || []);
      } catch (err) {
        setError('Failed to fetch movie details or recommendations. Please try again.');
        console.error('Movie details/recommendations error:', err);
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
        <Link href="/" className="text-blue-500 hover:underline mb-8 inline-block">
          ← Back to Search
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-1/3">
              <div className="relative w-full h-96 md:h-full">
                <Image
                  src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-movie.jpg'}
                  alt={movie.Title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
            <div className="p-8 md:w-2/3">
              <h1 className="text-4xl font-bold mb-4">{movie.Title}</h1>
              <div className="grid grid-cols-2 gap-4 mb-6 text-gray-900">
                <div>
                  <p className="text-gray-600">Year</p>
                  <p className="font-semibold">{movie.Year}</p>
                </div>
                <div>
                  <p className="text-gray-600">Released</p>
                  <p className="font-semibold">{movie.Released}</p>
                </div>
                <div>
                  <p className="text-gray-600">Runtime</p>
                  <p className="font-semibold">{movie.Runtime}</p>
                </div>
                <div>
                  <p className="text-gray-600">Genre</p>
                  <p className="font-semibold">{movie.Genre}</p>
                </div>
                <div>
                  <p className="text-gray-600">Director</p>
                  <p className="font-semibold">{movie.Director}</p>
                </div>
                <div>
                  <p className="text-gray-600">Writer</p>
                  <p className="font-semibold">{movie.Writer}</p>
                </div>
                <div>
                  <p className="text-gray-600">Actors</p>
                  <p className="font-semibold">{movie.Actors}</p>
                </div>
                <div>
                  <p className="text-gray-600">Language</p>
                  <p className="font-semibold">{movie.Language}</p>
                </div>
              </div>
              <div className="mb-6 text-gray-900">
                <h2 className="text-2xl font-semibold mb-2">Plot</h2>
                <p>{movie.Plot}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-gray-900">
                <div>
                  <p className="text-gray-600">IMDb Rating</p>
                  <p className="font-semibold">{movie.imdbRating}</p>
                </div>
                <div>
                  <p className="text-gray-600">IMDb Votes</p>
                  <p className="font-semibold">{movie.imdbVotes}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {recommendations.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Recommended Movies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recommendations.map((rec) => (
                <Link key={rec.tmdb_id} href={`/movie/${rec.tmdb_id}`}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative w-full h-64">
                      <Image
                         src={rec.poster_path ? `https://image.tmdb.org/t/p/w500${rec.poster_path}` : '/placeholder-movie.jpg'}
                         alt={rec.title}
                         layout="fill"
                         objectFit="cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">{rec.title}</h3>
                      <p className="text-gray-600">Rating: {rec.vote_average?.toFixed(1)} ⭐</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 