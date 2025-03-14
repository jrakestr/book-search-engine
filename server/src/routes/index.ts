import express from 'express';
const router = express.Router();

import apiRoutes from './api/index.js';

router.use('/api', apiRoutes);

// We're removing the catch-all route since we're using Vite for development
// and we don't want to interfere with the GraphQL endpoint

export default router;
