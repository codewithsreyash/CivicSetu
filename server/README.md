# Server

## Setup

1. Copy `.env.example` to `.env` and fill values:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/civic-reporter
JWT_SECRET=please_change_me
JWT_EXPIRES_IN=1d
```

2. Install and run:

```
npm install
npm run dev
```

Uploads are served from `/uploads`.

# Civic Reporter Backend API

This is the backend API for the Civic Reporter application, built with Node.js, Express, TypeScript, and MongoDB.

## Features

- User authentication and authorization
- Report creation and management
- Department management
- File uploads for report images
- Geospatial queries for nearby reports
- Analytics and statistics

## Project Structure

```
/server
  /src
    /config       # Configuration files
    /controllers  # Route controllers
    /middleware   # Custom middleware
    /models       # Database models
    /routes       # API routes
    /utils        # Utility functions
    index.ts      # Entry point
  /uploads        # Uploaded files
  /dist           # Compiled JavaScript
```

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login and get token

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (admin only)

### Reports

- `POST /api/reports` - Create a new report
- `GET /api/reports` - Get all reports
- `GET /api/reports/:id` - Get report by ID
- `PUT /api/reports/:id/status` - Update report status
- `POST /api/reports/:id/comments` - Add comment to report
- `GET /api/reports/near` - Get nearby reports
- `GET /api/reports/stats` - Get report statistics

### Departments

- `POST /api/departments` - Create a new department (admin only)
- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get department by ID
- `PUT /api/departments/:id` - Update department (admin only)
- `DELETE /api/departments/:id` - Delete department (admin only)
- `GET /api/departments/categories` - Get all department categories

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=30d
   ```
4. Start the development server:
   ```
   npm run dev
   ```

### Build for Production

```
npm run build
npm start
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected routes, include the token in the Authorization header:

```
Authorization: Bearer your_token_here
```