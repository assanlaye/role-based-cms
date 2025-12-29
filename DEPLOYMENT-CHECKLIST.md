# Vercel Deployment Checklist

Use this checklist to ensure a smooth deployment to Vercel.

## Pre-Deployment

### Frontend
- [x] Environment configuration files created (`environment.ts`, `environment.prod.ts`)
- [x] All services updated to use environment variables
- [x] Build script configured for production
- [x] Vercel configuration file created
- [x] `.vercelignore` file created

### Backend
- [x] Serverless function wrapper created (`api/index.js`)
- [x] Server.js updated to work as both standalone and serverless
- [x] Vercel configuration file created
- [x] `.vercelignore` file created

## Environment Variables Setup

### Frontend (if deploying separately)
- [ ] `NG_APP_API_URL` - Your backend API URL (e.g., `https://your-backend.vercel.app/api`)

### Backend
- [ ] `MONGODB_URI` - MongoDB connection string
- [ ] `JWT_SECRET` - Secret for JWT tokens
- [ ] `JWT_REFRESH_SECRET` - Secret for refresh tokens
- [ ] `JWT_EXPIRE` - JWT expiration time (default: `1h`)
- [ ] `JWT_REFRESH_EXPIRE` - Refresh token expiration (default: `7d`)
- [ ] `FRONTEND_URL` - Your frontend URL (e.g., `https://your-frontend.vercel.app`)
- [ ] `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- [ ] `CLOUDINARY_API_KEY` - Cloudinary API key
- [ ] `CLOUDINARY_API_SECRET` - Cloudinary API secret
- [ ] `NODE_ENV` - Set to `production`

## Deployment Steps

### Option 1: Separate Deployments (Recommended)

1. **Deploy Backend First:**
   - Go to Vercel Dashboard
   - Create new project
   - Set root directory to `backend`
   - Add all backend environment variables
   - Deploy

2. **Deploy Frontend:**
   - Create new project in Vercel
   - Set root directory to `frontend`
   - Add `NG_APP_API_URL` with your backend URL
   - Deploy

3. **Update Backend CORS:**
   - Update `FRONTEND_URL` in backend environment variables to match frontend URL
   - Redeploy backend if needed

### Option 2: Monorepo Deployment

1. **Deploy from Root:**
   - Go to Vercel Dashboard
   - Create new project
   - Deploy from root directory (no root directory setting needed)
   - Add all environment variables (both frontend and backend)
   - Deploy

## Post-Deployment Testing

- [ ] Frontend loads correctly
- [ ] API endpoints are accessible
- [ ] Authentication works (login/register)
- [ ] File uploads work (profile photos, article images)
- [ ] CORS is configured correctly
- [ ] All routes work (SPA routing)
- [ ] Environment-specific features work

## Troubleshooting

### Build Failures
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility
- Check build logs in Vercel dashboard

### API Not Found (404)
- Verify API routes in `backend/vercel.json`
- Check that `api/index.js` exists
- Verify serverless function is deployed

### CORS Errors
- Ensure `FRONTEND_URL` in backend matches your frontend URL exactly
- Check that credentials are enabled in CORS config
- Verify both frontend and backend are deployed

### Environment Variables Not Working
- Check variable names match exactly (case-sensitive)
- For frontend: Use `NG_APP_` prefix for Angular
- Redeploy after adding/changing environment variables

### Database Connection Issues
- Verify MongoDB URI is correct
- Check MongoDB Atlas IP whitelist (allow all IPs: `0.0.0.0/0`)
- Ensure database user has correct permissions

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Angular Deployment Guide](https://angular.io/guide/deployment)
- [Express on Vercel](https://vercel.com/docs/concepts/functions/serverless-functions)

