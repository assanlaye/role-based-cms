# CMS Backend - Role-Based Content Management System

A RESTful API backend for a dynamic role-based Content Management System built with Node.js, Express, and MongoDB.

## Features

- User Registration & Authentication (JWT with Access & Refresh Tokens)
- Dynamic Role-Based Authorization
- Permission-Based Access Control
- CRUD Operations for Articles
- Image Upload Support
- Publish/Unpublish Articles
- Access Matrix for Permissions

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/cms_database
   JWT_SECRET=your_super_secret_jwt_key
   JWT_REFRESH_SECRET=your_super_secret_refresh_token_key
   JWT_EXPIRE=1h
   JWT_REFRESH_EXPIRE=7d
   FRONTEND_URL=http://localhost:4200
   ```

4. **Seed the database**
   ```bash
   npm run seed
   ```
   This creates:
   - 4 default roles (SuperAdmin, Manager, Contributor, Viewer)
   - 4 test users (one for each role)

5. **Start the server**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/refresh` | Refresh access token | No |
| POST | `/api/auth/logout` | Logout user | No |
| GET | `/api/auth/profile` | Get current user profile | Yes |

### Users
| Method | Endpoint | Description | Permission Required |
|--------|----------|-------------|---------------------|
| GET | `/api/users` | Get all users | view |
| GET | `/api/users/:id` | Get user by ID | Authenticated |
| PUT | `/api/users/:id/role` | Update user role | edit |
| DELETE | `/api/users/:id` | Delete user | delete |

### Roles
| Method | Endpoint | Description | Permission Required |
|--------|----------|-------------|---------------------|
| GET | `/api/roles` | Get all roles | Authenticated |
| GET | `/api/roles/access-matrix` | Get access matrix | Authenticated |
| GET | `/api/roles/:id` | Get role by ID | Authenticated |
| POST | `/api/roles` | Create new role | create |
| PUT | `/api/roles/:id` | Update role | edit |
| DELETE | `/api/roles/:id` | Delete role | delete |

### Articles
| Method | Endpoint | Description | Permission Required |
|--------|----------|-------------|---------------------|
| GET | `/api/articles` | Get all articles | Authenticated |
| GET | `/api/articles/:id` | Get article by ID | Authenticated |
| POST | `/api/articles` | Create article | create |
| PUT | `/api/articles/:id` | Update article | edit |
| DELETE | `/api/articles/:id` | Delete article | delete |
| PATCH | `/api/articles/:id/publish` | Toggle publish status | publish |

## Test Users

After running `npm run seed`, these test users will be available:

| Email | Password | Role | Permissions |
|-------|----------|------|-------------|
| superadmin@test.com | password123 | SuperAdmin | All permissions |
| manager@test.com | password123 | Manager | create, edit, publish, view |
| contributor@test.com | password123 | Contributor | create, edit, view |
| viewer@test.com | password123 | Viewer | view only |

## Permission System

### Available Permissions
- **create** - Create new articles
- **edit** - Edit articles
- **delete** - Delete articles
- **publish** - Publish/unpublish articles
- **view** - View articles

### Default Roles

**SuperAdmin**
- All permissions
- Can create custom roles
- Can manage users

**Manager**
- Can create, edit, publish, and view articles
- Cannot delete articles

**Contributor**
- Can create and edit articles
- Cannot publish or delete

**Viewer**
- Can only view published articles

## Request Examples

### Test 1: Register a User
**POST** `http://localhost:5000/api/auth/register`
Content-Type: application/json

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Note:** All new registrations automatically receive the "Viewer" role for security. SuperAdmin can upgrade user roles later via the user management endpoint.

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "superadmin@test.com",
  "password": "password123"
}
```

### Create Article (with image)
```bash
POST /api/articles
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

{
  "title": "My First Article",
  "body": "Article content here...",
  "image": <file>
}
```

### Get All Articles
```bash
GET /api/articles
Authorization: Bearer <access_token>
```

### Publish Article
```bash
PATCH /api/articles/:id/publish
Authorization: Bearer <access_token>
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── cloudinary.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Role.js
│   │   ├── Article.js
│   │   └── RefreshToken.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── checkPermission.js
│   │   ├── upload.js
│   │   └── errorHandler.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── roleController.js
│   │   └── articleController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── roleRoutes.js
│   │   └── articleRoutes.js
│   ├── services/
│   │   └── tokenService.js
│   ├── utils/
│   │   ├── seedRoles.js
│   │   └── seedUsers.js
│   └── server.js
├── uploads/
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Security Features

### Role Assignment Security
- **All new user registrations automatically receive the "Viewer" role** to prevent privilege escalation
- Users cannot self-assign SuperAdmin or other privileged roles during registration
- Only SuperAdmin users can upgrade user roles through the `/api/users/:id/role` endpoint
- This ensures proper access control and prevents unauthorized privilege escalation

### Password Security

The API uses standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Testing with Postman

1. Import the API endpoints into Postman
2. Register/Login to get access token
3. Add token to Authorization header: `Bearer <token>`
4. Test all CRUD operations
5. Test with different user roles

## Notes

- Passwords are hashed using bcrypt before storing
- JWT tokens expire after 1 hour (configurable)
- Refresh tokens are valid for 7 days
- Tokens are verified on every protected route request

## Error Handling
- Uploaded images are stored in `/src/uploads` directory
- Viewers can only see published articles
- Only SuperAdmin can create custom roles
- Role assignment during registration is disabled for security

## Author

Alassan Saine