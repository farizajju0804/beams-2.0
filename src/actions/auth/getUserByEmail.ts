import { db } from '@/libs/db'; // Import the database instance from the database library
import { revalidatePath } from 'next/cache';
export const runtime = 'edge';
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const dynmaic = 'force dynamic';

/**
 * Fetch a user from the database by their email address.
 * @param {string} email - The email of the user to fetch.
 * @returns {Promise<Object | null>} The user object if found, otherwise null.
 */
export const getUserByEmail = async (email: string) => {

    const user = await db.user.findUnique({
      where: {
        email,
      },
       
    }, 
     
    );
  
    return user;

};

/**
 * Fetch a user from the database by their unique ID.
 * @param {string} id - The unique ID of the user to fetch.
 * @returns {Promise<Object | null>} The user object if found, otherwise null.
 */
export const getUserById2 = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id, // Search for user by unique ID
      },
    });

    return user; // Return the found user
  } catch {
    return null; // Return null if an error occurs or user is not found
  }
};

/**
 * Fetch a user from the database by matching their security answers.
 * This method is case insensitive.
 * @param {string} securityAnswer1 - The first security answer.
 * @param {string} securityAnswer2 - The second security answer.
 * @returns {Promise<Object | null>} The user object if found, otherwise null.
 */
export const getUserBySecurityAnswers = async (securityAnswer1: string, securityAnswer2: string) => {
  // Fetch all users matching the security answers
  return await db.user.findMany({
    where: {
      AND: [
        { securityAnswer1: { equals: securityAnswer1, mode: 'insensitive' } }, // Case-insensitive match
        { securityAnswer2: { equals: securityAnswer2, mode: 'insensitive' } },
      ],
    },
  });
};


