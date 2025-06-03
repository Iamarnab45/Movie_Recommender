'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/search?query=${encodeURIComponent(searchQuery)}`);
      setMovies(response.data.Search || []);
    } catch (err) {
      setError('Failed to fetch movies. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Movie Recommender</h1>
        
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4 max-w-2xl mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for movies..."
              className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {error && (
          <div className="text-red-500 text-center mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.imdbID}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder-movie.jpg'}
                alt={movie.Title}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 text-gray-900">{movie.Title}</h2>
                <p className="text-gray-900">{movie.Year}</p>
                <a
                  href={`/movie/${movie.imdbID}`}
                  className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
