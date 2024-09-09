import { db } from '@/libs/db'; // Import the database instance from the database library

/**
 * Fetch a user from the database by their email address.
 * @param {string} email - The email of the user to fetch.
 * @returns {Promise<Object | null>} The user object if found, otherwise null.
 */
export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email, // Search for user by email
      },
    });
    return user; // Return the found user
  } catch {
    return null; // Return null if an error occurs or user is not found
  }
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
    console.log("got by id", user); // Log the retrieved user for debugging purposes
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
  return await db.user.findFirst({
    where: {
      AND: [
        { securityAnswer1: { equals: securityAnswer1, mode: 'insensitive' } }, // Case-insensitive match for securityAnswer1
        { securityAnswer2: { equals: securityAnswer2, mode: 'insensitive' } }, // Case-insensitive match for securityAnswer2
      ],
    },
  });
};
