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

  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

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

      // // If user is on /user-info, has completed user info, but not onboarding
      // if (nextUrl.pathname === '/user-info' && user.userFormCompleted && !user.onBoardingCompleted) {
      //   return Response.redirect(new URL('/onboarding', nextUrl));
      // }

      // // If user is on /onboarding and has completed both user info and onboarding
      // if (nextUrl.pathname === '/onboarding' && user.userFormCompleted && user.onBoardingCompleted) {
      //   return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
      // }

      // Existing logic
      // if (!user.userFormCompleted && nextUrl.pathname !== '/user-info') {
      //   return Response.redirect(new URL('/user-info', nextUrl));
      // }

      // if (user.userFormCompleted && !user.onBoardingCompleted && nextUrl.pathname !== '/onboarding') {
        
      //   return Response.redirect(new URL('/onboarding', nextUrl));
      // }
      if (user.userFormCompleted && user.onBoardingCompleted && 
        (nextUrl.pathname === '/user-info' || nextUrl.pathname === '/onboarding')) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    // Redirect to user-info if not completed
    if (!user.userFormCompleted && nextUrl.pathname !== '/user-info' && !isPublicRoute) {
      return Response.redirect(new URL('/user-info', nextUrl));
    }

    // Redirect to onboarding if user-info completed but onboarding not completed
    if (user.userFormCompleted && !user.onBoardingCompleted && 
        nextUrl.pathname !== '/onboarding' && !isPublicRoute) {
      return Response.redirect(new URL('/onboarding', nextUrl));
    }

      // Check for admin routes
      if (nextUrl.pathname.startsWith('/admin')) {
        const role = await currentRole();
        if (role !== 'ADMIN') {
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