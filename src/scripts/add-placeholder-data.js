require('dotenv').config({ path: '.env.local' });
const { storeMovieWithEmbedding } = require('../app/lib/gemini');
const axios = require('axios'); // Import axios
const { initDatabase } = require('../app/lib/db');

// List of search terms to get initial data from OMDB
const searchTerms = ['action', 'comedy', 'drama', 'sci-fi', 'horror'];

async function addRealData() {
  try {
    // Ensure database table exists
    await initDatabase(); // This function now drops and creates the OMDB schema table

    console.log('Adding real movie data from OMDB...');

    for (const term of searchTerms) {
      console.log(`Searching OMDB for term: ${term}`);
      const searchUrl = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${encodeURIComponent(term)}`;
      const searchResponse = await axios.get(searchUrl);

      if (searchResponse.data.Search) {
        for (const movieResult of searchResponse.data.Search) {
          // Fetch full details for each movie using its imdbID
          if (movieResult.imdbID && movieResult.Type === 'movie') { // Ensure it's a movie and has an ID
            console.log(`Fetching details for ${movieResult.Title} (${movieResult.Year})`);
            const detailUrl = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&i=${movieResult.imdbID}&plot=full`;
            const detailResponse = await axios.get(detailUrl);

            if (detailResponse.data && detailResponse.data.Response === 'True') {
              const movieData = detailResponse.data;
              console.log(`Storing movie: ${movieData.Title}`);
              // Store movie with embedding - need to update storeMovieWithEmbedding to handle OMDB data
              await storeMovieWithEmbedding(movieData); // Pass the OMDB movie data
            } else {
                console.warn(`Could not fetch details for ${movieResult.Title}: ${detailResponse.data.Error}`);
            }
          }
        }
      } else {
          console.warn(`No search results for term ${term}: ${searchResponse.data.Error}`);
      }
    }

    console.log('Real movie data added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding real data:', error);
    process.exit(1);
  }
}

// Change the function call from addPlaceholderData to addRealData
addRealData(); 