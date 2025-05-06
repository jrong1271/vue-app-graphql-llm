import { ApolloServer } from '@apollo/server'
import { startServerAndCreateLambdaHandler, handlers } from '@as-integrations/aws-lambda'

import typeDefs from './schema'
import resolvers from './resolvers'

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

// Use the standard API Gateway v1 handler which is more compatible
exports.handler = startServerAndCreateLambdaHandler(
  server,
  // Use the standard API Gateway v1 handler
  handlers.createAPIGatewayProxyEventRequestHandler(),
  {
    context: async ({ event, context }) => {
      // Ensure headers exist to prevent undefined errors
      const headers = event && event.headers ? event.headers : {}

      return {
        headers,
        functionName: context ? context.functionName : 'unknown',
      }
    },
  },
)
