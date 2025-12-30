# Vercel NOT_FOUND Error - Fix and Explanation

## 1. The Fix

### What Was Changed

1. **Removed deprecated `builds` array** from `vercel.json`
   - The `builds` array was deprecated in Vercel and causes NOT_FOUND errors
   - Modern Vercel uses automatic build detection or project settings

2. **Created `/api/index.js` serverless function wrapper**
   - Vercel requires serverless functions to be in an `api/` directory at the root
   - This file wraps your Express app to run as a serverless function

3. **Updated `vercel.json` to use modern `rewrites` instead of `routes`**
   - `rewrites` is the modern, recommended approach
   - Simplifies routing configuration

4. **Configured proper output directory reference**
   - Angular builds to `frontend/dist/browser` (verified in your `verify-build.js`)
   - Vercel needs to serve files from this location

### Required Vercel Project Settings

Since `vercel.json` cannot specify build commands for monorepos, you **must** configure these in your Vercel project settings:

1. **Root Directory**: `.` (root)
2. **Build Command**: `cd frontend && yarn install && yarn build`
3. **Output Directory**: `frontend/dist/browser`
4. **Install Command**: (leave empty or use `yarn install` if needed)

**To set these:**
- Go to your project in Vercel Dashboard
- Settings → General
- Configure the fields above
- Save and redeploy

---

## 2. Root Cause Analysis

### What Was the Code Actually Doing vs. What It Needed to Do?

**What it was doing:**
- Using deprecated `builds` array to explicitly define build steps
- Trying to configure both backend and frontend builds in the config
- Using old `routes` syntax (though still functional, less optimal)

**What it needed to do:**
- Let Vercel handle builds automatically OR configure in project settings
- Place Express app in `api/` directory as a serverless function
- Use modern `rewrites` for routing

### What Conditions Triggered This Error?

The NOT_FOUND error occurred because:
1. **Deprecated `builds` array**: Vercel no longer processes the `builds` array, so your builds weren't actually running
2. **Missing serverless function structure**: Without `api/index.js`, Vercel couldn't find your Express backend
3. **Incorrect routing**: The old routing configuration didn't properly map requests to your functions

### What Misconception Led to This?

**Common misconception**: Thinking that `vercel.json` is like a build configuration file where you explicitly define all build steps.

**Reality**: Modern Vercel:
- Uses automatic detection for most frameworks
- Requires serverless functions in specific directories (`api/` for backend APIs)
- Prefers project settings for monorepo build configurations
- Uses `vercel.json` primarily for routing, headers, and function runtime settings

---

## 3. Teaching the Concept

### Why Does This Error Exist?

The NOT_FOUND error exists because Vercel is a **serverless platform** with specific conventions:

1. **File-based routing**: Functions are discovered by their location
   - `api/index.js` → handles `/api/*` requests
   - `api/auth.js` → handles `/api/auth` requests
   - Files in root `dist/` → served as static files

2. **Automatic build detection**: Vercel detects frameworks and runs appropriate builds
   - If it can't detect or the config is wrong → builds fail silently or NOT_FOUND errors

3. **Separation of concerns**:
   - **Build configuration** → Project settings or automatic detection
   - **Routing configuration** → `vercel.json` (rewrites, redirects)
   - **Function runtime** → `vercel.json` functions config

### Correct Mental Model

Think of Vercel deployment as having **three layers**:

```
┌─────────────────────────────────────┐
│  Project Settings (Dashboard)       │  ← Build commands, output dir
│  - Root Directory                   │
│  - Build Command                    │
│  - Output Directory                 │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  vercel.json                        │  ← Routing, rewrites, function config
│  - rewrites                         │
│  - functions                        │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  File Structure                     │  ← Actual code organization
│  - api/ (serverless functions)      │
│  - dist/ (static files)             │
└─────────────────────────────────────┘
```

### How This Fits into Framework/Language Design

**Vercel's philosophy**: Convention over configuration
- **Convention**: Put functions in `api/`, static files in root or specified output dir
- **Configuration**: Only specify what differs from convention

This is similar to:
- **Next.js**: File-based routing (`pages/` or `app/`)
- **Express**: Convention of `app.listen()` vs Vercel's `module.exports = app`
- **Angular**: Convention of `dist/` output directory

**Key insight**: Serverless platforms require exporting handlers, not starting servers:
- ❌ Traditional: `app.listen(3000)` 
- ✅ Serverless: `module.exports = app`

---

## 4. Warning Signs & Prevention

### What to Look For

1. **Deprecated configuration warnings**
   - If Vercel docs mention something is deprecated → update immediately
   - Check Vercel changelog for breaking changes

2. **Build logs showing no build output**
   - If builds complete but files aren't where expected
   - Check output directory matches actual build output

3. **Routes returning 404 despite existing code**
   - Function files not in `api/` directory
   - Routing configuration not matching file structure

4. **Monorepo-specific issues**
   - Build commands not working
   - Output directories incorrect
   - Dependencies not installing

### Code Smells & Patterns

**Red flags in `vercel.json`:**
```json
{
  "builds": [...]  // ❌ Deprecated!
  "routes": [...]  // ⚠️  Old syntax, prefer "rewrites"
}
```

**Red flags in project structure:**
```
project/
  backend/
    server.js  // ❌ Not in api/ directory
  frontend/
    dist/      // ⚠️  Check if this matches outputDirectory
```

**Correct patterns:**
```json
{
  "rewrites": [...],     // ✅ Modern
  "functions": {...}     // ✅ Correct function config
}
```

```
project/
  api/
    index.js   // ✅ Serverless function wrapper
  frontend/
    dist/browser/  // ✅ Matches Angular output
```

### Similar Mistakes to Avoid

1. **Using `builds` array** → Use project settings or automatic detection
2. **Wrong output directory** → Verify actual build output location
3. **Functions not in `api/`** → Vercel won't recognize them as serverless functions
4. **Express app using `app.listen()`** → Must export the app for serverless
5. **Hardcoded paths in `vercel.json`** → Use relative paths, configure in settings

---

## 5. Alternative Approaches & Trade-offs

### Approach 1: Current Fix (Recommended)
**What we did**: Created `api/index.js` wrapper, modern `vercel.json`, configure builds in dashboard

**Pros:**
- ✅ Uses modern Vercel conventions
- ✅ Clear separation of concerns
- ✅ Works with monorepos
- ✅ Easy to understand and maintain

**Cons:**
- ⚠️ Requires dashboard configuration (not fully in code)
- ⚠️ Need to remember to set build settings

**Best for**: Production deployments, team projects

---

### Approach 2: Separate Vercel Projects
**What it is**: Deploy frontend and backend as separate Vercel projects

**Pros:**
- ✅ Simpler configuration per project
- ✅ Independent scaling and deployments
- ✅ Clear separation

**Cons:**
- ❌ More complex deployment process
- ❌ CORS configuration needed
- ❌ Two separate domains/URLs to manage
- ❌ More expensive (two projects)

**Best for**: Microservices architecture, large teams

---

### Approach 3: Convert to Next.js API Routes
**What it is**: Migrate frontend to Next.js, use API routes for backend

**Pros:**
- ✅ Everything in one framework
- ✅ Excellent Vercel integration
- ✅ Server-side rendering capabilities
- ✅ Automatic routing

**Cons:**
- ❌ Requires rewriting Angular app
- ❌ Significant migration effort
- ❌ Learning curve if team doesn't know Next.js
- ❌ Different framework patterns

**Best for**: New projects, if considering framework change

---

### Approach 4: Use Vercel CLI with Scripts
**What it is**: Create build scripts in `package.json`, use Vercel CLI

**Pros:**
- ✅ Everything in code
- ✅ Version controlled
- ✅ Consistent builds

**Cons:**
- ⚠️ Still need to configure output directory
- ⚠️ CLI-based workflow (less UI-friendly)
- ⚠️ More setup complexity

**Best for**: CI/CD pipelines, automated deployments

---

### Approach 5: Keep Deprecated Config (Not Recommended)
**What it is**: Use old `builds` array format

**Pros:**
- ✅ (None - this is why it's deprecated!)

**Cons:**
- ❌ Breaks with newer Vercel versions
- ❌ Causes NOT_FOUND errors
- ❌ Not supported long-term
- ❌ No documentation or support

**Best for**: (Never use this approach)

---

## Summary

The fix involved:
1. ✅ Removing deprecated `builds` array
2. ✅ Creating `api/index.js` serverless function wrapper  
3. ✅ Updating to modern `rewrites` syntax
4. ⚠️ **IMPORTANT**: Configure build settings in Vercel dashboard

**Key takeaway**: Modern Vercel uses convention-based file structure (`api/` for functions) and prefers project settings for monorepo builds, while `vercel.json` focuses on routing and runtime configuration.

---

## Next Steps

1. **Configure Vercel project settings** (Build Command, Output Directory)
2. **Commit and push** the changes
3. **Redeploy** on Vercel
4. **Test** all API endpoints and frontend routes
5. **Verify** build logs show successful builds

If you still encounter issues after these changes, check:
- Build logs in Vercel dashboard
- Function logs for API errors
- Environment variables are set correctly
- MongoDB connection string is valid

