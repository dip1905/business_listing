# Business Listing Platform - Phase 1: Authentication & Roles

A multi-role business listing platform built with Next.js 14, NextAuth.js, Prisma, and PostgreSQL.

## 🚀 Features Completed - Phase 1

### ✅ Authentication System
- **NextAuth.js** integration with JWT sessions
- **Role-based authentication** (USER, OWNER, ADMIN)
- **Credentials provider** (email/password)
- **Google OAuth** integration (for users)
- **Secure password hashing** with bcryptjs
- **Role validation** and protected routes

### ✅ User Roles & Access Control
- **User**: Browse businesses, write reviews
- **Business Owner**: Manage business listings
- **Admin**: Platform administration (manually seeded)

### ✅ Separate Authentication URLs
- `/user/login` & `/user/register` - User authentication
- `/owner/login` & `/owner/register` - Business owner authentication  
- `/admin/login` - Admin authentication (no registration)

### ✅ Role-Based Dashboards
- Protected dashboard pages for each role
- Role validation middleware
- Automatic redirects based on user role

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Authentication**: NextAuth.js v4
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## 📋 Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with test users
npm run db:seed
```

### 3. Environment Variables
Update `.env` with your database URL and authentication secrets:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/businesslisting"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 4. Run Development Server
```bash
npm run dev
```

## 🔐 Test Credentials

After running the seed script, you can use these test accounts:

- **Admin**: `admin@businesslisting.com` / `admin123`
- **Owner**: `owner@example.com` / `owner123`  
- **User**: `user@example.com` / `user123`

## 🌐 Authentication Flow

### User Registration & Login
- Users can register with email/password or Google OAuth
- Automatic role assignment (USER for new registrations)
- Role-based dashboard redirects

### Business Owner Registration & Login
- Business owners register with email/password
- Automatic role assignment (OWNER)
- Access to business management features

### Admin Login
- Admin accounts are manually seeded in database
- No public registration available
- Full platform administration access

## 🛡️ Security Features

- **Password hashing** with bcryptjs (12 rounds)
- **JWT session management** with NextAuth.js
- **Role-based middleware** protection
- **CSRF protection** built into NextAuth.js
- **Input validation** on registration forms

## 📁 Project Structure

```
app/
├── api/auth/[...nextauth]/     # NextAuth configuration
├── api/user/register/          # User registration API
├── api/owner/register/         # Owner registration API
├── user/                       # User authentication pages
├── owner/                      # Owner authentication pages
├── admin/                      # Admin authentication pages
├── auth/error/                 # Authentication error page
└── page.tsx                    # Landing page

components/
└── LogoutButton.tsx            # Logout functionality

lib/
├── auth-provider.tsx           # NextAuth session provider
├── prisma.ts                   # Prisma client
└── hash.ts                     # Password hashing utilities

prisma/
├── schema.prisma               # Database schema
└── seed.ts                     # Database seeding script

types/
└── next-auth.d.ts             # NextAuth TypeScript declarations
```

## 🔄 Next Steps (Phase 2)

- Business listing CRUD operations
- Review and rating system
- Search and filtering functionality
- File upload for business images
- Email verification system
- Password reset functionality

## 🚀 Deployment

The application is ready for deployment on platforms like Vercel, Netlify, or any Node.js hosting service. Make sure to:

1. Set up a production PostgreSQL database
2. Update environment variables for production
3. Run database migrations in production
4. Configure Google OAuth for production domain

---

**Phase 1 Complete** ✅ - Authentication system with role-based access control is fully implemented and ready for use!
