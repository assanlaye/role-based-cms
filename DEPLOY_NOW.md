# Quick Deployment Guide - Get Your URL in 5 Minutes

## Step 1: Set Up MongoDB Atlas (if you don't have one)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up/Login → Create a free cluster
3. Create a database user (remember username/password)
4. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cms?retryWrites=true&w=majority`

## Step 2: Generate JWT Secrets

You need two random strings. Use one of these methods:

**Option A: Online Generator**
- Go to [randomkeygen.com](https://randomkeygen.com/)
- Copy two "CodeIgniter Encryption Keys" (64 characters each)

**Option B: Command Line** (if you have Node.js)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
Run this twice to get two different secrets.

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub

2. **Import Your Project**
   - Click "Add New Project"
   - Select your GitHub repository: `assanlaye/role-based-cms`
   - Click "Import"

3. **Configure Project Settings**
   - **Framework Preset**: Other (or leave default)
   - **Root Directory**: `.` (leave as is)
   - **Build Command**: (leave empty - vercel.json handles it)
   - **Output Directory**: (leave empty - vercel.json handles it)
   - Click "Deploy" (you can add env vars later)

4. **Add Environment Variables**
   - After first deployment, go to Project Settings → Environment Variables
   - Add these variables (one by one):

   ```
   MONGODB_URI = mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/cms?retryWrites=true&w=majority
   JWT_SECRET = (your first random string - 64 chars)
   JWT_EXPIRE = 1h
   JWT_REFRESH_SECRET = (your second random string - 64 chars)
   JWT_REFRESH_EXPIRE = 7d
   ```

   **Optional (for image uploads):**
   ```
   CLOUDINARY_CLOUD_NAME = your-cloud-name
   CLOUDINARY_API_KEY = your-api-key
   CLOUDINARY_API_SECRET = your-api-secret
   ```

5. **Redeploy**
   - Go to "Deployments" tab
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
   - Follow prompts (accept defaults)
   - When asked about env vars, you can add them now or later

4. **Add Environment Variables**
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

## Step 4: Seed Your Database

After deployment, you need to seed the database with roles and create a SuperAdmin user.

### Option A: Run Seed Scripts Locally (Easiest)

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

### Option B: Create Seed Endpoint (Temporary)

Add this to `backend/server.js` temporarily (remove after seeding):

```javascript
// Temporary seed endpoint - REMOVE AFTER USE
if (process.env.NODE_ENV === 'production') {
  app.get('/api/seed-roles', async (req, res) => {
    try {
      require('./src/utils/seedRoles');
      res.json({ message: 'Roles seeded successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/seed-admin', async (req, res) => {
    try {
      require('./src/utils/seedSuperAdmin');
      res.json({ message: 'SuperAdmin created successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}
```

Then visit:
- `https://your-app.vercel.app/api/seed-roles`
- `https://your-app.vercel.app/api/seed-admin`

**⚠️ Remove these endpoints after seeding for security!**

## Step 5: Test Your Deployment

1. **Visit your app**: `https://your-project-name.vercel.app`
2. **Test API**: `https://your-project-name.vercel.app/api` (should show API info)
3. **Login**: Use `admin@cms.com` / `admin123` (change password immediately!)

## Your URLs

After deployment, you'll have:

- **Frontend + Backend**: `https://your-project-name.vercel.app`
- **API Base URL**: `https://your-project-name.vercel.app/api`
- **Example API Endpoint**: `https://your-project-name.vercel.app/api/auth/login`

## Troubleshooting

**Build Fails?**
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Make sure MongoDB connection string is correct

**404 Errors?**
- Wait for deployment to complete (can take 2-3 minutes)
- Clear browser cache
- Check that vercel.json is in the root

**API Not Working?**
- Verify MongoDB URI is correct
- Check environment variables are set for Production
- Review function logs in Vercel dashboard

**Database Connection Issues?**
- Make sure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Verify username/password in connection string
- Check database user has read/write permissions

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Add environment variables
3. ✅ Seed database
4. ✅ Test login
5. 🔒 Change SuperAdmin password
6. 🎉 Your CMS is live!

