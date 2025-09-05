# Civic Issue Reporting System - API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected routes, include the token in the Authorization header:

```
Authorization: Bearer your_token_here
```

## Endpoints

### Authentication

#### Register User

```
POST /users/register
```

Request Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "citizen" // Optional, defaults to "citizen"
}
```

Response:
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "citizen",
  "token": "jwt_token"
}
```

#### Login User

```
POST /users/login
```

Request Body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "citizen",
  "token": "jwt_token"
}
```

### Users

#### Get User Profile

```
GET /users/profile
```

Response:
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "citizen"
}
```

#### Update User Profile

```
PUT /users/profile
```

Request Body:
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "password": "newpassword123" // Optional
}
```

Response:
```json
{
  "_id": "user_id",
  "name": "John Updated",
  "email": "john.updated@example.com",
  "role": "citizen",
  "token": "new_jwt_token"
}
```

#### Get All Users (Admin Only)

```
GET /users
```

Response:
```json
[
  {
    "_id": "user_id_1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "citizen"
  },
  {
    "_id": "user_id_2",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
]
```

### Reports

#### Create Report

```
POST /reports
```

Request Body (multipart/form-data):
```
title: "Pothole on Main Street"
description: "Large pothole causing traffic issues"
location: {"type":"Point","coordinates":[-73.9857, 40.7484]}
category: "Roads"
priority: "high" // Optional, defaults to "medium"
images: [file1, file2, ...] // Optional, up to 5 images
```

Response:
```json
{
  "_id": "report_id",
  "title": "Pothole on Main Street",
  "description": "Large pothole causing traffic issues",
  "location": {
    "type": "Point",
    "coordinates": [-73.9857, 40.7484]
  },
  "category": "Roads",
  "priority": "high",
  "status": "pending",
  "images": ["/uploads/image-123.jpg", "/uploads/image-456.jpg"],
  "reportedBy": "user_id",
  "assignedDepartment": "Public Works",
  "createdAt": "2023-07-01T12:00:00.000Z",
  "updatedAt": "2023-07-01T12:00:00.000Z"
}
```

#### Get All Reports

```
GET /reports
```

Query Parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `status`: Filter by status (optional)
- `category`: Filter by category (optional)
- `priority`: Filter by priority (optional)

Response:
```json
{
  "reports": [
    {
      "_id": "report_id_1",
      "title": "Pothole on Main Street",
      "description": "Large pothole causing traffic issues",
      "location": {
        "type": "Point",
        "coordinates": [-73.9857, 40.7484]
      },
      "category": "Roads",
      "priority": "high",
      "status": "pending",
      "images": ["/uploads/image-123.jpg"],
      "reportedBy": {
        "_id": "user_id",
        "name": "John Doe"
      },
      "assignedDepartment": "Public Works",
      "createdAt": "2023-07-01T12:00:00.000Z",
      "updatedAt": "2023-07-01T12:00:00.000Z"
    }
  ],
  "page": 1,
  "pages": 5,
  "total": 45
}
```

#### Get Report by ID

```
GET /reports/:id
```

Response:
```json
{
  "_id": "report_id",
  "title": "Pothole on Main Street",
  "description": "Large pothole causing traffic issues",
  "location": {
    "type": "Point",
    "coordinates": [-73.9857, 40.7484]
  },
  "category": "Roads",
  "priority": "high",
  "status": "pending",
  "images": ["/uploads/image-123.jpg"],
  "reportedBy": {
    "_id": "user_id",
    "name": "John Doe"
  },
  "assignedDepartment": "Public Works",
  "assignedTo": null,
  "comments": [],
  "createdAt": "2023-07-01T12:00:00.000Z",
  "updatedAt": "2023-07-01T12:00:00.000Z"
}
```

#### Update Report Status

```
PUT /reports/:id/status
```

Request Body:
```json
{
  "status": "in_progress"
}
```

Response:
```json
{
  "_id": "report_id",
  "status": "in_progress",
  "assignedTo": "staff_user_id",
  "updatedAt": "2023-07-02T10:30:00.000Z"
}
```

#### Add Comment to Report

```
POST /reports/:id/comments
```

Request Body:
```json
{
  "text": "Scheduled for repair next week"
}
```

Response:
```json
{
  "_id": "report_id",
  "comments": [
    {
      "text": "Scheduled for repair next week",
      "user": {
        "_id": "user_id",
        "name": "Staff Member"
      },
      "createdAt": "2023-07-02T14:15:00.000Z"
    }
  ],
  "updatedAt": "2023-07-02T14:15:00.000Z"
}
```

#### Get Nearby Reports

```
GET /reports/near
```

Query Parameters:
- `lng`: Longitude (required)
- `lat`: Latitude (required)
- `distance`: Distance in meters (default: 1000)

Response:
```json
[
  {
    "_id": "report_id_1",
    "title": "Pothole on Main Street",
    "location": {
      "type": "Point",
      "coordinates": [-73.9857, 40.7484]
    },
    "category": "Roads",
    "status": "pending",
    "distance": 450
  },
  {
    "_id": "report_id_2",
    "title": "Broken Streetlight",
    "location": {
      "type": "Point",
      "coordinates": [-73.9870, 40.7490]
    },
    "category": "Lighting",
    "status": "in_progress",
    "distance": 680
  }
]
```

#### Get Report Statistics

```
GET /reports/stats
```

Response:
```json
{
  "byStatus": {
    "pending": 25,
    "in_progress": 15,
    "resolved": 30,
    "rejected": 5
  },
  "byCategory": {
    "Roads": 20,
    "Lighting": 15,
    "Sanitation": 25,
    "Water": 10,
    "Other": 5
  },
  "byPriority": {
    "low": 20,
    "medium": 35,
    "high": 20
  },
  "dailyReports": [
    {
      "date": "2023-06-25",
      "count": 5
    },
    {
      "date": "2023-06-26",
      "count": 8
    },
    {
      "date": "2023-06-27",
      "count": 12
    },
    {
      "date": "2023-06-28",
      "count": 7
    },
    {
      "date": "2023-06-29",
      "count": 10
    },
    {
      "date": "2023-06-30",
      "count": 15
    },
    {
      "date": "2023-07-01",
      "count": 18
    }
  ]
}
```

### Departments

#### Create Department (Admin Only)

```
POST /departments
```

Request Body:
```json
{
  "name": "Public Works",
  "description": "Responsible for roads and infrastructure",
  "categories": ["Roads", "Bridges", "Sidewalks"],
  "head": "user_id" // Optional
}
```

Response:
```json
{
  "_id": "department_id",
  "name": "Public Works",
  "description": "Responsible for roads and infrastructure",
  "categories": ["Roads", "Bridges", "Sidewalks"],
  "head": "user_id",
  "createdAt": "2023-07-01T12:00:00.000Z",
  "updatedAt": "2023-07-01T12:00:00.000Z"
}
```

#### Get All Departments

```
GET /departments
```

Response:
```json
[
  {
    "_id": "department_id_1",
    "name": "Public Works",
    "description": "Responsible for roads and infrastructure",
    "categories": ["Roads", "Bridges", "Sidewalks"],
    "head": {
      "_id": "user_id",
      "name": "Department Head",
      "email": "head@example.com"
    },
    "createdAt": "2023-07-01T12:00:00.000Z",
    "updatedAt": "2023-07-01T12:00:00.000Z"
  },
  {
    "_id": "department_id_2",
    "name": "Sanitation",
    "description": "Responsible for waste management",
    "categories": ["Garbage", "Recycling", "Street Cleaning"],
    "head": null,
    "createdAt": "2023-07-01T12:30:00.000Z",
    "updatedAt": "2023-07-01T12:30:00.000Z"
  }
]
```

#### Get Department by ID

```
GET /departments/:id
```

Response:
```json
{
  "_id": "department_id",
  "name": "Public Works",
  "description": "Responsible for roads and infrastructure",
  "categories": ["Roads", "Bridges", "Sidewalks"],
  "head": {
    "_id": "user_id",
    "name": "Department Head",
    "email": "head@example.com"
  },
  "createdAt": "2023-07-01T12:00:00.000Z",
  "updatedAt": "2023-07-01T12:00:00.000Z"
}
```

#### Update Department (Admin Only)

```
PUT /departments/:id
```

Request Body:
```json
{
  "name": "Public Works Department",
  "description": "Updated description",
  "categories": ["Roads", "Bridges", "Sidewalks", "Traffic Signals"],
  "head": "new_user_id"
}
```

Response:
```json
{
  "_id": "department_id",
  "name": "Public Works Department",
  "description": "Updated description",
  "categories": ["Roads", "Bridges", "Sidewalks", "Traffic Signals"],
  "head": "new_user_id",
  "updatedAt": "2023-07-02T10:00:00.000Z"
}
```

#### Delete Department (Admin Only)

```
DELETE /departments/:id
```

Response:
```json
{
  "message": "Department removed"
}
```

#### Get Department Categories

```
GET /departments/categories
```

Response:
```json
[
  "Roads",
  "Bridges",
  "Sidewalks",
  "Traffic Signals",
  "Garbage",
  "Recycling",
  "Street Cleaning",
  "Water Supply",
  "Drainage",
  "Street Lighting",
  "Parks",
  "Public Buildings"
]
```

## Error Responses

All endpoints return appropriate HTTP status codes:

- `200 OK`: Request succeeded
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required or failed
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Server Error`: Internal server error

Error Response Format:
```json
{
  "success": false,
  "error": "Error message details"
}
```