// Vercel serverless function wrapper for Express app
// This allows Express to run as a serverless function on Vercel
// The Express app handles all routes starting with /api/
const app = require('../backend/server.js');

module.exports = app;
