# Authentication Debugging Guide

## Changes Made

I've improved error handling and logging in the authentication controllers to help diagnose issues:

1. **Added validation** for email and password fields
2. **Added console logging** for failed login attempts
3. **Improved error messages** to be more descriptive
4. **Made Cloudinary optional** for registration (won't break if not configured)
5. **Fixed email case handling** (email is now lowercased and trimmed)

## How to Debug

### 1. Check Browser Console & Network Tab

When you try to login/register, check:
- **Network tab**: What HTTP status code do you get? (200, 400, 401, 500?)
- **Response body**: What error message is returned?
- **Request payload**: Is the email/password being sent correctly?

### 2. Check Server Logs

**For Local Development:**
```bash
cd backend
npm run dev
```

Watch the console for error messages when you try to login/register.

**For Vercel:**
- Go to Vercel Dashboard → Your Project → Functions
- Check the function logs for errors

### 3. Common Issues & Solutions

#### Issue: "Invalid email or password"
**Possible causes:**
- Email doesn't exist in database
- Password is incorrect
- Email has extra spaces or wrong case

**Solution:**
- Check database to verify user exists
- Try with exact email (lowercase, no spaces)
- Verify password is correct

#### Issue: "Account is inactive"
**Solution:**
- Check `isActive` field in database: `db.users.findOne({email: "your@email.com"})`
- Set to `true` if needed

#### Issue: Registration fails silently
**Possible causes:**
- Cloudinary not configured (now fixed - won't break)
- Missing required fields
- Database connection issue

**Solution:**
- Check server logs for error messages
- Verify all required fields are sent (fullName, email, password)
- Check MongoDB connection

#### Issue: "Default role not found"
**Solution:**
- Run seed script: `cd backend && npm run seed`
- This creates the Viewer role needed for registration

### 4. Test with curl

**Test Login:**
```bash
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cms.com","password":"admin123"}'
```

**Test Registration:**
```bash
curl -X POST https://your-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","password":"password123"}'
```

### 5. Check Database Directly

If you have MongoDB Compass or CLI access:

**Check if user exists:**
```javascript
db.users.findOne({email: "admin@cms.com"})
```

**Check if password is hashed:**
- Password should start with `$2a$` or `$2b$` (bcrypt hash)
- If password is plain text, it wasn't hashed (old accounts)

**Check user role:**
```javascript
db.users.findOne({email: "admin@cms.com"}).role
// Should return ObjectId, not null
```

**Check if roles exist:**
```javascript
db.roles.find({})
// Should return SuperAdmin, Manager, Contributor, Viewer
```

### 6. Reset User Password (if needed)

If you need to reset a password in the database, you can create a script or manually hash a new password:

**Using Node.js script:**
```javascript
const bcrypt = require('bcryptjs');
const newPassword = 'yourNewPassword';
const hashedPassword = await bcrypt.hash(newPassword, 10);
console.log(hashedPassword);
// Then update in database: db.users.updateOne({email: "user@example.com"}, {$set: {password: hashedPassword}})
```

## Next Steps

1. **Test locally first** - Check if login works on `http://localhost:3000` (or your local backend port)
2. **Check server logs** - Look for the new console.log messages I added
3. **Verify database** - Make sure users exist and passwords are hashed
4. **Check environment variables** - Ensure MongoDB URI and JWT secrets are set correctly

## What the Error Logs Will Show

With the new logging, you'll see messages like:
- `Login attempt failed: User not found for email: ...`
- `Login attempt failed: Account inactive for email: ...`
- `Login attempt failed: Invalid password for email: ...`
- `Login successful for user: ...`
- `New user registered: ...`

These will help pinpoint exactly where the authentication is failing.

