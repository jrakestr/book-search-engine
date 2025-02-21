# Deployment Guide: Book Search Engine

This guide will walk you through deploying the Book Search Engine to Render with MongoDB Atlas.

## Step 1: Prepare MongoDB for Production

1. Get your production MongoDB connection string:
   - Log into [MongoDB Atlas](https://cloud.mongodb.com)
   - Go to your existing cluster
   - Click "Connect"
   - Choose "Drivers"
   - Copy your connection string

2. Update network access for Render:
   - In MongoDB Atlas, go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - This is required because Render uses dynamic IPs

3. Verify your database user:
   - Go to "Database Access"
   - Ensure your existing user has the correct permissions
   - If needed, update the password and save it securely

Note: Keep your connection string safe - you'll need it for the Render deployment

## Step 2: Prepare Your Application

1. Update your server's connection:
   Create a `.env` file in the server directory:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secret_key
   ```

2. Update the client's API endpoint:
   In `client/src/apolloClient.ts`, ensure your URI is configurable:
   ```typescript
   const httpLink = createHttpLink({
     uri: process.env.NODE_ENV === 'production' 
       ? '/graphql'
       : 'http://localhost:3001/graphql'
   });
   ```

3. Add a build script to your root package.json:
   ```json
   {
     "scripts": {
       "build": "cd client && npm run build"
     }
   }
   ```

## Step 3: Deploy to Render

1. Create a Render account:
   - Go to [Render](https://render.com)
   - Sign up for a free account
   - Connect your GitHub repository

2. Create a Web Service for the backend:
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repo
   - Configure the service:
     - Name: `book-search-engine-backend`
     - Environment: `Node`
     - Build Command: `cd server && npm install && npm run build`
     - Start Command: `cd server && npm start`
   - Add environment variables:
     ```
     MONGODB_URI=your_mongodb_atlas_connection_string
     JWT_SECRET=your_secret_key
     NODE_ENV=production
     ```
   - Click "Create Web Service"

3. Create a Static Site for the frontend:
   - Click "New +"
   - Select "Static Site"
   - Connect your GitHub repo
   - Configure the build:
     - Name: `book-search-engine-frontend`
     - Build Command: `cd client && npm install && npm run build`
     - Publish Directory: `client/dist`
   - Add environment variable:
     ```
     VITE_API_URL=https://your-backend-service-url.onrender.com
     ```
   - Click "Create Static Site"

## Step 4: Verify Deployment

1. Wait for both services to deploy (this may take a few minutes)
2. Visit your frontend URL (provided by Render)
3. Test the following functionality:
   - User registration
   - User login
   - Book search
   - Saving books
   - Viewing saved books
   - Removing saved books

## Troubleshooting

1. If the frontend can't connect to the backend:
   - Check your API endpoint configuration
   - Verify environment variables
   - Check CORS settings in your server

2. If database connections fail:
   - Verify MongoDB Atlas connection string
   - Check if IP access is properly configured
   - Verify database user credentials

3. For build errors:
   - Check Render logs for both services
   - Verify all dependencies are properly listed in package.json
   - Ensure all required environment variables are set

## Maintenance

1. Monitor your application:
   - Use Render's logging features
   - Check MongoDB Atlas metrics
   - Monitor for any performance issues

2. Regular updates:
   - Keep dependencies updated
   - Monitor security advisories
   - Backup your database regularly

Need help? Contact support or refer to:
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
