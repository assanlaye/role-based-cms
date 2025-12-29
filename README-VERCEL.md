# Vercel Deployment Guide

This project is set up for deployment to Vercel with separate frontend and backend deployments.

## Deployment Options

### Option 1: Separate Deployments (Recommended)

Deploy the frontend and backend as separate Vercel projects for better scalability and independent deployments.

#### Frontend Deployment

1. **Connect Frontend to Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your Git repository
   - Set the **Root Directory** to `frontend`

2. **Configure Build Settings:**
   - Framework Preset: Other
   - Build Command: `npm run build` (or `npm run vercel-build`)
   - Output Directory: `.angular`
   - Install Command: `npm install`

3. **Environment Variables:**
   Add the following environment variable:
   ```
   NG_APP_API_URL=https://your-backend-url.vercel.app/api
   ```
   Replace `your-backend-url.vercel.app` with your actual backend Vercel URL.

#### Backend Deployment

1. **Connect Backend to Vercel:**
   - Create a new Vercel project
   - Set the **Root Directory** to `backend`

2. **Configure Build Settings:**
   - Framework Preset: Other
   - Build Command: (leave empty or `npm install`)
   - Output Directory: (leave empty)
   - Install Command: `npm install`

3. **Environment Variables:**
   Add all environment variables from your `.env` file:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   JWT_EXPIRE=1h
   JWT_REFRESH_EXPIRE=7d
   FRONTEND_URL=https://your-frontend-url.vercel.app
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   NODE_ENV=production
   ```

### Option 2: Monorepo Deployment

If you prefer to deploy both frontend and backend in a single Vercel project:

1. Create a root-level `vercel.json` file (see below)
2. Deploy from the root directory
3. Configure environment variables for both frontend and backend

## Root-Level Vercel Configuration (Monorepo)

A `vercel.json` file has been created in the root directory for monorepo deployment. This configuration:
- Builds the frontend as a static site
- Deploys the backend as serverless functions
- Routes `/api/*` requests to the backend
- Routes all other requests to the frontend (for SPA routing)

**Note:** For monorepo deployment, you don't need to set `NG_APP_API_URL` in the frontend since it will use the relative `/api` path.

## Important Notes

1. **CORS Configuration:** The backend is configured to accept requests from the frontend URL. Make sure `FRONTEND_URL` in backend environment variables matches your frontend deployment URL.

2. **MongoDB:** Ensure your MongoDB database is accessible from Vercel's servers. Consider using MongoDB Atlas for cloud-hosted databases.

3. **File Uploads:** The backend uses Cloudinary for file uploads. Make sure your Cloudinary credentials are set in the backend environment variables.

4. **API URL:** The frontend uses environment variables to determine the API URL. In production, it will use `/api` (relative path) or the `NG_APP_API_URL` environment variable if set.

5. **Build Output:** Angular's new build system outputs to `.angular` directory by default. This is configured in `frontend/vercel.json`.

## Post-Deployment

After deployment:

1. Update the frontend's `NG_APP_API_URL` to point to your backend URL
2. Update the backend's `FRONTEND_URL` to point to your frontend URL
3. Test the API endpoints to ensure connectivity
4. Verify CORS is working correctly

## Troubleshooting

- **Build Failures:** Check that all dependencies are listed in `package.json`
- **API Not Found:** Verify the API routes are correctly configured in `backend/vercel.json`
- **CORS Errors:** Ensure `FRONTEND_URL` in backend matches your frontend deployment URL
- **Environment Variables:** Double-check all required environment variables are set in Vercel dashboard

