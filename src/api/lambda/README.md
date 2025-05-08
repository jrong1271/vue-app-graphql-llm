# GraphQL API with Lambda and PostgreSQL

A serverless GraphQL API using AWS Lambda, API Gateway, and PostgreSQL.

1. Install dependencies:

```bash
npm install
```

The GraphQL playground will be available at http://localhost:4000/graphql

## Deployment

1. Set up your AWS credentials for Serverless Framework

2. Deploy to AWS:

```bash
serverless deploy
```

## Environment Variables

For deployment, set these environment variables:

- `PG_HOST`: PostgreSQL host address
- `PG_USER`: PostgreSQL username
- `PG_PASSWORD`: PostgreSQL password
- `PG_DB`: PostgreSQL database name
- `JWT_SECRET`: Secret for JWT token generation/validation
