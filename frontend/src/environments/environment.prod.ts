// Production environment configuration
// For separate backend deployment (e.g., Render):
// - Set the backend URL here or use NG_APP_API_URL environment variable in build
// - The replace-env.js script will replace this value at build time if NG_APP_API_URL is set
// - For monorepo deployment, use '/api' for relative path
export const environment = {
  production: true,
  // Default to Render backend URL - can be overridden by NG_APP_API_URL env var at build time
  apiUrl: 'https://role-based-cms.onrender.com/api'
};

