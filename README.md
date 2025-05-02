# Finance Vue App

## API Configuration

This application can connect to either a remote GraphQL API or a local development server.

### Switching between remote and local API

1. By default, the app connects to the remote API at `https://0isr0jxbc8.execute-api.us-east-1.amazonaws.com/dev/`

2. To use a local GraphQL server:
   - Create a `.env.local` file in the project root
   - Add `API_LOCAL=true` to the file
   - Start your local GraphQL server on port 4000
   - Restart the Vue development server

3. To switch back to the remote API:
   - Change `API_LOCAL=false` in your `.env.local` file
   - Or delete the `.env.local` file to use the default configuration
   - Restart the Vue development server

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```