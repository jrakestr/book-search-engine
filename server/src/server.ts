import express from 'express';
import type * as Express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './config/connection.js';
import routes from './routes/index.js';
import { ApolloServer } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import { typeDefs, resolvers } from './schema/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static assets from the client build directory
app.use(express.static(path.join(__dirname, '../client')));

// Apply API routes - removing the /api prefix since it's already in the routes/index.ts file
app.use(routes);

// Handle process termination
process.on('SIGINT', () => {
  void db.close().then(() => {
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  });
});

db.once('open', async () => {
  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }: { req: Express.Request }) => {
      const authHeader = req.headers.authorization;
      console.log('Auth header received:', authHeader ? authHeader.substring(0, 20) + '...' : 'None');
      
      if (authHeader) {
        try {
          // Extract the token from the Bearer format
          const token = authHeader.startsWith('Bearer ') 
            ? authHeader.split(' ')[1] 
            : authHeader;
            
          console.log('Extracted token for verification:', token.substring(0, 15) + '...');
          
          const secretKey = process.env.JWT_SECRET || 'defaultsecret';
          console.log('Using secret key:', secretKey ? 'Secret provided' : 'Default secret');
          
          const decoded = jwt.verify(token, secretKey);
          console.log('Token verified successfully, decoded payload:', decoded);
          
          return { user: decoded };
        } catch (err) {
          console.error('JWT verification error:', err);
        }
      }
      
      console.log('No auth token or verification failed, returning empty context');
      return {};
    },
    introspection: true,
  });
  
  // Start Apollo Server
  await server.start();
  
  // Apply middleware
  server.applyMiddleware({ 
    app,
    path: '/graphql'
  });
  
  // Add catch-all route for client-side routing
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
  });
  
  // Start Express server
  const httpServer = app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}`);
    console.log(`GraphQL ready at http://localhost:${PORT}${server.graphqlPath}`);
  });

  // Proper shutdown handling
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    httpServer.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
});
