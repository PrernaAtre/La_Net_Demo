import AuthToken from '@/lib/AuthToken';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware function to handle authentication
export function middleware(request: NextRequest) {
    const token = AuthToken.get();
    const isLoggedIn = token !== null;
    const { pathname } = request.nextUrl;

    const publicPaths = ['/auth/login', '/auth/signup'];

    // Check if the user is accessing a public path
    const isPublicPath = publicPaths.includes(pathname);

    if (isPublicPath) {
        // If accessing a public path
        if (isLoggedIn) {
            // Redirect logged-in users away from public paths
            return NextResponse.redirect(new URL("/")); // Redirect to home page or another appropriate URL
        }
    } else {
        // If accessing a protected path
        if (!isLoggedIn) {
            // Redirect users to login page if not logged in
            return NextResponse.redirect(new URL("/login")); // Redirect to login page
        }
    }

    // If no redirection needed, allow the request to proceed
    return NextResponse.next();
}

// Configuration for the middleware
export const config = {
    // Define the matcher for the paths where the middleware should be applied
    matcher: ['/page','/quickNote']
};
