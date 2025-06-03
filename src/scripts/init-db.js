require('dotenv').config({ path: '.env.local' });
const { initDatabase } = require('../app/lib/db');

async function main() {
  console.log('Attempting to connect to database with URL:', process.env.DATABASE_URL);
  try {
    await initDatabase();
    console.log('Database initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
}

main(); 