# GraphQL API with Lambda and PostgreSQL

A serverless GraphQL API using AWS Lambda, API Gateway, and PostgreSQL.

## Local Development

1. Create a `.env.local` file with your local database credentials:

```
NODE_ENV=development
LOCAL_PG_USER=postgres
LOCAL_PG_PASSWORD=your_local_password
LOCAL_PG_DB=your_local_db
PG_PORT=5432
JWT_SECRET=local-development-secret
```

2. Install dependencies:

```bash
npm install
```

3. Start the local server:

```bash
node -r dotenv/config index.js
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