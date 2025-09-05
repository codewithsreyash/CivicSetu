# Civic Issue Reporting System

A comprehensive solution for local governments to manage civic issues reported by citizens.

## Project Overview

This system consists of three main components:

1. **Mobile Application**: A React Native app built with Expo that allows citizens to report civic issues with photos, location data, and descriptions.
2. **Admin Dashboard**: A React web application for municipal staff to manage and respond to reported issues.
3. **Backend Server**: A Node.js/Express API with TypeScript and MongoDB that handles data storage and business logic.

## Features

- Real-time issue reporting with photo uploads and location tagging
- Interactive map showing reported issues
- Automated routing of issues to relevant departments
- Status tracking and notifications
- Analytics and reporting dashboard
- User authentication and authorization

## Project Structure

```
/
  /mobile-app/         # React Native mobile application with Expo
  /admin-dashboard/    # React web application for administrative use
  /server/             # Node.js/Express backend server with TypeScript
  /docs/               # Documentation
```

## Getting Started

See the README files in each directory for specific setup instructions:

- [Mobile App Setup](./mobile-app/README.md)
- [Admin Dashboard Setup](./admin-dashboard/README.md)
- [Backend Server Setup](./server/README.md)

## System Architecture

The system follows a client-server architecture:

- **Frontend Clients**: Mobile app (React Native/Expo) and admin dashboard (React)
- **Backend API**: RESTful API built with Express and TypeScript
- **Database**: MongoDB for data storage
- **File Storage**: Local file system for storing uploaded images

## API Documentation

The API documentation is available in the [server README](./server/README.md).

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB
- Expo CLI (for mobile app development)

### Running the Full Stack Locally

1. Start the backend server:
   ```
   cd server
   npm install
   npm run dev
   ```

2. Start the admin dashboard:
   ```
   cd admin-dashboard/civic-admin
   npm install
   npm start
   ```

3. Start the mobile app:
   ```
   cd mobile-app/CivicReporter
   npm install
   npm start
   ```

## License

This project is licensed under the MIT License.