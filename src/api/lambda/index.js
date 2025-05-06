const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

// Set NODE_ENV to development for local server if not already set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

// Log environment variables for debugging
console.log('Environment variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('LOCAL_PG_USER:', process.env.LOCAL_PG_USER);
console.log('LOCAL_PG_DB:', process.env.LOCAL_PG_DB);

async function startServer() {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      return error;
    },
  });

  await server.start();

  app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({
        headers: req.headers,
      }),
    })
  );

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`🚀 Local server ready at http://localhost:${port}/graphql`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});