'use server'
import { currentUser } from "@/libs/auth";
import { db } from "@/libs/db"; // Import Prisma instance
import { v4 as uuidv4 } from "uuid"; // Import UUID generator

// Function to generate or fetch referral code for the user
export const getOrCreateReferralCode = async () => {
    const user:any = await currentUser()
    const userId = user?.id
  try {
    // Check if the user already has a referral code
    const existingReferral = await db.referral.findUnique({
      where: { userId },
    });

    if (existingReferral) {
      // If a referral code already exists, return the existing referral code
      return existingReferral.referralCode;
    }

    // Generate a new UUID referral code
    const newReferralCode = uuidv4();

    // Save the new referral code in the database
    await db.referral.create({
      data: {
        userId, // Associate with the user
        referralCode: newReferralCode,
      },
    });

    return newReferralCode;
  } catch (error) {
    throw new Error(`Failed to generate or fetch referral code: ${(error as Error).message}`);
  }
};
