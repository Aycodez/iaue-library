# Database Viewer Guide

## Overview

This project includes two ways to view your MongoDB database in table format:

1. **Mobile/Web App Viewer** - Integrated into your React Native app
2. **Standalone HTML Viewer** - A simple HTML page that can be opened in any browser

## Option 1: Mobile/Web App Viewer (database-viewer.tsx)

### Access

- Navigate to the Lecturer Dashboard
- Click the "📊 View Database Tables" button
- Or directly navigate to `/database-viewer` route

### Features

- View Users, Textbooks, and Purchases collections
- Tab-based interface for switching between collections
- Real-time data fetching from your API
- Summary statistics with total counts and revenue
- Responsive design for mobile and web

### Requirements

Your backend API must have these endpoints:

- `GET /api/users` - Returns all users
- `GET /api/textbooks` - Returns all textbooks
- `GET /api/purchases` - Returns all purchases

## Option 2: Standalone HTML Viewer (database-viewer.html)

### Setup

1. Open `database-viewer.html` in a text editor
2. Find this line: `const API_URL = 'http://localhost:5000/api';`
3. Change it to your actual server URL
4. Save the file

### Usage

1. Make sure your backend server is running
2. Double-click `database-viewer.html` to open in your browser
3. The page will automatically load and display all data
4. Click "🔄 Refresh Data" to reload the data

### Features

- Beautiful gradient design
- All three collections displayed in tables
- Statistics cards showing:
  - Total Users
  - Total Textbooks
  - Total Purchases
  - Total Revenue
- Tab navigation between collections
- Auto-refresh capability
- Timestamp of last update

## Data Displayed

### Users Table

- ID
- Full Name
- Email
- Role (with color-coded badges)

### Textbooks Table

- ID
- Title
- Author
- Category
- Price
- Lecturer Name
- ISBN
- Upload Date

### Purchases Table

- ID
- Student ID
- Textbook Title
- Amount
- Purchase Date

## Backend Requirements

Your backend needs to return data in this format:

### Users Response

```json
{
  "data": [
    {
      "_id": "123",
      "fullName": "John Doe",
      "email": "john@example.com",
      "role": "student"
    }
  ]
}
```

### Textbooks Response

```json
{
  "data": [
    {
      "_id": "456",
      "title": "Introduction to Computer Science",
      "author": "Dr. Smith",
      "category": "Computer Science",
      "price": 45.99,
      "lecturerName": "Prof. Johnson",
      "isbn": "978-123-456",
      "updatedAt": "2025-11-17T10:00:00Z"
    }
  ]
}
```

### Purchases Response

```json
{
  "data": [
    {
      "_id": "789",
      "studentId": "123",
      "textbookId": "456",
      "amount": 45.99,
      "createdAt": "2025-11-17T10:00:00Z",
      "textbook": {
        "title": "Introduction to Computer Science"
      }
    }
  ]
}
```

## Troubleshooting

### CORS Issues (HTML Viewer)

If you get CORS errors in the browser console:

1. Make sure your backend has CORS enabled
2. Add your frontend domain to CORS allowed origins
3. For local testing, you may need to run with `--disable-web-security` flag (not recommended for production)

### Data Not Loading

1. Check that your backend server is running
2. Verify the API_URL is correct
3. Check browser console for error messages
4. Verify your backend endpoints return the correct data format

### Authentication Issues

If your API requires authentication:

1. For the React Native app - authentication is handled automatically via axios interceptors
2. For the HTML viewer - you may need to add authentication headers in the fetch requests

## For Your Supervisor

The standalone HTML viewer (`database-viewer.html`) is the easiest way to demonstrate your database:

1. Just open the file in a web browser
2. All data is displayed in clean, professional tables
3. No need to login or navigate through the app
4. Can be easily shared or screen-shared

## Screenshots/Demo

The viewer displays:

- ✅ All MongoDB collections in table format
- ✅ Color-coded data for better visualization
- ✅ Summary statistics
- ✅ Professional, modern design
- ✅ Easy navigation between collections

Perfect for demonstrations, presentations, or project reviews!
