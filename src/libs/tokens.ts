// Importing functions and modules used for token management
import { getChangeTokenByEmail, getVerificationTokenByEmail } from "@/actions/auth/getVerificationToken"; // Function to retrieve verification token by email
import { getPasswordResetTokenByEmail } from "@/actions/auth/getPasswordToken"; // Function to retrieve password reset token by email
import { db } from '@/libs/db'; // Database connection from Prisma
import { v4 as uuidv4 } from "uuid"; // Importing UUID generation library for unique tokens
import crypto from 'crypto'; // Node.js crypto library for generating secure random numbers
import { getTwoFactorTokenByEmail } from "@/actions/auth/two-factor-token"; // Function to retrieve two-factor authentication token by email

/**
 * Generates a password reset token for a given email address.
 * 
 * @param {string} email - The email address to generate the reset token for.
 * @returns {Promise<object>} - The newly created password reset token object.
 */
export const getPasswordResetToken = async (email: string) => {
  // Generate a unique token using uuid and set its expiration time to 1 hour from the current time
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); // Token expires in 1 hour

  // Check if a password reset token already exists for the given email
  const existingToken = await getPasswordResetTokenByEmail(email);
  
  // If an existing token is found, delete it to avoid duplicate tokens
  if (existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id, // Delete token by its unique id
      },
    });
  }

  // Create a new password reset token in the database
  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires, // Set the expiration date
    },
  });

  return passwordResetToken; // Return the newly created token object
};

/**
 * Generates a verification token for email verification.
 * 
 * @param {string} email - The email address to generate the verification token for.
 * @returns {Promise<object>} - The newly created verification token object.
 */
export const getVerificationToken = async (email: string) => {
  // Generate a 6-digit random number for the token and set expiration to 1 hour from now
  const token = crypto.randomInt(100000, 1000000).toString();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  // Check if a verification token already exists for the given email
  const existingToken = await getVerificationTokenByEmail(email);
  
  // If an existing token is found, delete it
  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id, // Delete by token's unique id
      },
    });
  }

  // Create a new verification token in the database
  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token, // Store the generated token
      expires, // Set expiration date
    },
  });

  return verificationToken; // Return the newly created token object
};



/**
 * Generates a verification token for email verification.
 * 
 * @param {string} email - The email address to generate the verification token for.
 *  @param {string} uuid - Generated uuid to store in the db.
 * @returns {Promise<object>} - The newly created verification token object.
 */
export const getChangeEmailToken = async (email: string, uuid:string) => {
  // Generate a 6-digit random number for the token and set expiration to 1 hour from now
  const token = crypto.randomInt(100000, 1000000).toString();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  // Check if a verification token already exists for the given email
  const existingToken = await getChangeTokenByEmail(email);
  
  // If an existing token is found, delete it
  if (existingToken) {
    await db.changeToken.delete({
      where: {
        id: existingToken.id, // Delete by token's unique id
      },
    });
  }

  // Create a new verification token in the database
  const changeToken = await db.changeToken.create({
    data: {
      email,
      token, // Store the generated token
      uuid,
      expires, // Set expiration date
    },
  });

  return changeToken; // Return the newly created token object
};


/**
 * Generates a two-factor authentication (2FA) token.
 * 
 * @param {string} email - The email address to generate the 2FA token for.
 * @returns {Promise<object>} - The newly created 2FA token object.
 */
export const getTwoFactorToken = async (email: string) => {
  // Generate a 6-digit random number for the 2FA token and set expiration to 1 hour
  const token = crypto.randomInt(100000, 1000000).toString();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  // Check if a two-factor authentication token already exists for the given email
  const existingToken = await getTwoFactorTokenByEmail(email);

  // If an existing token is found, delete it
  if (existingToken) {
    await db.twoFactorToken.delete({
      where: {
        id: existingToken.id, // Delete by token's unique id
      },
    });
  }

  // Create a new 2FA token in the database
  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token, // Store the generated token
      expires, // Set expiration date
    },
  });

  return twoFactorToken; // Return the newly created token object
};
