import authConfig from "@/auth.config"
import NextAuth from "next-auth"
import { getToken } from "next-auth/jwt"; 
import { publicRoutes, DEFAULT_LOGIN_REDIRECT, authRoutes, apiAuthPrefix } from "./routes";
import { currentRole } from "./libs/auth";
const { auth } = NextAuth(authConfig);

export default auth(async(req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const role = await currentRole();

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


  if (nextUrl.pathname.startsWith('/admin')) {
    // Check if the user has the admin role
    if (role !== 'ADMIN') {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
  }
  return;
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};

