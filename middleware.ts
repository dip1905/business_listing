import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Role-based access control
    if (pathname.startsWith("/admin")) {
      if (token?.role !== "ADMIN" && !pathname.includes("/login")) {
        return NextResponse.redirect(new URL("/admin/login", req.url));
      }
    }

    if (pathname.startsWith("/owner")) {
      if (token?.role !== "OWNER" && !pathname.includes("/login") && !pathname.includes("/register")) {
        return NextResponse.redirect(new URL("/owner/login", req.url));
      }
    }

    if (pathname.startsWith("/user")) {
      if (token?.role !== "USER" && !pathname.includes("/login") && !pathname.includes("/register")) {
        return NextResponse.redirect(new URL("/user/login", req.url));
      }
    }

    return NextResponse.next();
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
          return !!token;
        }
        
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/user/:path*", 
    "/owner/:path*", 
    "/admin/:path*"
  ],
};