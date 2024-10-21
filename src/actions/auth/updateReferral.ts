"use server"

import { currentUser } from "@/libs/auth"
import { getUserById2 } from "./getUserByEmail"
import { getUserByReferralCode } from "./register"
import { db } from "@/libs/db"
import { updateUserPointsAndLeaderboard } from "../points/updateUserPointsAndLeaderboard"
import { generateNotification } from "../notifications/notifications"
import { REFERRAL_POINTS } from "@/constants/pointsConstants"
import { getGrowthAmbassadorStatus } from "./getGrowthAmbassadorStatus"


export const updateReferral = async (referralCode:string) => {
  const user:any = await currentUser()
  const userId = user?.id

  let success = false
 const existingUser:any = await getUserById2(userId)

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
      referralStatus: 'VERIFIED', // Set the referral status as verified
      isAccessible : true
    }
  });


  const pointsAdded = REFERRAL_POINTS; 
  await updateUserPointsAndLeaderboard(
    existingUser?.id,
    pointsAdded,
    'REFERRAL_BONUS', 
    `Welcome bonus"`, 
    existingUser?.userType // Referrer's user type
  );
  const referrer = await db.user.findUnique({
    where: { id: referredById },
  });



  if (referrer) {
    // Update points and leaderboard for the referrer
    await updateUserPointsAndLeaderboard(
      referrer.id,
      pointsAdded,
      'REFERRAL', // The source for referral points
      `Referral for user, "${existingUser?.firstName}"`, // Description message
      referrer.userType // Referrer's user type
    );

    const achievementName = "Growth Ambassador";
    const achievement = await db.achievement.findUnique({
      where: { name: achievementName },
    });

  if (achievement) {
    let userAchievement = await db.userAchievement.findUnique({
      where: { userId_achievementId: { userId: referrer.id, achievementId: achievement.id } },
    });

    if (userAchievement?.completionStatus) {
      // Achievement is already completed, so don't do anything
      console.log(`'Growth Ambassador' already completed for user: ${referrer.id}`);
      return true;
    }

    if (!userAchievement) {
      // Create new progress if no existing achievement
      userAchievement = await db.userAchievement.create({
        data: {
          userId: referrer.id,
          achievementId: achievement.id,
          progress: 1,
          completionStatus: false,
          updatedAt: new Date(),
        },
      });
    } else {
      // Increment progress
      const newProgress = userAchievement.progress + 1;
      const isNowCompleted = newProgress >= achievement.totalCount;

      await db.userAchievement.update({
        where: { id: userAchievement.id },
        data: {
          progress: newProgress,
          completionStatus: isNowCompleted,
          updatedAt: new Date(),
        },
      });

      if (isNowCompleted) {
        // Generate notification if the achievement is completed
        await generateNotification(
          referrer.id,
          'ACHIEVEMENT', // Assuming you have this enum value
          `Congratulations! You've unlocked 'Growth Ambassador' badge!`,
          `/achievements/#${achievement.id}` // Action URL for achievements
        );
      }
    }
  }
  }

  


 return true;
}


export const updateAccessibleStatus = async (referralCode: string) => {
  const user: any = await currentUser()
  const userId = user?.id

  const existingUser: any = await getUserById2(userId)
 
  if (existingUser?.referredById) {
    return { success: true, message: "User already has a referrer" };
  }
 
  if (!existingUser?.referredById && user?.isOAuth) {
    if (referralCode) {
      const referrer = await getUserByReferralCode(referralCode);
      if (referrer) {
        const referralLimit = await getGrowthAmbassadorStatus(referrer.userId)
        console.log('referral limit status', referralLimit)
        if (!referralLimit?.completed) {
          await db.user.update({
            where: { id: userId },
            data: {
              isAccessible: true,
              referredById: referrer.userId,
              referralStatus: 'VERIFIED'
            }
          });
          return { success: true, message: "Referral processed successfully" };
        } else {
          return { success: false, message: "Referrer has reached their limit" };
        }
      } else {
        return { success: false, message: "Invalid referral code" };
      }
    } else {
      return { success: false, message: "No referral code provided" };
    }
  }
  
  return { success: false, message: "Unable to process referral" };
}