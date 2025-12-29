// Production environment configuration
// For Vercel deployment:
// - If deploying frontend and backend separately, set NG_APP_API_URL to your backend URL
// - If deploying as monorepo, use '/api' for relative path
export const environment = {
  production: true,
  // Default to relative path for same-domain API (monorepo deployment)
  // Override with NG_APP_API_URL environment variable in Vercel for separate deployments
  apiUrl: '/api'
};

