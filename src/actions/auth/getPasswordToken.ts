import { db } from '@/libs/db'; // Import the database instance from the db library

/**
 * Fetches a password reset token by the user's email.
 * @param {string} email - The email associated with the password reset token.
 * @returns {Promise<Object | null>} The password reset token object if found, otherwise null.
 */
export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    // Find the first password reset token associated with the provided email
    const passwordToken = await db.passwordResetToken.findFirst({
      where: { email }, // Search for the token by email
    });
    return passwordToken; // Return the found password reset token
  } catch (error) {
    return null; // Return null if an error occurs or no token is found
  }
};

/**
 * Fetches a password reset token by its unique token value.
 * @param {string} token - The unique password reset token string.
 * @returns {Promise<Object | null>} The password reset token object if found, otherwise null.
 */
export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    // Find the password reset token by its unique token string
    const passwordToken = await db.passwordResetToken.findUnique({
      where: { token }, // Search for the token by the token value
    });
    return passwordToken; // Return the found password reset token
  } catch (error) {
    return null; // Return null if an error occurs or no token is found
  }
};
