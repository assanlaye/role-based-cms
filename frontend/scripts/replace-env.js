// Build-time script to replace API URL in environment.prod.ts
// This allows Vercel to inject environment variables at build time
const fs = require('fs');
const path = require('path');

const envFile = path.join(__dirname, '../src/environments/environment.prod.ts');
// Default to Render backend URL if not specified
const apiUrl = process.env.NG_APP_API_URL || 'https://role-based-cms.onrender.com/api';

let content = fs.readFileSync(envFile, 'utf8');

// Replace the apiUrl value
content = content.replace(
  /apiUrl:\s*['"`][^'"`]*['"`]/,
  `apiUrl: '${apiUrl}'`
);

fs.writeFileSync(envFile, content, 'utf8');
console.log(`Updated API URL to: ${apiUrl}`);

