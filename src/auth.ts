import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { PrismaAdapter} from "@auth/prisma-adapter"
import {db} from "@/libs/db";
import { getUserById } from "./actions/auth/getUserById";
import { getTwoFactorConfirmationByUserId } from "./actions/auth/two-factor-confirmation";
import { getAccountByUserId } from "./actions/auth/account";


export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut
} = NextAuth({
  pages:{
    signIn: "/auth/login",
    error: "auth/error",
    
  },
  events:{
  async linkAccount({user}){
    await db.user.update({
      where : {id : user.id},
      data:{emailVerified: new Date()}
    })
  }
  },
  callbacks: {
    async signIn({user,account}){
    if(account?.provider !== "credentials" ) return true;
    const existingUser = await getUserById(user.id as string);
    if(!existingUser?.emailVerified){
      return false;
    }

    if(existingUser.isTwoFactorEnabled){
      const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

      if(!twoFactorConfirmation) return false;

      await db.twoFactorConfirmation.delete({
        where :{id : twoFactorConfirmation.id}
      })
    }
      
       return true;
    },
    async session({token,session}){
      if(token.sub && session.user){
          session.user.id = token.sub;
      }

      if(token.role && session.user){
        session.user.role = token.role as "ADMIN" | "USER"
      }
      if(session.user){
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
      }
      if(session.user){
        session.user.name = token.name 
        session.user.email = token.email as string
        session.user.isOAuth = token.isOAuth as boolean;
      }
      return session;
    },
    async jwt({token}){
    if(!token.sub) return token;
    
    const existingUser = await getUserById(token.sub)
    if(!existingUser) return token;

    const existingAccount = await getAccountByUserId(existingUser.id)
    token.isOAuth = !!existingAccount;
    token.name = existingUser.name;
    token.email = existingUser.email;
    token.role = existingUser.role;
    token.isTwoFactorEnabled =  existingUser.isTwoFactorEnabled
    return token;
    },  
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/beams-today`;
    }
  },
  adapter : PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});