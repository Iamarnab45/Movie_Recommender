require('dotenv').config({ path: '.env.local' });
const { query } = require('./src/app/lib/db');

const targetImdbID = 'tt0073629'; // The imdbID of the movie to check (The Rocky Horror Picture Show)

async function checkMovie() {
  try {
    console.log(`Checking for movie with imdbID: ${targetImdbID} in the database.`);
    const result = await query('SELECT imdbid, title, embedding IS NOT NULL as has_embedding FROM movies WHERE imdbid = $1', [targetImdbID]);

    if (result.rows.length > 0) {
      console.log('Movie found in DB:', result.rows[0]);
    } else {
      console.log('Movie not found in DB.');
    }
  } catch (err) {
    console.error('DB query error:', err);
  }
}

checkMovie(); 