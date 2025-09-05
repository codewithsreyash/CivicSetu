# Civic Reporter Admin Dashboard

## Setup

1. Install dependencies:

```
cd civic-admin
npm install
```

2. Configure API base URL:

Create `.env` in `civic-admin`:

```
REACT_APP_API_BASE_URL=http://localhost:5000
```

3. Start the app:

```
npm start
```

Open http://localhost:3000. Use an admin token in the browser via a login (to be added) or add `Authorization` header globally in development if needed.

A React web application for municipal staff to manage and respond to civic issues reported by citizens.

## Features

- Staff authentication and authorization
- Dashboard with key metrics and statistics
- Report management and status updates
- Department assignment and tracking
- Interactive map of reported issues
- Analytics and reporting tools
- User management (admin only)

## Project Structure

The admin dashboard is built using React with TypeScript and follows a feature-based organization:

```
/admin-dashboard
  /civic-admin
    /src
      /assets        # Images, fonts, and other static assets
      /components    # Reusable UI components
      /pages         # Page components
      /layouts       # Layout components
      /services      # API services
      /store         # State management
      /hooks         # Custom React hooks
      /utils         # Utility functions
      /types         # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
   ```
   cd civic-admin
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_API_URL=http://your-api-url:5000/api
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Building for Production

```
npm run build
```

This builds the app for production to the `build` folder.

## Testing

Run tests with:

```
npm test
```

## Key Dependencies

- React: UI library
- React Router: For navigation
- Axios: HTTP client
- Redux Toolkit: State management
- Material-UI: UI component library
- React Query: Data fetching and caching
- Recharts: For data visualization
- Leaflet: For map integration