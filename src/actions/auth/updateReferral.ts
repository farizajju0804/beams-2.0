"use server"

// Import necessary functions and database instance
import { currentUser } from "@/libs/auth" // Fetches the current logged-in user
import { getUserById2 } from "./getUserByEmail" // Retrieves user details by user ID
import { getUserByReferralCode } from "./register" // Fetches user data by referral code
import { db } from "@/libs/db" // Database instance for database operations
import { getGrowthAmbassadorStatus } from "./getGrowthAmbassadorStatus" // Checks referrer's status regarding referral limit

// Main function to update user accessibility status based on referral code
export const updateAccessibleStatus = async (referralCode: string) => {
  // Get the current user and their ID
  const user: any = await currentUser();
  const userId = user?.id;

  // Fetch details of the current user from the database
  const existingUser: any = await getUserById2(userId);

  // If the user already has a referrer, return success without updating
  if (existingUser?.referredById) {
    return { success: true, message: "User already has a referrer" };
  }

  // Only continue if the user has no referrer and is authenticated through OAuth
  if (!existingUser?.referredById && user?.isOAuth) {
    // Check if a referral code was provided
    if (referralCode) {
      // Get referrer details using the provided referral code
      const referrer = await getUserByReferralCode(referralCode);
      
      if (referrer) { // If the referrer exists
        // Check the referrer's referral status to ensure they haven't reached their limit
        const referralLimit = await getGrowthAmbassadorStatus(referrer.userId);
        console.log('referral limit status', referralLimit);
        
        if (!referralLimit?.completed) { // If referrer limit is not reached
          // Update the current user's referral details in the database
          await db.user.update({
            where: { id: userId },
            data: {
              isAccessible: true, // Grants access to the user
              referredById: referrer.userId, // Sets the referrer ID
              referralStatus: 'REGISTERED' // Updates the referral status to "REGISTERED"
            }
          });
          return { success: true, message: "Referral processed successfully" };
        } else {
          // If referrer has reached their limit, deny referral processing
          return { success: false, message: "Referrer has reached their limit" };
        }
      } else {
        // If the referral code is invalid, return an error
        return { success: false, message: "Invalid referral code" };
      }
    } else {
      // If no referral code is provided, return an error
      return { success: false, message: "No referral code provided" };
    }
  }

  // Default response if conditions aren't met for processing the referral
  return { success: false, message: "Unable to process referral" };
};
