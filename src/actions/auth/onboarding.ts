// actions/auth/onboarding.ts
'use server'

import { db } from "@/libs/db" // Import the Prisma database connection
import { auth } from "@/auth" // Import the authentication helper
import { redirect } from 'next/navigation' // Import for redirection purposes (not used here)
import { DEFAULT_LOGIN_REDIRECT } from '@/routes' // Import the default redirect route
import { updateUserPointsAndLeaderboard } from "../points/updateUserPointsAndLeaderboard"
import { generateNotification } from "../notifications/notifications"
import { User } from "@prisma/client"
import { REFERRAL_POINTS } from "@/constants/pointsConstants"

/**
 * Updates the onboarding status of the authenticated user.
 * 
 * @param {boolean} status - The onboarding status to set (true for completed, false for not completed).
 * @returns {Promise<Object>} The updated user record or an error object.
 * @throws {Error} If the user is not authenticated or if there is a database error.
 */
export async function updateOnboardingStatus(status: boolean) {
  // Get the current session to check if the user is authenticated
  const session = await auth()

  // If no session or user is found, throw an error
  if (!session || !session.user) {
    throw new Error("Not authenticated")
  }

  try {
    // Update the `onBoardingCompleted` field in the database for the authenticated user
    const existingUser:User = await db.user.update({
      where: { id: session.user.id }, // Locate the user by their ID
      data: { onBoardingCompleted: status }, // Set the new onboarding status
    })
    

    if (existingUser.referredById) {
      const pointsAdded = REFERRAL_POINTS; 
      await updateUserPointsAndLeaderboard(
        existingUser?.id,
        pointsAdded,
        'REFERRAL_BONUS', 
        `Welcome bonus"`, 
        existingUser?.userType // Referrer's user type
      );
      
      const referrer = await db.user.findUnique({
        where: { id: existingUser.referredById },
      });
    if (referrer) {
      // Update points and leaderboard for the referrer
      const updateResult = await updateUserPointsAndLeaderboard(
        referrer.id,
        pointsAdded,
        'REFERRAL', // The source for referral points
        `Referral for user, "${existingUser.firstName}"`, // Description message
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
          `/achievements/#growth-ambassador` // Action URL for achievements
        );
      }
    }
  }
    }

    
    }
    return existingUser // Return the updated user data
  } catch (error) {
    // Log any error that occurs and return it
    console.error("Error updating onboarding status:", error);
    return error
  }
};
