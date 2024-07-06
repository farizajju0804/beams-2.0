import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import type { NextAuthConfig } from "next-auth";
import { LoginSchema } from '@/schema';
import { getUserByEmail } from '@/actions/auth/getUserByEmail';
import bcrypt from 'bcryptjs';

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          let user = await getUserByEmail(email);
          if (!user || !user.password) return null;
          
          // Skip password check for automatic login
          if (!credentials.isAutoLogin) {
            const passwordsMatch = await bcrypt.compare(password, user.password);
            if (!passwordsMatch) return null;
          }
          
          
          return user;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
