// Import NextAuth for handling authentication in Next.js
import NextAuth from "next-auth";
// Import the custom authentication configuration (e.g., providers, pages)
import authConfig from "@/auth.config";
// Import the Prisma Adapter to integrate Prisma with NextAuth
import { PrismaAdapter } from "@auth/prisma-adapter";
// Import the Prisma database instance
import { db } from "@/libs/db";

// Importing custom actions for authentication logic
import { getTwoFactorConfirmationByUserId } from "./actions/auth/two-factor-confirmation";
import { getAccountByUserId } from "./actions/auth/account";
import {  getUserByEmail as getUserByEmail2,getUserById2 } from "./actions/auth/getUserByEmail";
import { UserRole, UserType } from "@prisma/client";
import { getClientIp } from "./utils/getClientIp";
import { cookies } from "next/headers";

// Exporting authentication handlers (GET, POST) for use in the Next.js API routes
export const {
  handlers: { GET, POST },
  auth, // Auth method to manage authentication
  signIn, // Sign-in method
  signOut, // Sign-out method
} = NextAuth({
  pages: {
    signIn: "/auth/login", // Custom sign-in page
    signOut: '/auth/login',
    error: "/auth/error", // Custom error page
  },
  
  // Event handlers for specific authentication events
  events: {
    async linkAccount({ user }) {
      // When an account is linked, update the user's email verification status
      await db.user.update({
        where: { id: user.id },
        data: { 
          emailVerified: new Date(),
          isSessionValid: true
         }, // Set emailVerified to the current date
      });
    },
    async signOut(message) {
      if ('token' in message && message.token) {
        if (message.token?.sub) {
          // Update the user's session validity in the database
          const updated = await db.user.update({
            where: { id: message.token.sub },
            data: { 
              isSessionValid: false,
            },
          });

        console.log("updated after signout",updated)

        }
      }
    },


  },

  // Callbacks to customize sign-in, session, and JWT handling
  callbacks: {
    // Sign-in callback to handle additional validation like two-factor authentication
    async signIn({ user, account }) {
      const existingUser = await getUserByEmail2(user.email as string);
      if (existingUser?.isBanned) {
        return false;
      }

      // Skip validation if the provider is not credentials-based (e.g., Google OAuth)
      if (account?.provider === "google") {
        const ip = await getClientIp();
       
          const existingUser = await getUserByEmail2(user.email as string);
          if (existingUser) {
            await db.user.update({
              where: { email: user.email as string },
              data: {
                lastLoginIp: ip,
                lastLoginAt: new Date(),
                isSessionValid: true
              },
            });
          } 
        
        return true;
      }
      

      
      if (account?.provider !== "credentials") return true;
      
      // Fetch user data to check if email is verified
      
      if (!existingUser?.emailVerified) {
        return false; // Block login if email is not verified
      }

      // If two-factor authentication is enabled, validate it
      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
        if (!twoFactorConfirmation) return false; // Block login if 2FA is not completed

        // Once confirmed, remove the 2FA token
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
       
      }
      await db.user.update({
        where: { email: existingUser.email as string },
        data: { isSessionValid: true }
      });
      return true; // Allow login if all conditions are satisfied
    },

    

    // Callback to customize session data
    async session({ token, session }) {
      if (token && session.user){
        session.user = {
          ...session.user,
          id: token.sub as string,
          email: token.email as string,
          firstName: token.firstName as string,
          image : token.image as string,
          lastName: token.lastName as string,
          userType: token.userType as UserType,
          role: token.role as UserRole,
          isOAuth : token.isOAuth as boolean,
          isTwoFactorEnabled: token.isTwoFactorEnabled as boolean,
          userFormCompleted: token.userFormCompleted as boolean,
          onBoardingCompleted: token.onBoardingCompleted as boolean,
          isAccessible: token.isAccessible as boolean,
          isSessionValid: token.isSessionValid as boolean,
          isBanned: token.isBanned as boolean,
        }
      }
      return session
    },
    // JWT callback to handle token-related logic
    async jwt({ token, user, trigger, session }) {
     if(!token.sub){
      return token
     }
    

     if (token && (token.iat === 0 || token.exp === 0)) {
      console.log("Token rejected due to invalidated iat/exp");
      return null;
    }
      if (trigger === "update" && session?.user) {
        token = { ...token, ...session.user };
      }

      if (token.sub) {
        const existingUser = await getUserById2(token.sub as string);
        if (existingUser) {
          const existingAccount = await getAccountByUserId(existingUser.id);
          token = {
            ...token,
            sub: existingUser.id,
            isOAuth: !!existingAccount,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            userType: existingUser.userType,
            email: existingUser.email,
            role: existingUser.role,
            image: existingUser.image,
            isTwoFactorEnabled: existingUser.isTwoFactorEnabled,
            userFormCompleted: existingUser.userFormCompleted,
            onBoardingCompleted: existingUser.onBoardingCompleted,
            isAccessible: existingUser.isAccessible,
            isSessionValid: existingUser.isSessionValid,
            isBanned: existingUser.isBanned,
          };
        }
      }
   
      // if (token.isSessionValid === false || token.isBanned === true) {
      //   return null;
      // }
      return token;
    },

    // Redirect callback to control redirects after authentication actions
    async redirect({ url, baseUrl }) {
      // Handle sign-out redirect
      if (url.startsWith('/auth/login')) {
        return `${baseUrl}/auth/login`;
      }
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    
  },

  // Use the Prisma adapter for connecting NextAuth to the database
  adapter: PrismaAdapter(db),

  // Use JWTs to manage session state
  session: { strategy: "jwt" },

  // Spread additional authentication configuration from authConfig
  ...authConfig,
});
