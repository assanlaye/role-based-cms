# How to Seed Your Database for Production

After deploying to Vercel, you need to seed your MongoDB database with the initial roles and SuperAdmin user.

## Quick Steps

### 1. Update Local Environment Variables

Make sure your local `backend/.env` file has your **production** MongoDB connection string and other required variables:

```env
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=1h
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRE=7d
```

**Important:** Use the SAME values as your Vercel environment variables!

### 2. Install Dependencies (if not already installed)

```bash
cd backend
npm install
```

### 3. Seed Roles

```bash
npm run seed
```

This creates the default roles: SuperAdmin, Editor, Author, Viewer

### 4. Create SuperAdmin User

```bash
npm run seed-admin
```

This creates the SuperAdmin user with:
- **Email:** `admin@cms.com`
- **Password:** `admin123`

## Default Credentials

- **Email:** `admin@cms.com`
- **Password:** `admin123` ⚠️ (NOT "password123")

**⚠️ IMPORTANT:** Change this password immediately after first login!

## Troubleshooting

### "SuperAdmin role not found"
- Run `npm run seed` first to create roles
- Then run `npm run seed-admin`

### Connection errors
- Verify your `MONGODB_URI` in `backend/.env` matches your production MongoDB
- Make sure MongoDB Atlas allows connections from your IP address
- Check that the connection string format is correct: `mongodb+srv://username:password@cluster.mongodb.net/database`

### User already exists
- The script checks if the user exists and won't create duplicates
- If you want to reset the password, you'll need to do it through the database directly or delete the user first

## After Seeding

1. Go to your deployed Vercel URL
2. Try logging in with:
   - Email: `admin@cms.com`
   - Password: `admin123`
3. Change the password immediately for security

