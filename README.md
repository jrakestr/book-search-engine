# Book Search Engine

This is a full-stack application that allows users to search for books using the Google Books API and save their favorite books to their account.

## Features

- User authentication with JWT
- Book search using Google Books API
- Save and remove books from your personal collection
- GraphQL API for data retrieval and mutations

## Manual Testing Instructions

To test the application's functionality:

1. **User Authentication**
   - Navigate to the homepage and click "Login/Signup"
   - Create a new account by filling in the signup form
   - Log in with your credentials
   - Verify that you are logged in (your username should appear in the navbar)

2. **Book Search**
   - Use the search bar to find books by title, author, or keyword
   - Browse through the search results

3. **Saving Books**
   - Click "Save This Book!" on any book in the search results
   - Navigate to "See Your Books" to view your saved collection

4. **Removing Books**
   - In your saved books page, click "Delete This Book!" to remove it from your collection
   - Refresh the page to verify the book has been removed

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the server directory with:
   ```
   JWT_SECRET=your_secret_key
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Production Build

To create a production build:

```
npm run build
```

Then start the server:

```
npm start
```

## Technologies Used

- Frontend: React, Bootstrap, Apollo Client
- Backend: Node.js, Express, GraphQL, Apollo Server
- Database: MongoDB with Mongoose ODM
- Authentication: JWT (JSON Web Tokens) 