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
      // console.log(user)
      
      if (!user) {
        console.error("User not found");
        return Response.redirect(new URL('/auth/login', nextUrl));
      }

      if (nextUrl.pathname === '/user-info' && user.userFormCompleted) {
        return Response.redirect(new URL('/onboarding', nextUrl));
      }
      if (!user.userFormCompleted && nextUrl.pathname !== '/user-info') {
        return Response.redirect(new URL('/user-info', nextUrl));
      }
      
      if (user.userFormCompleted && !user.onBoardingCompleted && nextUrl.pathname !== '/onboarding') {
        return Response.redirect(new URL('/onboarding', nextUrl));
      }

      // Allow access to '/user-info' and '/onboarding' only for logged-in users
      if (nextUrl.pathname === '/user-info' || nextUrl.pathname === '/onboarding') {
        return;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // In case of error, allow the request to proceed
      return;
    }
  }

  const role = await currentRole();

  if (nextUrl.pathname.startsWith('/admin')) {
    if (role !== 'ADMIN') {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
  }

  return;
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};