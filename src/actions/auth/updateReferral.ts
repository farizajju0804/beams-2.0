"use server"

import { currentUser } from "@/libs/auth"
import { getUserById2 } from "./getUserByEmail"
import { getUserByReferralCode } from "./register"
import { db } from "@/libs/db"
import { updateUserPointsAndLeaderboard } from "../points/updateUserPointsAndLeaderboard"


export const updateReferral = async (referralCode:string) => {
  const user:any = await currentUser()
  const userId = user?.id

  let success = false
 const existingUser = await getUserById2(userId)

 if (existingUser?.referredById) {
    return false; 
  }

  let referredById = null;
  if (referralCode) {
    // Find the referrer using the referral code
    const referrer = await getUserByReferralCode(referralCode);
    if (referrer) {
      referredById = referrer.userId;
    }
  }

  if (!referredById) {
    return false; // No valid referral code or referrer not found
  }

  await db.user.update({
    where: { id: userId },
    data: {
      referredById, // Set referredById if found
      referralStatus: 'VERIFIED' // Set the referral status as verified
    }
  });


  const pointsAdded = 20; // Points to be awarded for referral email verification
  const referrer = await db.user.findUnique({
    where: { id: referredById },
  });


  if (referrer) {
    // Update points and leaderboard for the referrer
    await updateUserPointsAndLeaderboard(
      referrer.id,
      pointsAdded,
      'REFERRAL_EMAIL_VERIFICATION', // The source for referral points
      `Referral for user, "${existingUser?.email}"`, // Description message
      referrer.userType // Referrer's user type
    );
  }

 return true;
}