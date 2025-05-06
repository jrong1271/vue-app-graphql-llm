import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
// Load environment variables from .env.local
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import typeDefs from './schema.js' // Add .js extension
import resolvers from './resolvers.js' // Add .js extension

// Set NODE_ENV to development for local server if not already set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development'
}

async function startServer() {
  const app = express()

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (error) => {
      console.error('GraphQL Error:', error)
      return error
    },
  })

  await server.start()

  app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({
        headers: req.headers,
      }),
    }),
  )

  const port = process.env.PORT || 4000
  app.listen(port, () => {
    console.log(`🚀 Local server ready at http://localhost:${port}/graphql`)
    console.log(`Environment: ${process.env.NODE_ENV}`)
  })
}

startServer().catch((err) => {
  console.error('Failed to start server:', err)
})
