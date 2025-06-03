const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' }); // Ensure explicit loading

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function query(text, params) {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

async function initDatabase() {
  try {
    console.log('Attempting to connect to database with URL:', process.env.DATABASE_URL);

    // Enable pgvector extension
    await query('CREATE EXTENSION IF NOT EXISTS vector;');

    // Drop the existing movies table if it exists (to apply schema changes)
    await query('DROP TABLE IF EXISTS movies;');
    console.log('Dropped existing movies table (if it existed)');

    // Create movies table with OMDB-centric schema
    await query(`
      CREATE TABLE movies (
        imdbid TEXT PRIMARY KEY,
        title TEXT,
        year TEXT,
        rated TEXT,
        released TEXT,
        runtime TEXT,
        genre TEXT,
        director TEXT,
        writer TEXT,
        actors TEXT,
        plot TEXT,
        language TEXT,
        country TEXT,
        awards TEXT,
        poster TEXT,
        metascore TEXT,
        imdbrating TEXT,
        imdbvotes TEXT,
        type TEXT,
        embedding VECTOR(768)
      );
    `);

    console.log('Database initialized with OMDB schema successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

module.exports = {
  query,
  initDatabase
}; 