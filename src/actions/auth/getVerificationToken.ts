'use server'
import { db } from '@/libs/db'; // Import the database instance from the db library

/**
 * Fetches a verification token by the user's email.
 * @param {string} email - The email associated with the verification token.
 * @returns {Promise<Object | null>} The verification token object if found, otherwise null.
 */
export const getVerificationTokenByEmail = async (email: string) => {
  try {
    // Find the first verification token associated with the provided email
    const verificationToken = await db.verificationToken.findFirst({
      where: { email }, // Search for the token by email
    });
    return verificationToken; // Return the found verification token
  } catch (error) {
    return null; // Return null if an error occurs or no token is found
  }
};


export const getChangeTokenByEmail = async (email: string) => {
  try {
    // Find the first verification token associated with the provided email
    const changeToken = await db.changeToken.findFirst({
      where: { email }, // Search for the token by email
    });
    return changeToken; // Return the found verification token
  } catch (error) {
    return null; // Return null if an error occurs or no token is found
  }
};
/**
 * Fetches a verification token by its unique token value.
 * @param {string} token - The unique verification token string.
 * @returns {Promise<Object | null>} The verification token object if found, otherwise null.
 */
export const getVerificationTokenByToken = async (token: string) => {
  try {
    // Find the verification token by its unique token string
    const verificationToken = await db.verificationToken.findUnique({
      where: { token }, // Search for the token by the token value
    });
    return verificationToken; // Return the found verification token
  } catch (error) {
    return null; // Return null if an error occurs or no token is found
  }
};


export const getChangeTokenByToken = async (token: string,uuid:string) => {
  try {
    // Find the verification token by its unique token string
    const changeToken = await db.changeToken.findUnique({
      where: { 
        token : token ,
        uuid : uuid
      }, // Search for the token by the token value
    });
    return changeToken; // Return the found verification token
  } catch (error) {
    return null; // Return null if an error occurs or no token is found
  }
};