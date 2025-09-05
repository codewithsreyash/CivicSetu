# Civic Reporter Mobile App

A React Native mobile application built with Expo for citizens to report civic issues.

## Features

- User authentication and registration
- Report civic issues with photos and location
- Track report status and updates
- View nearby reports on a map
- Receive notifications on report status changes
- User profile management

## Project Structure

The mobile app is built using Expo with TypeScript and follows a feature-based organization:

```
/mobile-app
  /CivicReporter
    /src
      /assets        # Images, fonts, and other static assets
      /components    # Reusable UI components
      /screens       # Screen components
      /navigation    # Navigation configuration
      /services      # API services and other external services
      /store         # State management
      /hooks         # Custom React hooks
      /utils         # Utility functions
      /types         # TypeScript type definitions
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional for local development)

### Installation

1. Install dependencies:
   ```
   cd CivicReporter
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   API_URL=http://your-api-url:5000/api
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Use the Expo Go app on your device to scan the QR code, or press 'a' to open in an Android emulator or 'i' to open in an iOS simulator.

## Building for Production

### For Android

```
eas build -p android
```

### For iOS

```
eas build -p ios
```

## Testing

Run tests with:

```
npm test
```

## Key Dependencies

- Expo: Framework for React Native development
- React Navigation: Navigation library
- Axios: HTTP client
- React Native Maps: For map integration
- Expo Location: For accessing device location
- Expo Camera: For taking photos
- Expo Notifications: For push notifications
- React Native Paper: UI component library