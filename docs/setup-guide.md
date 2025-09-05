# Civic Issue Reporting System - Setup Guide

This guide provides detailed instructions for setting up the complete Civic Issue Reporting System.

## System Requirements

- **Node.js**: v14.x or higher
- **MongoDB**: v4.4 or higher
- **npm** or **yarn**
- **Expo CLI** (for mobile app development)
- **Git** (for version control)

## Backend Server Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd civic-issue-reporter
```

### 2. Set Up the Backend Server

```bash
cd server
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the server directory with the following variables:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/civic-reporter
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=30d
```

### 4. Start the Development Server

```bash
npm run dev
```

The server will start on http://localhost:5000.

## Admin Dashboard Setup

### 1. Set Up the Admin Dashboard

```bash
cd admin-dashboard/civic-admin
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the admin-dashboard directory with the following variables:

```
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start the Development Server

```bash
npm start
```

The admin dashboard will start on http://localhost:3000.

## Mobile App Setup

### 1. Set Up the Mobile App

```bash
cd mobile-app/CivicReporter
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the mobile-app directory with the following variables:

```
API_URL=http://localhost:5000/api
```

### 3. Start the Development Server

```bash
npm start
```

This will start the Expo development server. You can run the app on:
- iOS Simulator
- Android Emulator
- Physical device using the Expo Go app

## Initial Setup

### 1. Create an Admin User

Use the following API endpoint to create an admin user:

```
POST http://localhost:5000/api/users/register

Body:
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123",
  "role": "admin"
}
```

### 2. Create Departments

Use the admin dashboard to create departments for issue assignment.

## Production Deployment

### Backend Server

1. Build the TypeScript code:
   ```bash
   cd server
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

### Admin Dashboard

1. Build the React app:
   ```bash
   cd admin-dashboard/civic-admin
   npm run build
   ```

2. Deploy the build folder to a static hosting service.

### Mobile App

1. Build the app for Android or iOS:
   ```bash
   cd mobile-app/CivicReporter
   eas build -p android
   # or
   eas build -p ios
   ```

2. Follow the Expo build instructions to generate installable app files.

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the connection string in the `.env` file

2. **API Connection Error**
   - Verify the API URL in the frontend `.env` files
   - Check if the backend server is running

3. **Expo Build Issues**
   - Ensure you have the latest Expo CLI
   - Check the Expo documentation for specific error messages