# Vercel Deployment Guide

This guide will help you deploy the Role-Based CMS to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **MongoDB Atlas**: Set up a MongoDB Atlas cluster (free tier available)
3. **Cloudinary Account** (optional): For image uploads
4. **GitHub Repository**: Push your code to GitHub

## Step 1: Environment Variables

Before deploying, you need to set up the following environment variables in Vercel:

### Required Variables

1. **MONGODB_URI**
   - Your MongoDB Atlas connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

2. **JWT_SECRET**
   - A random string for signing JWT access tokens
   - Generate with: `openssl rand -base64 32` or use any secure random string

3. **JWT_EXPIRE**
   - Access token expiration time
   - Example: `1h`, `24h`, `7d`

4. **JWT_REFRESH_SECRET**
   - A random string for signing JWT refresh tokens
   - Should be different from JWT_SECRET

5. **JWT_REFRESH_EXPIRE**
   - Refresh token expiration time
   - Example: `7d`, `30d`

### Optional Variables

6. **CLOUDINARY_CLOUD_NAME**
   - Your Cloudinary cloud name

7. **CLOUDINARY_API_KEY**
   - Your Cloudinary API key

8. **CLOUDINARY_API_SECRET**
   - Your Cloudinary API secret

9. **FRONTEND_URL**
   - Your Vercel deployment URL (optional, auto-configured)
   - Example: `https://your-app.vercel.app`

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure Project**
   - Vercel will automatically detect the `vercel.json` configuration
   - **Root Directory**: Leave as `.` (root)
   - **Framework Preset**: Other (or leave default)
   - Click "Deploy"

3. **Add Environment Variables**
   - After first deployment, go to Project Settings → Environment Variables
   - Add all the required variables listed above
   - Make sure to select "Production" environment

4. **Redeploy**
   - Go to Deployments tab
   - Click the three dots (⋯) on the latest deployment
   - Click "Redeploy"
   - ✅ Your app will be live at: `https://your-project-name.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   vercel env add JWT_EXPIRE
   vercel env add JWT_REFRESH_SECRET
   vercel env add JWT_REFRESH_EXPIRE
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Step 3: Post-Deployment Setup

After deployment, you need to seed the database:

### Seed Roles and SuperAdmin

Run locally (pointing to production MongoDB):

1. **Update your local `.env` file** in `backend/` folder:
   ```env
   MONGODB_URI=your-production-mongodb-uri
   JWT_SECRET=your-jwt-secret
   JWT_EXPIRE=1h
   JWT_REFRESH_SECRET=your-refresh-secret
   JWT_REFRESH_EXPIRE=7d
   ```

2. **Seed Roles**
   ```bash
   cd backend
   npm run seed
   ```

3. **Create SuperAdmin**
   ```bash
   npm run seed-admin
   ```

**Default SuperAdmin Credentials:**
- Email: `admin@cms.com`
- Password: `admin123`
- **⚠️ IMPORTANT: Change this password immediately after first login!**

## Step 4: Verify Deployment

1. Visit your Vercel deployment URL
2. Test the API: `https://your-app.vercel.app/api` (should show API info)
3. Test the frontend: `https://your-app.vercel.app`
4. Login with the SuperAdmin credentials

## Project Structure

The project is configured as a monorepo with:

- **Frontend**: Angular application (builds to `frontend/dist/frontend`)
- **Backend**: Express API (runs as serverless functions)

### Routing

- `/api/*` → Backend API routes
- `/*` → Frontend Angular application

## Troubleshooting

### Build Fails

1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version (Vercel uses Node 18+ by default)

### API Not Working

1. Verify environment variables are set correctly
2. Check MongoDB connection string
3. Review function logs in Vercel dashboard

### CORS Errors

1. Verify `FRONTEND_URL` environment variable matches your deployment URL
2. Check CORS configuration in `backend/server.js`

### Database Connection Issues

1. Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0) or add Vercel IPs
2. Verify connection string format
3. Check database user permissions

### 404 Errors

1. Ensure `vercel.json` is in the root directory
2. Check that Angular build completed successfully
3. Verify routing configuration in `vercel.json`

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| MONGODB_URI | Yes | MongoDB connection string | `mongodb+srv://...` |
| JWT_SECRET | Yes | JWT signing secret | Random string |
| JWT_EXPIRE | Yes | Access token expiry | `1h` |
| JWT_REFRESH_SECRET | Yes | Refresh token secret | Random string |
| JWT_REFRESH_EXPIRE | Yes | Refresh token expiry | `7d` |
| CLOUDINARY_CLOUD_NAME | No | Cloudinary cloud name | `your-cloud` |
| CLOUDINARY_API_KEY | No | Cloudinary API key | `123456789` |
| CLOUDINARY_API_SECRET | No | Cloudinary API secret | `secret-key` |
| FRONTEND_URL | No | Frontend URL for CORS | `https://app.vercel.app` |

## Additional Notes

- The backend runs as serverless functions, so cold starts may occur
- MongoDB connections are reused when possible
- Static files are served from Vercel's CDN
- All API routes are prefixed with `/api`
- Angular routing is handled by the catch-all route in `vercel.json`

## Support

For issues or questions:
1. Check Vercel deployment logs
2. Review backend function logs
3. Verify environment variables
4. Test API endpoints directly

