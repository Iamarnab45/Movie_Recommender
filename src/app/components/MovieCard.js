'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function MovieCard({ movie }) {
  const {
    id,
    title,
    overview,
    poster_path,
    vote_average,
    release_date,
    popularity,
    vote_count
  } = movie;

  const rankingScore = popularity * Math.log10(vote_count + 1);
  const truncatedOverview = overview?.length > 150 
    ? `${overview.substring(0, 150)}...` 
    : overview;

  return (
    <Link href={`/movie/${id}`}>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        <div className="relative h-[400px]">
          <Image
            src={`https://image.tmdb.org/t/p/w500${poster_path}`}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <p className="text-gray-600 text-sm mb-2">{truncatedOverview}</p>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>Released: {new Date(release_date).toLocaleDateString()}</span>
            <span>Rating: {vote_average.toFixed(1)} ⭐</span>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Score: {rankingScore.toFixed(2)}
          </div>
        </div>
      </div>
    </Link>
  );
} 