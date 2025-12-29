// Vercel serverless function wrapper for Express app
// This file is used by Vercel to handle API routes
const app = require('../server');

// Vercel expects a handler function
module.exports = app;

