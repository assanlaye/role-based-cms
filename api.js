// Vercel serverless function entry point
// This file serves as the serverless function handler for all /api/* routes
const app = require('./backend/server.js');

module.exports = app;

