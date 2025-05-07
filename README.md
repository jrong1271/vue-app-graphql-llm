# Finance Vue App

A modern Vue 3 application showcasing various features and integrations.

## Features

### Todo List Management
- Add, complete, and delete todos
- Persistent storage using localStorage
- Visual feedback:
  - Hover effects for delete actions
  - Strikethrough effect for completed items
  - Clean, minimal UI with icons

### AI Assistant Integration
- Interactive chat interface
- Real-time conversation
- Loading indicators for responses
- Error handling and feedback

### Navigation
- Responsive menu system
- Dropdown support for nested navigation
- Application demo section with:
  - Calculator
  - Data Table

### Authentication
- Secure login system
- Password visibility toggle
- Loading states during authentication
- Session management

## Project Setup

### Local Development

```bash
# Install dependencies
npm install

# Start both Vue frontend and Lambda backend
npm run dev

# This will start:
# - Vue app on port 5173
# - Lambda functions on port 4000
```

### API Configuration

1. **Remote API (Default)**
   - Uses `https://0isr0jxbc8.execute-api.us-east-1.amazonaws.com/dev/`

2. **Local Development**
   ```bash
   # Create .env.local file
   echo "API_LOCAL=true" > .env.local
   
   # Start the development server
   npm run dev
   ```

3. **Switch to Remote API**
   ```bash
   # Either modify .env.local
   echo "API_LOCAL=false" > .env.local
   
   # Or remove .env.local entirely
   rm .env.local
   ```

## Project Structure

```
src/
├── api/
│   └── lambda/          # Local GraphQL server
├── components/
│   ├── AIAssistant/    # AI chat interface
│   └── ToDo/           # Todo list components
├── views/              # Page components
├── stores/            # State management
└── router/            # Navigation setup
```

## Technologies Used

- Vue 3 with Composition API
- TypeScript for type safety
- GraphQL for API interactions
- Local storage for data persistence
- CSS modules for styling

## Development Commands

```bash
# Start development servers (frontend + lambda)
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Format code
npm run format
```