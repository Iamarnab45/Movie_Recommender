const { Pool } = require('pg');
require('dotenv').config();

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
    // Enable pgvector extension
    await query('CREATE EXTENSION IF NOT EXISTS vector;');

    // Create movies table
    await query(`
      CREATE TABLE IF NOT EXISTS movies (
        id SERIAL PRIMARY KEY,
        tmdb_id INT UNIQUE,
        title TEXT,
        overview TEXT,
        poster_path TEXT,
        vote_average FLOAT,
        vote_count INT,
        popularity FLOAT,
        release_date DATE,
        embedding VECTOR(768)
      );
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

module.exports = {
  query,
  initDatabase
}; 