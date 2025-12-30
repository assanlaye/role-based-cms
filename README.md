3# Role-Based CMS

A minimal role-based Content Management System (CMS) with an Angular frontend and an Express + MongoDB backend. Includes role-based permissions (SuperAdmin, Manager, Contributor, Viewer), article management, authentication (JWT), and Cloudinary image uploads.

**Prerequisites**
- Node.js (v18+ recommended)
- npm
- MongoDB instance (Atlas or local)
- Cloudinary account (optional, for image uploads)

**Environment variables**
Create a `.env` file in `backend/` with the following keys:

- `MONGODB_URI` - MongoDB connection string
- `PORT` - Backend port (optional, defaults to 3000)
- `JWT_SECRET` - JWT access token secret
- `JWT_EXPIRE` - Access token expiry (e.g. `1h`)
- `JWT_REFRESH_SECRET` - JWT refresh token secret
- `JWT_REFRESH_EXPIRE` - Refresh token expiry (e.g. `7d`)
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name (optional)
- `CLOUDINARY_API_KEY` - Cloudinary API key (optional)
- `CLOUDINARY_API_SECRET` - Cloudinary API secret (optional)

**Local setup — Backend**
1. cd backend
2. npm install
3. Create `.env` with the variables above
4. Seed default roles: `npm run seed`
5. Seed SuperAdmin user: `npm run seed-admin` (creates `admin@cms.com` / `admin123`)
6. Start server: `npm run dev` (requires `nodemon`) or `npm start`

**Local setup — Frontend**
1. cd frontend
2. npm install
3. Start dev server: `npm run start` (opens on `http://localhost:4200` by default)
4. Build for production: `npm run build` (outputs to `dist/`)

**Seeding / Test Accounts**
- SuperAdmin (created by `npm run seed-admin`):
  - Email: admin@cms.com
  - Password: admin123
  - Please change this password after first login.

Other roles are created by `npm run seed` (SuperAdmin, Manager, Contributor, Viewer). Create additional users via the app registration or the Users admin UI once logged in as SuperAdmin.

**API (overview)**
- Auth
  - POST `/api/auth/register` — register new user
  - POST `/api/auth/login` — login (returns access + refresh tokens)
  - POST `/api/auth/refresh` — refresh access token
  - POST `/api/auth/logout` — revoke refresh token

- Users
  - GET `/api/users` — list users (admin)
  - GET `/api/users/:id` — get user
  - PUT `/api/users/:id` — update user

- Roles & Permissions
  - GET `/api/roles` — list roles
  - POST `/api/roles` — create role (admin)
  - PUT `/api/roles/:id` — update role

- Articles
  - GET `/api/articles` — list articles
  - GET `/api/articles/:id` — get article
  - POST `/api/articles` — create article
  - PUT `/api/articles/:id` — update article
  - DELETE `/api/articles/:id` — delete article
  - PATCH `/api/articles/:id/publish` — toggle publish state

(Refer to `backend/src/routes/` for exact routes and request shapes.)

**Deployment (recommended — local or external host)**
This repository is split into `frontend/` (Angular) and `backend/` (Express). You can host each separately — for example, serve the frontend as a static site and run the backend on any Node host (Heroku, Render, DigitalOcean, etc.).

Quick production build & deploy notes:
- Frontend: build with `npm run build` in `frontend/` and deploy the output directory from `dist/` (or your configured Angular build output).
- Backend: deploy the `backend/` folder to any Node environment; ensure the environment variables described above are set and the process runs `npm start`.

Important:
- Ensure CORS and API base URLs are configured so the frontend can reach the backend.
- If you prefer a single-host monorepo deployment, adapt the host's configuration to serve the frontend static files and forward `/api` to the backend.

**Testing & Troubleshooting**
- After starting backend and frontend locally, register or log in with `admin@cms.com` / `admin123` to access admin features.
- Use the `seed` scripts if roles or SuperAdmin are missing.
- Check console logs for errors; backend logs appear in the terminal running the server.

**Where to look in the code**
- Backend
  - Routes: `backend/src/routes/`
  - Controllers: `backend/src/controllers/`
  - Models: `backend/src/models/`
  - Utilities & seeds: `backend/src/utils/`

- Frontend
  - Components: `frontend/src/app/components/`
  - Services: `frontend/src/app/services/`
  - Global styles: `frontend/src/styles.css`

**Deployment on Vercel**

This project is configured for easy deployment on Vercel with the included `vercel.json` file.

1. **Prerequisites**:
   - Vercel account
   - MongoDB Atlas database
   - Cloudinary account (optional)

2. **Deploy to Vercel**:
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect the `vercel.json` configuration
   - Set the following environment variables in Vercel dashboard:
     - `MONGODB_URI` - Your MongoDB connection string
     - `JWT_SECRET` - Random string for JWT signing
     - `JWT_EXPIRE` - e.g., "1h"
     - `JWT_REFRESH_SECRET` - Random string for refresh tokens
     - `JWT_REFRESH_EXPIRE` - e.g., "7d"
     - `CLOUDINARY_CLOUD_NAME` (optional)
     - `CLOUDINARY_API_KEY` (optional)
     - `CLOUDINARY_API_SECRET` (optional)
     - `FRONTEND_URL` - Your Vercel deployment URL (optional, auto-configured)

3. **Post-deployment setup**:
   - Access your deployed app
   - The backend API will be available at `https://your-app.vercel.app/api`
   - Seed the database: Visit `https://your-app.vercel.app/api/seed` or run locally
   - Create SuperAdmin: Visit `https://your-app.vercel.app/api/seed-admin` or run locally

**Vercel Configuration Details**:
- Frontend builds to `dist/frontend`
- Backend runs as serverless functions
- API routes are automatically routed to backend
- CORS is configured for Vercel domains

If you want, I can:
- Re-enable or implement the soft-delete / Trash flow for articles (backend + frontend).
- Run quick verification scripts or update the README with screenshots and exact build output path after you run `npm run build`.
