'use server'
import { db } from '@/libs/db';

/**
 * Retrieves the two-factor authentication token by the user's email.
 * @param {string} email - The user's email address.
 * @returns {Object|null} - Returns the two-factor token if found, otherwise null.
 */
export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findFirst({
      where: {
        email,
      },
    });
    return twoFactorToken;
  } catch (error) {
    console.error("Error fetching two-factor token by email:", error);
    return null;
  }
};

/**
 * Retrieves the two-factor authentication token by the token value.
 * @param {string} token - The two-factor authentication token value.
 * @returns {Object|null} - Returns the two-factor token if found, otherwise null.
 */
export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findUnique({
      where: {
        token,
      },
    });
    return twoFactorToken;
  } catch (error) {
    console.error("Error fetching two-factor token by token value:", error);
    return null;
  }
};
