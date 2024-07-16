import NextAuth, {DefaultSession} from "next-auth";
export type ExtendedUser = DefaultSession["user"] & {
    role : "ADMIN" | "USER",
    isTwoFactorEnabled : boolean;
    isOAuth : boolean;
    image : string;
}
declare module "next-auth"{
    interface Session{
      user:ExtendedUser; 
    }
  }