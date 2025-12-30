# Netlify Deployment Guide

This guide will help you deploy the Role-Based CMS to Netlify.

## Prerequisites

1. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
2. **MongoDB Atlas**: Set up a MongoDB Atlas cluster (free tier available)
3. **Cloudinary Account** (optional): For image uploads
4. **GitHub Repository**: Push your code to GitHub

## Step 1: Environment Variables

Before deploying, you need to set up the following environment variables in Netlify:

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
   - Your Netlify deployment URL (optional, auto-detected)
   - Example: `https://your-app.netlify.app`

## Step 2: Deploy to Netlify

### Option A: Deploy via Netlify Dashboard (Recommended)

1. **Go to Netlify**
   - Visit [app.netlify.com](https://app.netlify.com)
   - Sign up/Login with GitHub

2. **Import Your Project**
   - Click "Add new site" → "Import an existing project"
   - Select your GitHub repository: `assanlaye/role-based-cms`
   - Click "Import"

3. **Configure Build Settings**
   - **Build command**: `cd frontend && yarn build` (or leave empty, netlify.toml handles it)
   - **Publish directory**: `frontend/dist/frontend` (or leave empty, netlify.toml handles it)
   - Click "Deploy site"

4. **Add Environment Variables**
   - Go to Site settings → Environment variables
   - Add all the required variables listed above
   - Click "Save"

5. **Redeploy**
   - Go to Deploys tab
   - Click "Trigger deploy" → "Clear cache and deploy site"
   - ✅ Your app will be live at: `https://your-app.netlify.app`

### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**
   ```bash
   netlify login
   ```

3. **Initialize Site**
   ```bash
   netlify init
   ```
   - Follow prompts to link your site

4. **Set Environment Variables**
   ```bash
   netlify env:set MONGODB_URI "your-mongodb-uri"
   netlify env:set JWT_SECRET "your-jwt-secret"
   netlify env:set JWT_EXPIRE "1h"
   netlify env:set JWT_REFRESH_SECRET "your-refresh-secret"
   netlify env:set JWT_REFRESH_EXPIRE "7d"
   ```

5. **Deploy**
   ```bash
   netlify deploy --prod
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

1. Visit your Netlify deployment URL
2. Test the API: `https://your-app.netlify.app/api` (should show API info)
3. Test the frontend: `https://your-app.netlify.app`
4. Login with the SuperAdmin credentials

## Project Structure

The project is configured as a monorepo with:

- **Frontend**: Angular application (builds to `frontend/dist/frontend`)
- **Backend**: Express API (runs as Netlify Functions)

### Routing

- `/api/*` → Netlify Functions (backend)
- `/*` → Frontend Angular application (with SPA redirect)

## Troubleshooting

### Build Fails

1. Check build logs in Netlify dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version (Netlify uses Node 18 by default)

### API Not Working

1. Verify environment variables are set correctly
2. Check MongoDB connection string
3. Review function logs in Netlify dashboard

### CORS Errors

1. Verify `FRONTEND_URL` environment variable matches your deployment URL
2. Check CORS configuration in `backend/server.js`

### Database Connection Issues

1. Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0) or add Netlify IPs
2. Verify connection string format
3. Check database user permissions

### 404 Errors on Routes

1. Ensure `netlify.toml` has the SPA redirect rule
2. Check that Angular build completed successfully
3. Verify publish directory is correct

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
| FRONTEND_URL | No | Frontend URL for CORS | `https://app.netlify.app` |

## Additional Notes

- The backend runs as Netlify Functions, so cold starts may occur
- MongoDB connections are reused when possible
- Static files are served from Netlify's CDN
- All API routes are prefixed with `/api`
- Angular routing is handled by the SPA redirect in `netlify.toml`

## Support

For issues or questions:
1. Check Netlify deployment logs
2. Review function logs
3. Verify environment variables
4. Test API endpoints directly

