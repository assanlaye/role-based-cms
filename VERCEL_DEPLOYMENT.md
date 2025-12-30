# Vercel Deployment Guide

This guide will walk you through deploying your Role-Based CMS to Vercel.

## Prerequisites

Before starting, make sure you have:
- A GitHub account with your code pushed to a repository
- A MongoDB Atlas account (or MongoDB connection string)
- A Vercel account (sign up at [vercel.com](https://vercel.com))

## Step-by-Step Instructions

### Step 1: Connect Your Repository to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"** or **"New Project"**
3. Import your GitHub repository
   - If this is your first time, you'll need to authorize Vercel to access your GitHub
   - Select the repository: `assanlaye/role-based-cms` (or your repo name)
   - Click **"Import"**

### Step 2: Configure Project Settings

**IMPORTANT: Do NOT click "Deploy" yet!** First, configure these settings:

1. **Framework Preset**: Select **"Other"** (or leave as default)
2. **Root Directory**: Leave as **"."** (root directory)
3. **Build Command**: Enter:
   ```
   cd frontend && yarn install && yarn build
   ```
4. **Output Directory**: Enter:
   ```
   frontend/dist/browser
   ```
5. **Install Command**: Leave empty (or use `yarn install` if needed)

### Step 3: Add Environment Variables

Before deploying, click **"Environment Variables"** and add the following:

#### Required Variables:

1. **MONGODB_URI**
   - Value: Your MongoDB connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/cms?retryWrites=true&w=majority`
   - Environment: Select **Production**, **Preview**, and **Development**

2. **JWT_SECRET**
   - Value: A random secure string (at least 32 characters)
   - Generate with: `openssl rand -base64 32` or use [randomkeygen.com](https://randomkeygen.com)
   - Environment: Select **Production**, **Preview**, and **Development**

3. **JWT_EXPIRE**
   - Value: `1h` (or your preferred expiry time)
   - Environment: Select **Production**, **Preview**, and **Development**

4. **JWT_REFRESH_SECRET**
   - Value: A different random secure string (at least 32 characters)
   - Environment: Select **Production**, **Preview**, and **Development**

5. **JWT_REFRESH_EXPIRE**
   - Value: `7d` (or your preferred expiry time)
   - Environment: Select **Production**, **Preview**, and **Development**

#### Optional Variables (for image uploads):

6. **CLOUDINARY_CLOUD_NAME**
   - Value: Your Cloudinary cloud name
   - Environment: Select **Production**, **Preview**, and **Development**

7. **CLOUDINARY_API_KEY**
   - Value: Your Cloudinary API key
   - Environment: Select **Production**, **Preview**, and **Development**

8. **CLOUDINARY_API_SECRET**
   - Value: Your Cloudinary API secret
   - Environment: Select **Production**, **Preview**, and **Development**

**Note**: Make sure to select all three environments (Production, Preview, Development) for each variable.

### Step 4: Deploy

1. After adding all environment variables, click **"Deploy"**
2. Wait for the build to complete (this may take 2-5 minutes)
3. Once deployment is successful, you'll see a success message with your deployment URL

### Step 5: Seed Your Database

After the first deployment, you need to seed your database with roles and create a SuperAdmin user.

#### Option A: Run Seed Scripts Locally (Recommended)

1. Update your local `backend/.env` file with your production MongoDB URI:
   ```env
   MONGODB_URI=your-production-mongodb-uri
   JWT_SECRET=your-jwt-secret
   JWT_EXPIRE=1h
   JWT_REFRESH_SECRET=your-refresh-secret
   JWT_REFRESH_EXPIRE=7d
   ```

2. Seed roles:
   ```bash
   cd backend
   npm run seed
   ```

3. Create SuperAdmin:
   ```bash
   npm run seed-admin
   ```

#### Option B: Use MongoDB Atlas Shell or Compass

Connect to your MongoDB database and manually create the roles and SuperAdmin user.

### Step 6: Test Your Deployment

1. Visit your deployment URL: `https://your-project-name.vercel.app`
2. Test the API: `https://your-project-name.vercel.app/api` (should show API info)
3. Test login with SuperAdmin credentials:
   - Email: `admin@cms.com`
   - Password: `admin123`
   - **⚠️ IMPORTANT: Change this password immediately after first login!**

## Project Structure on Vercel

- **Frontend**: Served as static files from `frontend/dist/browser`
- **Backend**: Runs as serverless functions via `api/index.js`
- **Routing**: 
  - `/api/*` → Backend API routes
  - `/*` → Frontend Angular application (SPA routing)

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Verify all environment variables are set correctly
- Ensure MongoDB connection string is valid
- Check that Node.js version is compatible (Vercel uses Node 18+ by default)

### API Returns 404

- Verify `api/index.js` exists and exports the Express app
- Check that routes are prefixed with `/api`
- Review function logs in Vercel dashboard

### CORS Errors

- Verify your deployment URL is included in allowed origins
- Check that `FRONTEND_URL` environment variable matches your deployment URL (optional)

### Database Connection Issues

- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0) or add Vercel IPs
- Verify connection string format is correct
- Check database user has read/write permissions

### Frontend Not Loading

- Verify build completed successfully
- Check that `outputDirectory` in `vercel.json` matches actual build output
- Clear browser cache and try again

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| MONGODB_URI | Yes | MongoDB connection string | `mongodb+srv://...` |
| JWT_SECRET | Yes | JWT signing secret | Random string (32+ chars) |
| JWT_EXPIRE | Yes | Access token expiry | `1h` |
| JWT_REFRESH_SECRET | Yes | Refresh token secret | Random string (32+ chars) |
| JWT_REFRESH_EXPIRE | Yes | Refresh token expiry | `7d` |
| CLOUDINARY_CLOUD_NAME | No | Cloudinary cloud name | `your-cloud` |
| CLOUDINARY_API_KEY | No | Cloudinary API key | `123456789` |
| CLOUDINARY_API_SECRET | No | Cloudinary API secret | `secret-key` |
| FRONTEND_URL | No | Frontend URL for CORS | `https://app.vercel.app` |

## Next Steps After Deployment

1. ✅ Test all API endpoints
2. ✅ Test frontend login and navigation
3. ✅ Change SuperAdmin password
4. ✅ Create test users with different roles
5. ✅ Test article creation and publishing
6. ✅ Set up custom domain (optional)

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review backend function logs
3. Verify all environment variables are set
4. Test API endpoints directly using curl or Postman

