const serverless = require('serverless-http');
const app = require('../../backend/server');

// Export the Express app wrapped in serverless-http for Netlify Functions
exports.handler = serverless(app);

