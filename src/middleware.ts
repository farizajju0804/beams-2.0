import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import { publicRoutes, DEFAULT_LOGIN_REDIRECT, authRoutes, apiAuthPrefix } from "./routes";
import { currentRole, currentUser } from "./libs/auth";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  // Allow API authentication routes
  if (isApiAuthRoute) {
    return;
  }

  // Redirect logged-in users away from auth routes
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  // Redirect non-logged-in users to login for non-public routes
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL('/auth/login', nextUrl));
  }

  if (isLoggedIn) {
    try {
      const user = await currentUser();
      
      if (!user) {
        console.error("User not found");
        return Response.redirect(new URL('/auth/login', nextUrl));
      }

      console.log("Current user state:", {
        userFormCompleted: user.userFormCompleted,
        onBoardingCompleted: user.onBoardingCompleted,
        currentPath: nextUrl.pathname
      });

      // Redirect to user-info if not completed
      if (!user.userFormCompleted && nextUrl.pathname !== '/user-info' && !isPublicRoute) {
        console.log("Redirecting to /user-info");
        return Response.redirect(new URL('/user-info', nextUrl));
      }

      // Redirect to onboarding if user-info completed but onboarding not completed
      if (user.userFormCompleted && !user.onBoardingCompleted &&
          nextUrl.pathname !== '/onboarding' && !isPublicRoute) {
        console.log("Redirecting to /onboarding");
        return Response.redirect(new URL('/onboarding', nextUrl));
      }

      // Redirect to DEFAULT_LOGIN_REDIRECT if both user-info and onboarding are completed
      if (user.userFormCompleted && user.onBoardingCompleted &&
          (nextUrl.pathname === '/user-info' || nextUrl.pathname === '/onboarding')) {
        console.log("Redirecting to DEFAULT_LOGIN_REDIRECT");
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      }

      // Check for admin routes
      if (nextUrl.pathname.startsWith('/admin')) {
        const role = await currentRole();
        if (role !== 'ADMIN') {
          console.log("Non-admin user attempting to access admin route");
          return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
      }

    } catch (error) {
      console.error("Error fetching user data:", error);
      return Response.redirect(new URL('/auth/login', nextUrl));
    }
  }

  return;
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};