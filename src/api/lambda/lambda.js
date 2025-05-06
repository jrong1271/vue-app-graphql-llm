const { ApolloServer } = require('@apollo/server');
const { startServerAndCreateLambdaHandler, handlers } = require('@as-integrations/aws-lambda');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Use the standard API Gateway v1 handler which is more compatible
exports.handler = startServerAndCreateLambdaHandler(
  server,
  // Use the standard API Gateway v1 handler
  handlers.createAPIGatewayProxyEventRequestHandler(),
  {
    context: async ({ event, context }) => {
      // Ensure headers exist to prevent undefined errors
      const headers = event && event.headers ? event.headers : {};
      
      return {
        headers,
        functionName: context ? context.functionName : 'unknown',
      };
    },
  }
);