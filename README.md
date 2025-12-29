# Role-Based CMS

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

**Deployment — Vercel (recommended approach)**
This repository contains a separate `frontend/` and `backend/` folder. You can deploy them as two Vercel projects (one static/site for the Angular build, one Node server for the API), or deploy backend elsewhere and point the frontend to it.

Recommended steps for Vercel:
- Frontend
  - Create a new project in Vercel pointing to the `frontend` folder.
  - Build command: `npm run build`
  - Output directory: the Angular build output (default `dist/` — confirm the actual folder after build)
  - Set any environment variables needed at runtime for the frontend (e.g. `API_BASE_URL` if used)

- Backend
  - Create a new project in Vercel pointing to the `backend` folder (or deploy to Heroku/VPS).
  - Set `Build & Development Settings` to run `npm install` and use `npm start` as the start command (or configure a Vercel Serverless Function if preferred).
  - Add the required environment variables listed above in the Vercel dashboard.

Notes:
- Ensure CORS and API base URLs are configured correctly so the frontend can call the backend.
- If deploying frontend and backend as separate Vercel projects, set the frontend `API_BASE_URL` env var to the backend's URL.

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

If you want, I can:
- Add example `vercel.json` configuration snippets for both frontend and backend.
- Re-enable or implement the soft-delete / Trash flow for articles (backend + frontend).
- Run quick verification scripts or update the README with screenshots and exact build output path after you run `npm run build`.

