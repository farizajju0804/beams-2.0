import authConfig from "@/auth.config"; // Import authentication configuration
import NextAuth from "next-auth"; // Import NextAuth for handling authentication
import { publicRoutes, DEFAULT_LOGIN_REDIRECT, authRoutes, apiAuthPrefix } from "./routes"; // Import route configurations
import { currentRole, currentUser } from "./libs/auth"; // Import helper functions for user role and user data

const { auth } = NextAuth(authConfig); // Initialize NextAuth with the given configuration

// Middleware function to handle request authentication and redirection
export default auth(async (req) => {
  const { nextUrl } = req; // Get the requested URL

  const isLoggedIn = !!req.auth; // Check if the user is logged in
  const user = await currentUser(); // Fetch the current user data
  console.log("middleware session",user);
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix); // Check if the route is an API authentication route
  const isAuthRoute = authRoutes.includes(nextUrl.pathname); // Check if the route is an authentication route (e.g., login, register)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname); // Check if the route is a public route
 
  if (nextUrl.pathname.startsWith('/api/leaderboard')) {
    return; // Allow the cron job to run without redirecting
  }

  if (isPublicRoute) {
    return;
  }
  // Allow API authentication routes to bypass authentication checks
  if (isApiAuthRoute) {
    return;
  }

  // if (!user || !user.isSessionValid) {
  //   // Redirect to login if session is invalid
  //   return Response.redirect(new URL('/auth/login', nextUrl));
  // }
  // Redirect logged-in users away from auth routes (e.g., to prevent accessing login page if already logged in)
  if (isAuthRoute) {
    if (isLoggedIn && user) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl)); // Redirect to default page after login
    }
    return;
  }

  // If the user is not logged in and the route is not public, redirect to the login page
  if ( !isPublicRoute && !user) {
    return Response.redirect(new URL('/auth/login', nextUrl));
  }


  // if(!user?.isSessionValid){
  //   return Response.redirect(new URL('/auth/login', nextUrl));

  // }
  // Logic for logged-in users
  if (isLoggedIn) {
    try {
      

      if (!user) {
        console.error("User not found");
        return Response.redirect(new URL('/auth/login', nextUrl)); // Redirect to login if the user is not found
      }

      // Log the current user state for debugging purposes
      console.log("Current user state:", {
        isAccessible: user.isAccessible,
        userFormCompleted: user.userFormCompleted,
        onBoardingCompleted: user.onBoardingCompleted,
        currentPath: nextUrl.pathname
      });

      // Check if the user isAccessible, if not, redirect to /access-code
      if (!user.isAccessible && nextUrl.pathname !== '/access-code') {
        console.log("Redirecting to /access-code");
        return Response.redirect(new URL('/access-code', nextUrl));
      }

      // If isAccessible is true, and userFormCompleted is false, redirect to /user-info
      if (user.isAccessible && !user.userFormCompleted && nextUrl.pathname !== '/user-info') {
        console.log("Redirecting to /user-info");
        return Response.redirect(new URL('/user-info', nextUrl));
      }
    
      // If userFormCompleted is true and onboarding is not completed, redirect to /onboarding
      if (user.userFormCompleted && !user.onBoardingCompleted && nextUrl.pathname !== '/onboarding') {
        console.log("Redirecting to /onboarding");
        return Response.redirect(new URL('/onboarding', nextUrl));
      }

      // If both userFormCompleted and onBoardingCompleted are true and isAccessible is true, redirect to default page
      if (user.userFormCompleted && user.onBoardingCompleted && user.isAccessible &&
          (nextUrl.pathname === '/user-info' || nextUrl.pathname === '/onboarding' || nextUrl.pathname === '/access-code')) {
        console.log("Redirecting to DEFAULT_LOGIN_REDIRECT");
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }

      // Check if the user is trying to access admin routes
      if (nextUrl.pathname.startsWith('/admin')) {
        const role = await currentRole(); // Fetch the user's role
        if (role !== 'ADMIN') {
          console.log("Non-admin user attempting to access admin route");
          return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl)); // Redirect non-admin users away from admin routes
        }
      }

    } catch (error) {
      console.error("Error fetching user data:", error);
      return Response.redirect(new URL('/auth/login', nextUrl)); // Redirect to login if there is an error fetching user data
    }
  }

  return; // Continue with the request if no redirects are necessary
});

// Middleware configuration
export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'], // Matches all routes except static files and Next.js internals
};
