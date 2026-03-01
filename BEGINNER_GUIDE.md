# 🚀 Business Listing Platform - Complete Beginner's Guide

## 📖 Table of Contents
1. [What We Built](#what-we-built)
2. [Understanding the Tech Stack](#understanding-the-tech-stack)
3. [Project Structure Explained](#project-structure-explained)
4. [Authentication System Deep Dive](#authentication-system-deep-dive)
5. [Database Design](#database-design)
6. [How Everything Works Together](#how-everything-works-together)
7. [Setup Instructions](#setup-instructions)
8. [Testing the Application](#testing-the-application)
9. [Common Concepts Explained](#common-concepts-explained)
10. [Next Steps](#next-steps)

---

## 🎯 What We Built

We created a **Business Listing Platform** where:
- **Users** can browse and review businesses
- **Business Owners** can list and manage their businesses
- **Admins** can manage the entire platform

Think of it like a combination of Yelp (for users) and a business management dashboard (for owners), with admin controls.

### 🔑 Key Features Completed:
✅ **User Registration & Login** (with Google OAuth option)  
✅ **Business Owner Registration & Login**  
✅ **Admin Login** (no registration - manually created)  
✅ **Role-based Access Control** (different dashboards for each role)  
✅ **Secure Password Storage** (encrypted passwords)  
✅ **Session Management** (stay logged in)  
✅ **Protected Routes** (can't access pages without proper role)  

---

## 🛠️ Understanding the Tech Stack

### Frontend (What Users See):
- **Next.js 14**: A React framework that makes building web apps easier
- **React**: JavaScript library for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework for styling
- **TypeScript**: JavaScript with type safety (catches errors early)

### Backend (Server & Database):
- **NextAuth.js**: Handles user authentication (login/logout/sessions)
- **Prisma**: Database toolkit that makes database operations easier
- **PostgreSQL**: Robust database for storing user data
- **bcryptjs**: Library for encrypting passwords securely

### Why These Technologies?
- **Next.js**: Full-stack framework (frontend + backend in one)
- **NextAuth.js**: Industry-standard authentication solution
- **Prisma**: Type-safe database operations with great developer experience
- **PostgreSQL**: Reliable, scalable database used by major companies

---

## 📁 Project Structure Explained

```
business-listing/
├── 📁 app/                          # Main application code (Next.js App Router)
│   ├── 📁 api/                      # Backend API endpoints
│   │   ├── 📁 auth/[...nextauth]/   # NextAuth configuration
│   │   ├── 📁 user/register/        # User registration API
│   │   └── 📁 owner/register/       # Owner registration API
│   │
│   ├── 📁 user/                     # User-specific pages
│   │   ├── 📁 login/               # User login page
│   │   ├── 📁 register/            # User registration page
│   │   └── 📁 dashboard/           # User dashboard
│   │
│   ├── 📁 owner/                    # Business owner pages
│   │   ├── 📁 login/               # Owner login page
│   │   ├── 📁 register/            # Owner registration page
│   │   └── 📁 dashboard/           # Owner dashboard
│   │
│   ├── 📁 admin/                    # Admin pages
│   │   ├── 📁 login/               # Admin login page
│   │   └── 📁 dashboard/           # Admin dashboard
│   │
│   ├── 📄 page.tsx                  # Home page (landing page)
│   ├── 📄 layout.tsx                # Root layout (wraps all pages)
│   └── 📄 globals.css               # Global styles
│
├── 📁 components/                   # Reusable UI components
│   └── 📄 LogoutButton.tsx          # Logout functionality
│
├── 📁 lib/                          # Utility libraries
│   ├── 📄 auth-provider.tsx         # NextAuth session provider
│   ├── 📄 prisma.ts                 # Database connection
│   └── 📄 hash.ts                   # Password hashing utilities
│
├── 📁 prisma/                       # Database related files
│   ├── 📄 schema.prisma             # Database structure definition
│   ├── 📄 seed.ts                   # Test data creation script
│   └── 📁 migrations/               # Database version history
│
├── 📁 types/                        # TypeScript type definitions
│   └── 📄 next-auth.d.ts            # NextAuth type extensions
│
├── 📄 middleware.ts                 # Route protection logic
├── 📄 .env                          # Environment variables (secrets)
├── 📄 package.json                  # Project dependencies and scripts
└── 📄 README.md                     # Project documentation
```

### 🔍 Key Files Explained:

**`app/layout.tsx`**: Wraps every page with common elements (like navigation)
**`middleware.ts`**: Checks if users have permission to access certain pages
**`prisma/schema.prisma`**: Defines what our database tables look like
**`.env`**: Stores sensitive information like database passwords

---

## 🔐 Authentication System Deep Dive

### How Authentication Works:

1. **User Registration**:
   ```
   User fills form → Password gets encrypted → Saved to database → User can login
   ```

2. **User Login**:
   ```
   User enters credentials → System checks database → Creates session → User stays logged in
   ```

3. **Session Management**:
   ```
   User logs in → Gets JWT token → Token stored in browser → Used for future requests
   ```

### 👥 Three User Roles:

#### 🟦 USER Role:
- **Who**: Regular customers
- **Can do**: Browse businesses, write reviews, manage profile
- **Registration**: Open to everyone (email/password or Google)
- **Dashboard**: `/user/dashboard`

#### 🟩 OWNER Role:
- **Who**: Business owners
- **Can do**: Create/manage business listings, respond to reviews
- **Registration**: Open to everyone (email/password only)
- **Dashboard**: `/owner/dashboard`

#### 🟥 ADMIN Role:
- **Who**: Platform administrators
- **Can do**: Manage all users, moderate content, system settings
- **Registration**: Not available (manually created in database)
- **Dashboard**: `/admin/dashboard`

### 🛡️ Security Features:

1. **Password Encryption**: Passwords are hashed with bcryptjs (12 rounds)
2. **JWT Tokens**: Secure session management
3. **Role Validation**: Users can only access their designated areas
4. **CSRF Protection**: Built into NextAuth.js
5. **Input Validation**: Forms validate data before processing

### 💻 Code Examples:

#### 1. User Registration API (`app/api/user/register/route.ts`):
```typescript
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    // Get data from the registration form
    const { name, email, password } = await req.json();
    
    // Validate input - make sure all fields are provided
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" }, 
        { status: 400 }
      );
    }

    // Check password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" }, 
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ 
      where: { email } 
    });
    
    if (existing) {
      return NextResponse.json(
        { error: "User with this email already exists" }, 
        { status: 400 }
      );
    }

    // Hash the password (encrypt it for security)
    const hashedPassword = await hash(password, 12);

    // Create new user in database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER", // Automatically assign USER role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        // Don't return password for security
      },
    });

    return NextResponse.json(
      { message: "User created successfully", user }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("User registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
```

#### 2. NextAuth Configuration (`app/api/auth/[...nextauth]/route.ts`):
```typescript
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions = {
  providers: [
    // Email/Password login
    CredentialsProvider({
      name: "Credentials",
      credentials: { 
        email: { label: "Email", type: "email" }, 
        password: { label: "Password", type: "password" } 
      },
      async authorize(credentials) {
        // Check if credentials were provided
        if (!credentials?.email || !credentials?.password) return null;
        
        // Find user in database
        const user = await prisma.user.findUnique({ 
          where: { email: credentials.email } 
        });
        
        if (!user) return null; // User doesn't exist
        
        // Check if password matches
        const valid = await compare(credentials.password, user.password);
        if (!valid) return null; // Wrong password
        
        // Return user data (this goes into the JWT token)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
    
    // Google OAuth login (for users only)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  
  session: { 
    strategy: "jwt", // Use JWT tokens instead of database sessions
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  callbacks: {
    // This runs when creating the JWT token
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      
      // Handle Google OAuth users
      if (account?.provider === "google" && user) {
        // Check if user exists in our database
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! }
        });
        
        if (!existingUser) {
          // Create new user with USER role
          const newUser = await prisma.user.create({
            data: {
              name: user.name!,
              email: user.email!,
              password: "", // Empty password for OAuth users
              role: "USER",
            },
          });
          token.role = newUser.role;
          token.id = newUser.id;
        } else {
          token.role = existingUser.role;
          token.id = existingUser.id;
        }
      }
      
      return token;
    },
    
    // This runs when creating the session object
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

#### 3. Login Form Component (`app/user/login/page.tsx`):
```typescript
"use client";
import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UserLogin() {
  // State to store form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page refresh
    setLoading(true);
    setError("");

    try {
      // Attempt to sign in with NextAuth
      const res = await signIn("credentials", { 
        redirect: false, // Don't redirect automatically
        email, 
        password 
      });

      if (res?.error) {
        setError("Invalid credentials");
      } else {
        // Check if user has correct role
        const session = await getSession();
        if (session?.user?.role === "USER") {
          router.push("/user/dashboard"); // Redirect to user dashboard
        } else {
          setError("Access denied. This login is for users only.");
        }
      }
    } catch (error) {
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      // Sign in with Google OAuth
      await signIn("google", { callbackUrl: "/user/dashboard" });
    } catch (error) {
      setError("Google sign-in failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            User Login
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Show error message if there is one */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Update state when user types
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Update state when user types
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            disabled={loading} // Disable button while loading
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

          {/* Google Sign-in Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50"
          >
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
}
```

#### 4. Protected Dashboard (`app/user/dashboard/page.jsx`):
```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default async function UserDashboard() {
  // Get the current session on the server side
  const session = await getServerSession(authOptions);
  
  // If no session or wrong role, redirect to login
  if (!session || session.user.role !== "USER") {
    redirect("/user/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">
          <h1 className="text-xl font-semibold">Business Listing</h1>
          <div className="flex items-center space-x-4">
            <span>Welcome, {session.user.name}</span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-8">User Dashboard</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Browse Businesses</h3>
            <p className="text-gray-600 mb-4">Discover local businesses</p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded">
              Coming Soon
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">My Reviews</h3>
            <p className="text-gray-600 mb-4">Manage your reviews</p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded">
              Coming Soon
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Profile Settings</h3>
            <p className="text-gray-600 mb-4">Update your account</p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded">
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

#### 5. Middleware for Route Protection (`middleware.ts`):
```typescript
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token; // Get user info from JWT token
    const { pathname } = req.nextUrl;

    // Role-based access control
    if (pathname.startsWith("/admin")) {
      // Only ADMIN role can access admin pages
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }

    if (pathname.startsWith("/owner")) {
      // Only OWNER role can access owner pages (except login/register)
      if (token?.role !== "OWNER" && !pathname.includes("/login") && !pathname.includes("/register")) {
        return NextResponse.redirect(new URL("/owner/login", req.url));
      }
    }

    if (pathname.startsWith("/user")) {
      // Only USER role can access user pages (except login/register)
      if (token?.role !== "USER" && !pathname.includes("/login") && !pathname.includes("/register")) {
        return NextResponse.redirect(new URL("/user/login", req.url));
      }
    }

    return NextResponse.next(); // Allow access
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow access to login and register pages without authentication
        if (pathname.includes("/login") || pathname.includes("/register")) {
          return true;
        }
        
        // Require authentication for protected routes
        if (pathname.startsWith("/user") || pathname.startsWith("/owner") || pathname.startsWith("/admin")) {
          return !!token; // Return true if token exists
        }
        
        return true; // Allow access to public pages
      },
    },
  }
);

// Apply middleware to these routes
export const config = {
  matcher: [
    "/user/:path*", 
    "/owner/:path*", 
    "/admin/:path*"
  ],
};
```

#### 6. Database Schema (`prisma/schema.prisma`):
```prisma
// Database configuration
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// User table definition
model User {
  id        String   @id @default(cuid())  // Unique ID (automatically generated)
  name      String                         // User's full name
  email     String   @unique               // Email address (must be unique)
  password  String                         // Encrypted password
  role      Role     @default(USER)        // User role (defaults to USER)
  createdAt DateTime @default(now())       // When account was created
}

// Possible user roles
enum Role {
  USER   // Regular customers
  OWNER  // Business owners
  ADMIN  // Platform administrators
}
```

#### 7. Logout Button Component (`components/LogoutButton.tsx`):
```typescript
"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    // Sign out the user and don't redirect automatically
    await signOut({ redirect: false });
    
    // Manually redirect to home page
    router.push("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
    >
      Logout
    </button>
  );
}
```

### 🔍 Code Explanation:

**Registration API**: Takes user input, validates it, encrypts password, saves to database
**NextAuth Config**: Handles login logic, creates JWT tokens, manages sessions
**Login Form**: Collects credentials, sends to NextAuth, handles responses
**Protected Dashboard**: Checks authentication on server, shows role-specific content
**Middleware**: Acts as security guard, checks permissions before allowing page access
**Database Schema**: Defines how user data is stored in PostgreSQL
**Logout Button**: Clears session and redirects user

---

## 🗄️ Database Design

### User Table Structure:
```sql
User {
  id        String   @id @default(cuid())     # Unique identifier
  name      String                            # User's full name
  email     String   @unique                  # Email (must be unique)
  password  String                            # Encrypted password
  role      Role     @default(USER)           # USER, OWNER, or ADMIN
  createdAt DateTime @default(now())          # When account was created
}
```

### Role Enum:
```sql
enum Role {
  USER    # Regular customers
  OWNER   # Business owners
  ADMIN   # Platform administrators
}
```

### Why This Design?
- **Single User Table**: Simplifies authentication
- **Role-based**: Easy to add new roles later
- **Unique Email**: Prevents duplicate accounts
- **Timestamps**: Track when accounts were created

---

## ⚙️ How Everything Works Together

### 1. User Visits the Site:
```
Home Page (/) → Shows three role options → User clicks their role
```

### 2. Registration Flow:
```
Registration Page → User fills form → API validates data → 
Password encrypted → User saved to database → Redirect to login
```

### 3. Login Flow:
```
Login Page → User enters credentials → API checks database → 
Password verified → JWT token created → User redirected to dashboard
```

### 4. Protected Routes:
```
User tries to access dashboard → Middleware checks token → 
Validates role → Allows access OR redirects to login
```

### 5. Dashboard Access:
```
User authenticated → Role checked → Appropriate dashboard loaded → 
User sees role-specific features
```

---

## 🚀 Setup Instructions

### Prerequisites:
- **Node.js** (v18 or higher)
- **PostgreSQL** database
- **Git** (for version control)

### Step-by-Step Setup:

#### 1. Clone and Install:
```bash
# Navigate to your project directory
cd business-listing

# Install all dependencies
npm install
```

#### 2. Database Setup:
```bash
# Generate Prisma client (creates database connection code)
npm run db:generate

# Create database tables
npm run db:migrate

# Add test users to database
npm run db:seed
```

#### 3. Environment Configuration:
Update `.env` file with your database details:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/businesslisting"
NEXTAUTH_SECRET="your-very-long-random-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
```

#### 4. Start Development Server:
```bash
npm run dev
```

#### 5. Open in Browser:
Visit `http://localhost:3000`

---

## 🧪 Testing the Application

### Test Accounts (Created by Seed Script):

| Role | Email | Password | Access |
|------|-------|----------|---------|
| Admin | `admin@businesslisting.com` | `admin123` | Full platform control |
| Owner | `owner@example.com` | `owner123` | Business management |
| User | `user@example.com` | `user123` | Browse businesses |

### Testing Scenarios:

#### 1. Test User Registration:
- Go to `/user/register`
- Fill out the form with new email
- Check if account is created
- Try logging in with new credentials

#### 2. Test Role-Based Access:
- Login as User → Try accessing `/owner/dashboard` → Should be redirected
- Login as Owner → Try accessing `/admin/dashboard` → Should be redirected
- Login as Admin → Should access all areas

#### 3. Test Google OAuth (Users Only):
- Go to `/user/login`
- Click "Sign in with Google"
- Complete Google authentication
- Check if user is created with USER role

#### 4. Test Security:
- Try accessing dashboards without logging in
- Check if passwords are encrypted in database
- Test logout functionality

---

## 🤔 Common Concepts Explained

### What is JWT (JSON Web Token)?
Think of JWT like a digital ID card. When you login, the server gives you this "card" that proves who you are. Every time you visit a page, you show this card, and the server knows you're authenticated.

**JWT Example:**
```javascript
// What a JWT token looks like (simplified)
{
  "id": "user123",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER",
  "exp": 1640995200 // Expiration time
}

// How it's used in our code
const session = await getSession(); // Gets JWT data
console.log(session.user.role); // "USER"
console.log(session.user.name); // "John Doe"
```

### What is Middleware?
Middleware is like a security guard at a building entrance. Before you can enter any room (page), the guard (middleware) checks if you have permission to be there.

**Middleware Example:**
```typescript
// middleware.ts - Runs before every protected page request
export default withAuth(
  function middleware(req) {
    const userRole = req.nextauth.token?.role;
    const requestedPage = req.nextUrl.pathname;

    // Like a security guard checking your ID
    if (requestedPage.startsWith("/admin")) {
      if (userRole !== "ADMIN") {
        // "Sorry, you can't enter the admin area"
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }
    
    // "You're authorized, go ahead"
    return NextResponse.next();
  }
);
```

### What is Hashing?
Password hashing is like putting your password through a one-way scrambler. The original password can't be recovered, but we can check if a entered password matches the scrambled version.

**Hashing Example:**
```typescript
import { hash, compare } from "bcryptjs";

// When user registers
const password = "mypassword123";
const hashedPassword = await hash(password, 12);
console.log(hashedPassword); 
// Output: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uDfm"

// When user logs in
const loginPassword = "mypassword123";
const isValid = await compare(loginPassword, hashedPassword);
console.log(isValid); // true

// Even if someone sees the hashed password, they can't reverse it
// "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uDfm" ≠ "mypassword123"
```

### What is a Session?
A session is like staying logged in. Instead of asking for your password every time you click something, the system remembers you're authenticated for a certain period.

**Session Example:**
```typescript
// After login, NextAuth creates a session
const session = {
  user: {
    id: "user123",
    name: "John Doe",
    email: "john@example.com",
    role: "USER"
  },
  expires: "2024-01-01T00:00:00.000Z" // When session expires
};

// On every page, we can check the session
export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    // No session = not logged in
    redirect("/login");
  }
  
  // Session exists = user is logged in
  return <div>Welcome back, {session.user.name}!</div>;
}
```

### What is Role-Based Access Control (RBAC)?
RBAC is like having different types of keys for different doors. A USER key opens user areas, an OWNER key opens business areas, and an ADMIN key opens everything.

**RBAC Example:**
```typescript
// Database: Each user has a role
const users = [
  { id: 1, name: "John", role: "USER" },    // Can access /user/*
  { id: 2, name: "Jane", role: "OWNER" },   // Can access /owner/*
  { id: 3, name: "Admin", role: "ADMIN" }   // Can access /admin/*
];

// Middleware checks the role
function checkAccess(userRole, requestedPath) {
  if (requestedPath.startsWith("/admin")) {
    return userRole === "ADMIN"; // Only admins allowed
  }
  
  if (requestedPath.startsWith("/owner")) {
    return userRole === "OWNER"; // Only owners allowed
  }
  
  if (requestedPath.startsWith("/user")) {
    return userRole === "USER"; // Only users allowed
  }
  
  return true; // Public pages
}

// Usage
const canAccess = checkAccess("USER", "/admin/dashboard"); // false
const canAccess2 = checkAccess("ADMIN", "/admin/dashboard"); // true
```

### What is an API Endpoint?
An API endpoint is like a specific address where your frontend can send requests. For example, `/api/user/register` is the address for creating new user accounts.

**API Endpoint Example:**
```typescript
// Frontend sends data to this endpoint
const registerUser = async (userData) => {
  const response = await fetch("/api/user/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });
  
  return response.json();
};

// Backend handles the request at this endpoint
// File: app/api/user/register/route.ts
export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  
  // Process the registration
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role: "USER" }
  });
  
  return NextResponse.json({ success: true, user });
}
```

### What is Prisma?
Prisma is like a translator between your JavaScript code and your database. Instead of writing SQL, you write JavaScript that Prisma converts to database queries.

**Prisma Example:**
```typescript
// Instead of writing SQL like this:
// SELECT * FROM users WHERE email = 'john@example.com';

// You write JavaScript like this:
const user = await prisma.user.findUnique({
  where: { email: 'john@example.com' }
});

// Instead of SQL like this:
// INSERT INTO users (name, email, password, role) VALUES ('John', 'john@example.com', 'hashed', 'USER');

// You write JavaScript like this:
const newUser = await prisma.user.create({
  data: {
    name: 'John',
    email: 'john@example.com',
    password: 'hashed',
    role: 'USER'
  }
});
```

### What is Environment Variables?
Environment variables are like secret settings that your app needs but shouldn't be visible in your code. They're stored in the `.env` file.

**Environment Variables Example:**
```bash
# .env file (never commit this to git!)
DATABASE_URL="postgresql://username:password@localhost:5432/mydb"
NEXTAUTH_SECRET="super-secret-key-12345"
GOOGLE_CLIENT_ID="your-google-oauth-id"
```

```typescript
// How to use them in code
const databaseUrl = process.env.DATABASE_URL;
const secret = process.env.NEXTAUTH_SECRET;

// Why use them?
// ❌ Bad: Hardcoded secrets visible to everyone
const secret = "super-secret-key-12345";

// ✅ Good: Secrets hidden in environment variables
const secret = process.env.NEXTAUTH_SECRET;
```

---

## 🔄 What Happens When You...

### Register a New Account:
1. Fill out registration form
2. Frontend sends data to `/api/user/register` or `/api/owner/register`
3. API validates the data (email format, password length, etc.)
4. Password gets encrypted with bcryptjs
5. User data saved to PostgreSQL database
6. Success message shown, redirect to login

**Code Flow Example:**
```typescript
// 1. User submits form
const handleSubmit = async (e) => {
  const res = await fetch("/api/user/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
    headers: { "Content-Type": "application/json" },
  });
  
  // 2. API processes request
  if (res.ok) {
    router.push("/user/login"); // 3. Redirect to login
  }
};

// Inside API route (/api/user/register/route.ts)
export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  
  // 4. Encrypt password
  const hashedPassword = await hash(password, 12);
  
  // 5. Save to database
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role: "USER" }
  });
  
  return NextResponse.json({ message: "User created successfully" });
}
```

### Login:
1. Enter email and password
2. Frontend sends credentials to NextAuth
3. NextAuth checks database for matching email
4. Compares entered password with encrypted version
5. If match, creates JWT token with user info and role
6. Token stored in browser cookies
7. User redirected to appropriate dashboard

**Code Flow Example:**
```typescript
// 1. User submits login form
const handleSubmit = async (e) => {
  // 2. NextAuth handles authentication
  const res = await signIn("credentials", { 
    redirect: false, 
    email, 
    password 
  });
  
  if (res?.error) {
    setError("Invalid credentials");
  } else {
    // 3. Check user role and redirect
    const session = await getSession();
    if (session?.user?.role === "USER") {
      router.push("/user/dashboard");
    }
  }
};

// Inside NextAuth config
CredentialsProvider({
  async authorize(credentials) {
    // 4. Find user in database
    const user = await prisma.user.findUnique({ 
      where: { email: credentials.email } 
    });
    
    // 5. Compare passwords
    const valid = await compare(credentials.password, user.password);
    if (!valid) return null;
    
    // 6. Return user data (goes into JWT token)
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  },
})
```

### Access a Protected Page:
1. Browser requests dashboard page
2. Middleware intercepts the request
3. Checks for valid JWT token in cookies
4. Validates user role matches page requirements
5. If authorized, page loads
6. If not authorized, redirects to login

**Code Flow Example:**
```typescript
// middleware.ts - Runs before every protected page
export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token; // 1. Get JWT token
    const { pathname } = req.nextUrl;

    // 2. Check role permissions
    if (pathname.startsWith("/admin")) {
      if (token?.role !== "ADMIN") {
        // 3. Redirect if unauthorized
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }
    
    // 4. Allow access if authorized
    return NextResponse.next();
  }
);

// Dashboard page - Server-side authentication check
export default async function UserDashboard() {
  // 5. Double-check authentication on server
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== "USER") {
    redirect("/user/login"); // 6. Redirect if not authenticated
  }

  // 7. Render dashboard content
  return <div>Welcome, {session.user.name}!</div>;
}
```

### Logout:
1. Click logout button
2. NextAuth clears the JWT token
3. Session ended
4. Redirected to home page
5. Can no longer access protected pages

**Code Flow Example:**
```typescript
// LogoutButton component
const handleLogout = async () => {
  // 1. Clear NextAuth session
  await signOut({ redirect: false });
  
  // 2. Redirect to home page
  router.push("/");
  
  // 3. JWT token is now cleared from cookies
  // 4. User can no longer access protected pages
};
```

### Google OAuth Login (Users Only):
1. Click "Sign in with Google" button
2. Redirected to Google's authentication page
3. User grants permission to our app
4. Google sends user data back to our app
5. NextAuth checks if user exists in our database
6. If new user, creates account with USER role
7. If existing user, logs them in
8. User redirected to dashboard

**Code Flow Example:**
```typescript
// 1. User clicks Google sign-in button
const handleGoogleSignIn = async () => {
  await signIn("google", { callbackUrl: "/user/dashboard" });
};

// 2. NextAuth Google provider configuration
GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
}),

// 3. Handle Google user in JWT callback
async jwt({ token, user, account }) {
  if (account?.provider === "google" && user) {
    // 4. Check if user exists in our database
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email! }
    });
    
    if (!existingUser) {
      // 5. Create new user with USER role
      const newUser = await prisma.user.create({
        data: {
          name: user.name!,
          email: user.email!,
          password: "", // Empty for OAuth users
          role: "USER",
        },
      });
      token.role = newUser.role;
    }
  }
  return token;
}
```

---

## 🎯 Next Steps (Phase 2 Planning)

### Business Listing Features:
- Create/edit/delete business listings
- Upload business photos
- Business categories and tags
- Business hours and contact info

### Review System:
- Users can write reviews
- Star rating system
- Business owners can respond
- Review moderation by admins

### Search & Discovery:
- Search businesses by name/category
- Filter by location, rating, etc.
- Map integration
- Featured businesses

### Enhanced User Experience:
- Email verification
- Password reset functionality
- User profiles with avatars
- Notification system

---

## 🆘 Troubleshooting Common Issues

### Database Connection Issues:
```bash
# Check if PostgreSQL is running
# Verify DATABASE_URL in .env file
# Run: npm run db:generate
```

### Authentication Not Working:
```bash
# Check NEXTAUTH_SECRET is set
# Verify NEXTAUTH_URL matches your domain
# Clear browser cookies and try again
```

### Pages Not Loading:
```bash
# Check if development server is running: npm run dev
# Verify no TypeScript errors in terminal
# Check browser console for JavaScript errors
```

### Role Access Issues:
```bash
# Verify user role in database
# Check middleware.ts configuration
# Clear session and login again
```

---

## 📚 Learning Resources

### Next.js:
- [Official Next.js Tutorial](https://nextjs.org/learn)
- [Next.js Documentation](https://nextjs.org/docs)

### NextAuth.js:
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Authentication Patterns](https://next-auth.js.org/getting-started/example)

### Prisma:
- [Prisma Getting Started](https://www.prisma.io/docs/getting-started)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

### React & TypeScript:
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🎉 Congratulations!

You now have a fully functional authentication system with:
- ✅ Multi-role user management
- ✅ Secure password handling
- ✅ Session management
- ✅ Protected routes
- ✅ Professional UI
- ✅ Database integration
- ✅ OAuth integration

This foundation is ready for building the complete business listing platform in the next phases!

---

*This guide was created to help beginners understand every aspect of the authentication system we built. Feel free to refer back to it as you continue developing the platform!*