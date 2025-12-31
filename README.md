## Role-Based CMS

A full-stack Content Management System (CMS) with role-based access control, built with Angular frontend and Express + MongoDB backend. Features include user authentication (JWT), article management, role-based permissions, and Cloudinary image uploads.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [API Endpoints](#api-endpoints)
- [Pre-Created Test Users](#pre-created-test-users)
- [Role Permissions](#role-permissions)
- [Screenshots](#screenshots)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Features

- 🔐 **JWT Authentication** - Secure login with access and refresh tokens
- 👥 **Role-Based Access Control** - Four predefined roles with granular permissions
- 📝 **Article Management** - Create, edit, delete, and publish articles
- 🖼️ **Image Uploads** - Cloudinary integration for profile photos and article images
- 🎨 **Modern UI** - Built with Angular and Tailwind CSS
- 🔒 **Permission Middleware** - Route-level permission checking

## Prerequisites

Before you begin, ensure you have the following installed:

| Requirement | Version | Description |
|------------|---------|-------------|
| Node.js | v18+ | JavaScript runtime |
| npm | Latest | Package manager |
| MongoDB | - | Database (Atlas or local instance) |
| Cloudinary Account | - | Optional, for image uploads |

## Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/assanlaye/role-based-cms.git
cd role-based-cms
```

### Step 2: Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment variables file:**
   
   Create a `.env` file in the `backend/` directory with the following variables:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=3000
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=1h
   JWT_REFRESH_SECRET=your_refresh_token_secret
   JWT_REFRESH_EXPIRE=7d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

   > **Note:** Cloudinary variables are optional. If not provided, image uploads will fail but other features will work.

4. **Seed default roles:**
   ```bash
   npm run seed
   ```
   This creates four default roles: SuperAdmin, Manager, Contributor, and Viewer.

5. **Seed SuperAdmin user:**
   ```bash
   npm run seed-admin
   ```
   This creates the default admin user (see [Pre-Created Test Users](#pre-created-test-users)).

6. **Start the backend server:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```
   
   The backend will run on `http://localhost:3000` (or the PORT specified in `.env`).

### Step 3: Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API URL:**
   
   For local development, the frontend is configured to use `http://localhost:3000/api` by default.
   
   If your backend runs on a different port, update `frontend/src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:YOUR_PORT/api'
   };
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```
   
   The frontend will open at `http://localhost:4200`.

5. **Build for production:**
   ```bash
   npm run build
   ```
   
   The production build will be in `frontend/dist/` directory.

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required | Request Body |
|--------|----------|-------------|---------------|--------------|
| POST | `/api/auth/register` | Register new user | No | `{ fullName, email, password, profilePhoto? }` |
| POST | `/api/auth/login` | Login user | No | `{ email, password }` |
| POST | `/api/auth/refresh` | Refresh access token | No | `{ refreshToken }` |
| POST | `/api/auth/logout` | Logout user | No | `{ refreshToken }` |
| GET | `/api/auth/profile` | Get current user profile | Yes | - |

### User Management Endpoints

| Method | Endpoint | Description | Auth Required | Permission Required |
|--------|----------|-------------|----------------|---------------------|
| GET | `/api/users` | Get all users | Yes | `view` |
| GET | `/api/users/:id` | Get user by ID | Yes | - |
| PUT | `/api/users/:id/role` | Update user role | Yes | `edit` |
| DELETE | `/api/users/:id` | Delete user | Yes | `delete` |

### Role Management Endpoints

| Method | Endpoint | Description | Auth Required | Permission Required |
|--------|----------|-------------|----------------|---------------------|
| GET | `/api/roles` | Get all roles | Yes | - |
| GET | `/api/roles/access-matrix` | Get permission matrix | Yes | - |
| GET | `/api/roles/:id` | Get role by ID | Yes | - |
| POST | `/api/roles` | Create custom role | Yes | `create` |
| PUT | `/api/roles/:id` | Update role | Yes | `edit` |
| DELETE | `/api/roles/:id` | Delete custom role | Yes | `delete` |

### Article Management Endpoints

| Method | Endpoint | Description | Auth Required | Permission Required |
|--------|----------|-------------|----------------|---------------------|
| GET | `/api/articles` | Get all articles | Yes | - |
| GET | `/api/articles/:id` | Get article by ID | Yes | - |
| POST | `/api/articles` | Create article | Yes | `create` |
| PUT | `/api/articles/:id` | Update article | Yes | `edit` |
| DELETE | `/api/articles/:id` | Delete article | Yes | `delete` |
| PATCH | `/api/articles/:id/publish` | Toggle publish status | Yes | `publish` |

> **Note:** 
> - All authenticated endpoints require a Bearer token in the `Authorization` header: `Authorization: Bearer <accessToken>`
> - Viewers can only see published articles
> - File uploads (profile photos, article images) use `multipart/form-data`

## Pre-Created Test Users

After running the setup commands, the following test user is automatically created:

### SuperAdmin User

| Field | Value |
|-------|-------|
| **Email** | `admin@cms.com` |
| **Password** | `admin123` |
| **Role** | SuperAdmin |
| **Full Name** | Super Admin |

> ⚠️ **Security Warning:** Please change the default password immediately after first login!

### Creating Additional Test Users

To test other roles, you can:

1. **Register new users via the UI:**
   - New registrations automatically get the `Viewer` role
   - Log in as SuperAdmin to change user roles

2. **Use SuperAdmin to assign roles:**
   - Navigate to Users management page
   - Update any user's role to Manager, Contributor, or Viewer

3. **Create users programmatically:**
   - Use the registration endpoint or MongoDB directly
   - Assign roles using the `/api/users/:id/role` endpoint

## Role Permissions

The system includes four predefined roles with the following permissions:

| Permission | SuperAdmin | Manager | Contributor | Viewer |
|------------|:----------:|:-------:|:------------:|:-----:|
| **Create** | ✅ | ✅ | ✅ | ❌ |
| **Edit** | ✅ | ✅ | ✅ | ❌ |
| **Delete** | ✅ | ❌ | ❌ | ❌ |
| **Publish** | ✅ | ✅ | ❌ | ❌ |
| **View** | ✅ | ✅ | ✅ | ✅ |

### Role Descriptions

| Role | Description | Use Case |
|------|-------------|----------|
| **SuperAdmin** | Full system access | System administrators, developers |
| **Manager** | Can create, edit, and publish content | Content managers, editors |
| **Contributor** | Can create and edit but cannot publish | Content writers, authors |
| **Viewer** | Read-only access to published content | General users, readers |

> **Note:** Custom roles can be created by SuperAdmin users with specific permission combinations.

## Screenshots

### Authentication Pages

#### Login Page
![image alt](https://github.com/assanlaye/role-based-cms/blob/main/screenshots/Login%20Page.jpg?raw=true)
*User login interface with email and password fields*

#### Registration Page
![image alt](https://github.com/assanlaye/role-based-cms/blob/main/screenshots/signup%20page.jpg?raw=true)
*New user registration form with profile photo upload*

### Dashboard

#### Main Dashboard
![image alt](https://github.com/assanlaye/role-based-cms/blob/main/screenshots/Dashboard%20page.jpg?raw=true)
*Overview dashboard showing system statistics and recent activity*

### Article Management

#### Article List
 ![image alt](https://github.com/assanlaye/role-based-cms/blob/main/screenshots/article-listing1.jpg?raw=true)
 ![image alt](https://github.com/assanlaye/role-based-cms/blob/main/screenshots/Articles-listing%20main%202.jpg?raw=true)
 ![image alt](https://github.com/assanlaye/role-based-cms/blob/main/screenshots/Articlespage%20for%20viewers.jpg?raw=true)
*List view of all articles with filter and search functionality*


### User Management
![image alt](https://github.com/assanlaye/role-based-cms/blob/main/screenshots/Manage%20roles.jpg?raw=true)

#### Users Management Page
![image alt](https://github.com/assanlaye/role-based-cms/blob/main/screenshots/manager%20role%202.jpg?raw=true)
*User management interface for viewing and managing all system users*

#### Role Assignment and Management
![image alt](https://github.com/assanlaye/role-based-cms/blob/main/screenshots/manager%20user.jpg?raw=true)
*Interface for assigning roles to users*

#### Permission Matrix
![image alt](https://github.com/assanlaye/role-based-cms/blob/main/screenshots/Manage%20roles.jpg?raw=true)
![image alt](https://github.com/assanlaye/role-based-cms/blob/main/screenshots/manager%20role%202.jpg?raw=true)
*Visual representation of role permissions across all roles*

> **Note:** Screenshots will be added to the `screenshots/` directory. Update the paths above once images are available.

## Project Structure

```
role-based-cms/
├── backend/
│   ├── src/
│   │   ├── config/          # Database, JWT, Cloudinary configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth and permission middleware
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # API route definitions
│   │   └── utils/           # Seed scripts and utilities
│   ├── server.js            # Express app entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/  # Angular components
│   │   │   ├── guards/       # Route guards
│   │   │   ├── interceptors/ # HTTP interceptors
│   │   │   ├── models/       # TypeScript interfaces
│   │   │   └── services/     # API service classes
│   │   ├── environments/     # Environment configurations
│   │   └── styles.css       # Global styles
│   └── package.json
├── api.js                   # Vercel serverless entry point
├── vercel.json              # Vercel deployment config
└── README.md
```

## Deployment

### Backend Deployment (Render)

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables in Render dashboard
6. Deploy

### Frontend Deployment (Vercel)

1. Connect your GitHub repository to Vercel
2. Set root directory to `frontend`
3. Set build command: `npm run build`
4. Set output directory: `dist/browser`
5. Add environment variable `NG_APP_API_URL` with your Render backend URL (if needed)
6. Deploy

### Environment Variables for Production

**Backend (Render):**
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRE`
- `JWT_REFRESH_SECRET`
- `JWT_REFRESH_EXPIRE`
- `CLOUDINARY_CLOUD_NAME` (optional)
- `CLOUDINARY_API_KEY` (optional)
- `CLOUDINARY_API_SECRET` (optional)
- `NODE_ENV=production`

**Frontend (Vercel):**
- `NG_APP_API_URL` (optional, defaults to Render URL)

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **MongoDB connection fails** | Check `MONGODB_URI` and ensure MongoDB Atlas allows connections from your IP (or use `0.0.0.0/0` for all IPs) |
| **CORS errors** | Verify CORS configuration in `backend/server.js` allows your frontend origin |
| **JWT token expired** | Use the refresh token endpoint to get a new access token |
| **Image upload fails** | Verify Cloudinary credentials are set correctly in `.env` |
| **Roles not found** | Run `npm run seed` in the backend directory |
| **SuperAdmin login fails** | Run `npm run seed-admin` to create the admin user |

### Getting Help

- Check backend logs in the terminal/console
- Check browser console for frontend errors
- Verify all environment variables are set correctly
- Ensure MongoDB is running and accessible

## License

This project is private and for educational purposes.

---

**By Alassan Saine**
