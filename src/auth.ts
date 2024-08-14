import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/libs/db";
import { getUserById } from "./actions/auth/getUserById";
import { getTwoFactorConfirmationByUserId } from "./actions/auth/two-factor-confirmation";
import { getAccountByUserId } from "./actions/auth/account";
import { authRoutes, publicRoutes } from "./routes";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;
      const existingUser = await getUserById(user.id as string);
      if (!existingUser?.emailVerified) {
        return false;
      }

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );

        if (!twoFactorConfirmation) return false;

        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as "ADMIN" | "USER";
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }
      if (session.user) {
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.image = token.image as string;
        session.user.userFormCompleted = token.userFormCompleted as boolean; // Add this line to include user info completion status
        session.user.onBoardingCompleted = token.onBoardingCompleted as boolean; // Add this line to include onboarding status
      }
      return session;
    },
    async jwt({ token, trigger }) {
     
      
      if (token.sub) {
        const existingUser = await getUserById(token.sub);
        if (existingUser) {
          const existingAccount = await getAccountByUserId(existingUser.id);
          
          // Update token with latest user data
          token.isOAuth = !!existingAccount;
          token.firstName = existingUser.firstName;
          token.lastName = existingUser.lastName;
          token.email = existingUser.email;
          token.role = existingUser.role;
          token.image = existingUser.image;
          token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
          token.userFormCompleted = existingUser.userFormCompleted;
          token.onBoardingCompleted = existingUser.onBoardingCompleted;
        }
      }

      return token;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}`;
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
