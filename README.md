# Movie Recommender

A Next.js application that provides movie recommendations using the OMDB API and Google's Generative AI.

## Features

- Movie search and recommendations
- Integration with OMDB API
- AI-powered movie suggestions
- PostgreSQL database integration



## Project Setup

1. Clone the repository:

git clone <https://github.com/Iamarnab45/Movie_Recommender>



2. Install dependencies:

npm install


3. Create a `.env.local` file in the root directory with the following variables:

# Database Configuration
DATABASE_URL=

# API Keys
OMDB_API_KEY=
GOOGLE_AI_API_KEY=




4. Initialize the database:

npm run init-db




5. Start the development server:

npm run dev




## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run init-db` - Initialize the database


## Environment Variables

### Required Variables

- `DATABASE_URL`: PostgreSQL connection string
- `OMDB_API_KEY`: API key from OMDB API
- `GOOGLE_AI_API_KEY`: API key from Google AI



## Database Setup

The application uses PostgreSQL as its database.



