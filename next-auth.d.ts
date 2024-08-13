import NextAuth, {DefaultSession} from "next-auth";
export type ExtendedUser = DefaultSession["user"] & {
    firstName : string;
    lastName : string;
    role : "ADMIN" | "USER",
    isTwoFactorEnabled : boolean;
    isOAuth : boolean;
    userFormCompleted : boolean;
    onBoardingCompleted : boolean;
    image : string;
}
declare module "next-auth"{
    interface Session{
      user:ExtendedUser; 
    }
  }