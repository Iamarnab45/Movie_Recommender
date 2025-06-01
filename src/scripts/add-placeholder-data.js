require('dotenv').config();
const { storeMovieWithEmbedding } = require('../app/lib/gemini');
const { initDatabase } = require('../app/lib/db');

// Sample placeholder movie data
const placeholderMovies = [
  {
    id: 10001, // Using a high ID to avoid potential conflicts with TMDb IDs
    title: 'Sci-Fi Adventure',
    overview: 'A group of explorers travel through a wormhole to a distant galaxy.',
    poster_path: '/placeholder1.jpg',
    vote_average: 8.5,
    vote_count: 1000,
    popularity: 50.0,
    release_date: '2023-01-15',
  },
  {
    id: 10002,
    title: 'Fantasy Epic',
    overview: 'A young hero discovers they have magical powers and must save their world from darkness.',
    poster_path: '/placeholder2.jpg',
    vote_average: 7.9,
    vote_count: 800,
    popularity: 45.0,
    release_date: '2022-11-20',
  },
  {
    id: 10003,
    title: 'Mystery Thriller',
    overview: 'A detective must uncover the truth behind a series of mysterious disappearances in a small town.',
    poster_path: '/placeholder3.jpg',
    vote_average: 7.2,
    vote_count: 600,
    popularity: 40.0,
    release_date: '2024-03-10',
  },
];

async function addPlaceholderData() {
  try {
    // Ensure database table exists
    await initDatabase(); // This function already handles CREATE EXTENSION and CREATE TABLE IF NOT EXISTS

    console.log('Adding placeholder movie data...');

    for (const movie of placeholderMovies) {
      console.log(`Storing movie: ${movie.title}`);
      await storeMovieWithEmbedding(movie);
    }

    console.log('Placeholder data added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding placeholder data:', error);
    process.exit(1);
  }
}

addPlaceholderData(); 