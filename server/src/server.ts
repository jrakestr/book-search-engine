import express from 'express';
import type * as Express from 'express';
import path from 'node:path';
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

// if we're in production, serve client/dist as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client')));

  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'client/index.html'));
  });
}

// Apply routes before the catch-all route
app.use(routes);

// Handle process termination
process.on('SIGINT', () => {
  void db.close().then(() => {
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  });
});

db.once('open', async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }: { req: Express.Request }) => {
      const token = req.headers.authorization || '';
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');
          return { user: decoded };
        } catch (err) {
          console.error('Invalid token', err);
        }
      }
      return {};
    },
    introspection: process.env.NODE_ENV !== 'production'
  });
  await server.start();
  server.applyMiddleware({ app });
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
