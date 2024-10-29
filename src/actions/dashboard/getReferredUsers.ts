'use server';

import { db } from "@/libs/db";

/**
 * Retrieves a list of users who were referred by a specific user.
 * 
 * This function queries the database to find all users that were referred
 * by the given user ID and have a verified referral status. It returns 
 * an array of referred users.
 * 
 * @param userId - The ID of the user whose referred users are to be fetched.
 * @returns A promise that resolves to an array of user objects, each representing
 *          a referred user with a verified referral status.
 */
export const getReferredUsers = async (userId: string) => {
   const referred = await db.user.findMany({
       where: {
           referredById: userId,      // Filter users by the ID of the referring user.
           referralStatus: 'VERIFIED', // Only include users with a verified referral status.
       }
   });

   return referred; // Return the list of referred users.
};
