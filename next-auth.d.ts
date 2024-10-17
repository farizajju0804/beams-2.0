import { UserType } from "@prisma/client";
import NextAuth, {DefaultSession} from "next-auth";
export type ExtendedUser = DefaultSession["user"] & {
    firstName : string;
    lastName : string;
    role : "ADMIN" | "USER",
    isTwoFactorEnabled : boolean;
    userType : UserType;
    isOAuth : boolean;
    userFormCompleted : boolean;
    onBoardingCompleted : boolean;
    isAccessible : boolean;
    isSessionValid : boolean;
    image : string;
}
declare module "next-auth"{
    interface Session{
      user:ExtendedUser; 
    }
  }