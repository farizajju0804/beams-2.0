// Import NextAuth providers for Google OAuth and Credentials-based authentication
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import type { NextAuthConfig } from "next-auth"; // Importing the NextAuthConfig type
import { LoginSchema } from '@/schema'; // Import a schema to validate login credentials
import { getUserByEmail } from '@/actions/auth/getUserByEmail'; // Action to get a user by email
import bcrypt from 'bcryptjs'; // Bcrypt for hashing and verifying passwords
import { getClientIp } from './utils/getClientIp';

export default {
  providers: [
    // Google OAuth provider configuration
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID, // Google client ID from environment variables
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google client secret from environment variables
      authorization: {
        params: {
          prompt: "consent", // Forces the consent screen to reappear
          access_type: "offline", // Allows obtaining a refresh token for long-lived sessions
          response_type: "code", // Authorization code flow for OAuth
        },
      },
      // Custom profile handler to structure the user's profile data after successful OAuth login
      profile: async (_profile) => {
        const ip = getClientIp();
        return {
          id: _profile.sub,
          firstName: _profile.given_name,
          lastName: _profile.family_name,
          email: _profile.email,
          image: _profile.picture,
          lastLoginIp: ip,
          lastLoginAt: new Date(),
        };
      }
    }),
    
    // Credentials provider configuration for email/password login
    Credentials({
      async authorize(credentials) {
        // Validate the input credentials against the schema
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          
          // Fetch user data based on the provided email
          let user = await getUserByEmail(email);
          if (!user || !user.password) return null; // Return null if user doesn't exist or has no password set
          
          // If not an automatic login, verify the provided password using bcrypt
          if (!credentials.isAutoLogin) {
            const passwordsMatch = await bcrypt.compare(password, user.password);
            if (!passwordsMatch) return null; // Return null if passwords don't match
          }

          // Return the user object if login is successful
          return user;
        }
        return null; // Return null if validation fails
      },
    }),
  ],
} satisfies NextAuthConfig; // Ensures this object satisfies the NextAuthConfig type
