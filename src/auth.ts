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
import { getUserByEmail, getUserById2 } from "./actions/auth/getUserByEmail";
import { UserType } from "@prisma/client";
import { getClientIp } from "./utils/getClientIp";

// Exporting authentication handlers (GET, POST) for use in the Next.js API routes
export const {
  handlers: { GET, POST },
  auth, // Auth method to manage authentication
  signIn, // Sign-in method
  signOut, // Sign-out method
} = NextAuth({
  pages: {
    signIn: "/auth/login", // Custom sign-in page
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
  },

  // Callbacks to customize sign-in, session, and JWT handling
  callbacks: {
    // Sign-in callback to handle additional validation like two-factor authentication
    async signIn({ user, account }) {
      const existingUser = await getUserByEmail(user.email as string);
      if (existingUser?.isBanned) {
        return false;
      }

      // Skip validation if the provider is not credentials-based (e.g., Google OAuth)
      if (account?.provider === "google") {
        const ip = getClientIp();
        try {
          // const existingUser = await getUserByEmail(user.email as string);
          if (existingUser) {
            await db.user.update({
              where: { email: user.email as string },
              data: {
                lastLoginIp: ip,
                lastLoginAt: new Date(),
                isSessionValid: true
              },
            });
          } else {
            return true;
          }
        } catch (error) {
          console.error("Error in Google signIn callback:", error);
          return false;
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
        where: { id: existingUser.id },
        data: { isSessionValid: true }
      });
      return true; // Allow login if all conditions are satisfied
    },

    // Callback to customize session data
    async session({ token, session }) {
     
      if (token.sub && session.user) {
        session.user.id = token.sub; // Attach the user's ID to the session
      }
      if (token.role && session.user) {
        session.user.role = token.role as "ADMIN" | "USER"; // Attach user role to the session
      }
      if (session.user) {
        // Attach other user-related data to the session

        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.userType = token.userType as UserType;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.image = token.image as string;
        session.user.userFormCompleted = token.userFormCompleted as boolean; // Attach form completion status
        session.user.onBoardingCompleted = token.onBoardingCompleted as boolean; // Attach onboarding completion status
        session.user.isAccessible = token.isAccessible as boolean;
        session.user.isSessionValid = token.isSessionValid as boolean; 
        session.user.isBanned = token.isBanned as boolean;
      }
      
      return session; // Return the session with additional user info
    },

    // JWT callback to handle token-related logic
    async jwt({ token, user, trigger, session }) {
      

    
    
    if (trigger === "update" && session?.user) {
      console.log("Updating token with session data:", session.user);
      token = { ...token, ...session.user };
    }



      // If the token contains a user identifier (sub), update it with fresh data
      if (token.sub) {
        const existingUser = await getUserByEmail(token.email as string); 
       
        token.sub = existingUser?.id; // Update token with the user's ID
        if (existingUser) {
          // Fetch the user's account and update token with relevant user data
          const existingAccount = await getAccountByUserId(existingUser.id);
          token.isOAuth = !!existingAccount; // Check if the user has an OAuth account
          token.firstName = existingUser.firstName;
          token.lastName = existingUser.lastName;
          token.userType = existingUser.userType;
          token.email = existingUser.email;
          token.role = existingUser.role;
          token.image = existingUser.image;
          token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
          token.userFormCompleted = existingUser.userFormCompleted;
          token.onBoardingCompleted = existingUser.onBoardingCompleted;
          token.isAccessible = existingUser.isAccessible;
          token.isSessionValid = existingUser.isSessionValid;
          token.isBanned = existingUser.isBanned;
          if (existingUser.isBanned) {
            token.isSessionValid = false;
          }
        }
      }
   
      if (token.isSessionValid === false || token.isBanned === true) {
        return null;
      }
      return token; // Return updated token
    },

    // Redirect callback to control redirects after authentication actions
    async redirect({ url, baseUrl }) {
      // Handle internal redirects or external redirects to the base URL
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}`;
    }
  },

  // Use the Prisma adapter for connecting NextAuth to the database
  adapter: PrismaAdapter(db),

  // Use JWTs to manage session state
  session: { strategy: "jwt" },

  // Spread additional authentication configuration from authConfig
  ...authConfig,
});
