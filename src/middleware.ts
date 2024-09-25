import authConfig from "@/auth.config"; // Import authentication configuration
import NextAuth from "next-auth"; // Import NextAuth for handling authentication
import { publicRoutes, DEFAULT_LOGIN_REDIRECT, authRoutes, apiAuthPrefix } from "./routes"; // Import route configurations
import { currentRole, currentUser } from "./libs/auth"; // Import helper functions for user role and user data

const { auth } = NextAuth(authConfig); // Initialize NextAuth with the given configuration

// Middleware function to handle request authentication and redirection
export default auth(async (req) => {
  const { nextUrl } = req; // Get the requested URL

  const isLoggedIn = !!req.auth; // Check if the user is logged in
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix); // Check if the route is an API authentication route
  const isAuthRoute = authRoutes.includes(nextUrl.pathname); // Check if the route is an authentication route (e.g., login, register)
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname); // Check if the route is a public route
  if (nextUrl.pathname.startsWith('/api/leaderboard')) {
    return; // Allow the cron job to run without redirecting
  }
  // Allow API authentication routes to bypass authentication checks
  if (isApiAuthRoute) {
    return;
  }

  // Redirect logged-in users away from auth routes (e.g., to prevent accessing login page if already logged in)
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl)); // Redirect to default page after login
    }
    return;
  }

  // If the user is not logged in and the route is not public, redirect to the login page
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL('/auth/login', nextUrl));
  }

  // Logic for logged-in users
  if (isLoggedIn) {
    try {
      const user = await currentUser(); // Fetch the current user data
      if (!user) {
        console.error("User not found");
        return Response.redirect(new URL('/auth/login', nextUrl)); // Redirect to login if the user is not found
      }

      // Log the current user state for debugging purposes
      console.log("Current user state:", {
        userFormCompleted: user.userFormCompleted,
        onBoardingCompleted: user.onBoardingCompleted,
        currentPath: nextUrl.pathname
      });

      // If user info is not completed, redirect to user-info page
      if (!user.userFormCompleted && nextUrl.pathname !== '/user-info' && !isPublicRoute) {
        console.log("Redirecting to /user-info");
        return Response.redirect(new URL('/user-info', nextUrl));
      }

      // If user info is completed but onboarding is not, redirect to onboarding page
      if (user.userFormCompleted && !user.onBoardingCompleted &&
          nextUrl.pathname !== '/onboarding' && !isPublicRoute) {
        console.log("Redirecting to /onboarding");
        return Response.redirect(new URL('/onboarding', nextUrl));
      }

      // If both user info and onboarding are completed, redirect to the default page
      if (user.userFormCompleted && user.onBoardingCompleted &&
          (nextUrl.pathname === '/user-info' || nextUrl.pathname === '/onboarding')) {
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
