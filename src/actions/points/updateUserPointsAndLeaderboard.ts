"use server"; // Indicates this module is a server-side module

import { db } from '@/libs/db'; // Importing the database instance
import { updateLeaderboardEntry2 } from './updateLeaderboardEntry'; // Importing leaderboard update function
import { recordPointsHistory } from './recordPointsHistory'; // Importing points history recording function
import { PointsSource, User, UserType } from '@prisma/client'; // Importing Prisma client types
import { NETWORK_POINTS_PERCENTAGE } from '@/constants/pointsConstants'; // Importing points constants

/**
 * Centralized action for updating user points, history, and leaderboard.
 * This function also rewards the referrer of the user if applicable.
 *
 * @param userId - The unique identifier of the user.
 * @param points - The number of points to be added to the user's account.
 * @param source - The source of the points being awarded.
 * @param description - A description of the points transaction.
 * @param userType - The type of user (e.g., admin, regular user) for filtering leaderboard entries.
 * @returns An object containing updated userBeamPoints, leveledUp status, newLevel, and levelCaption.
 */
export const updateUserPointsAndLeaderboard = async (
  userId: string, 
  points: number, 
  source: PointsSource, 
  description: string, 
  userType: UserType
) => {
    // Step 1: Find or create the userBeamPoints record
    let userBeamPoints = await db.userBeamPoints.findUnique({
      where: { userId },
      include: { level: true }, // Include level information
    });

    // If userBeamPoints doesn't exist, create a new record
    if (!userBeamPoints) {
      const initialLevel = await db.level.findFirst({
        where: { levelNumber: 1 }, // Get the first level
      });
      userBeamPoints = await db.userBeamPoints.create({
        data: {
          userId,
          beams: points, // Set initial beams
          levelId: initialLevel!.id, // Assign initial level
        },
        include: { level: true }, // Include level information in the response
      });
    } else {
      // If it exists, update the existing record with new points
      userBeamPoints = await db.userBeamPoints.update({
        where: { userId },
        data: { beams: { increment: points } }, // Increment existing beams
        include: { level: true }, // Include level information
      });
    }

    // Step 2: Check for level-up
    let leveledUp = false; // Flag for level-up status
    let newLevel = userBeamPoints.level; // Current level
    let levelCaption = null; // Level caption

    // If beams exceed the maximum points for the current level, attempt to level up
    if (userBeamPoints.beams > userBeamPoints.level.maxPoints) {
      const nextLevel = await db.level.findFirst({
        where: { levelNumber: { gt: userBeamPoints.level.levelNumber } }, // Find next level
      });

      // If a next level exists, update the userBeamPoints with the new level
      if (nextLevel) {
        userBeamPoints = await db.userBeamPoints.update({
          where: { userId },
          data: { levelId: nextLevel.id }, // Update level ID
          include: { level: true }, // Include level information
        });
        leveledUp = true; // Set leveledUp flag to true
        newLevel = nextLevel; // Update newLevel to the next level
        levelCaption = nextLevel.caption; // Get the level caption
      }
    }

    // Step 3: Record points history for the user
    await recordPointsHistory(userId, points, source, description);

    // Step 4: Update leaderboard entry for the user
    await updateLeaderboardEntry2(userId, points, userType);

    // Fetch user information to check for referrer
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        referredById: true, // Select referrer ID
        email: true, // Select email for history recording
      },
    });

    console.log("Referrer exists status:", user?.referredById);

    // If the user has a referrer, reward them
    if (user?.referredById) {
      const referrer: User | null = await db.user.findUnique({
        where: { id: user.referredById },
      });

      console.log("Referrer found:", referrer);
      if (referrer) {
        // Calculate referrer points
        const referrerPoints = Math.floor(points * NETWORK_POINTS_PERCENTAGE);
        console.log(`[updateUserPointsAndLeaderboard] Referrer ID: ${referrer.id}, Adding Points: ${referrerPoints}`);

        // Update referrer's points
        const updatedReferrerBeamPoints  = await db.userBeamPoints.update({
          where: { userId: referrer.id },
          data: { beams: { increment: referrerPoints } }, // Increment referrer beams
          include: { level: true }, // Include level information
        });

        console.log(`[updateUserPointsAndLeaderboard] Referrer ID: ${referrer.id}, Updated Points: ${updatedReferrerBeamPoints.beams}`);

        // Check if referrer needs to level up
        if (updatedReferrerBeamPoints.beams > updatedReferrerBeamPoints.level.maxPoints) {
          const nextReferrerLevel = await db.level.findFirst({
            where: { levelNumber: { gt: updatedReferrerBeamPoints.level.levelNumber } }, // Find next referrer level
          });

          // If a next referrer level exists, update the referrer’s level
          if (nextReferrerLevel) {
            await db.userBeamPoints.update({
              where: { userId: referrer.id },
              data: { levelId: nextReferrerLevel.id }, // Update level ID
              include: { level: true }, // Include level information
            });
            console.log(`[updateUserPointsAndLeaderboard] Referrer ID: ${referrer.id}, Leveled Up to: ${nextReferrerLevel.levelNumber}`);
          }
        }

        // Record points history for the referrer
        await recordPointsHistory(
          referrer.id, 
          referrerPoints,
          "NETWORK_POINTS", 
          `Network points earned from activity of referred user: ${user.email}`
        );

        // Update leaderboard entry for the referrer
        await updateLeaderboardEntry2(referrer.id, referrerPoints, referrer.userType);
      }
    }

    // Return updated userBeamPoints and leveling information
    return {
      userBeamPoints,
      leveledUp,
      newLevel,
      levelCaption,
    };
};

/**
 * An alternative implementation of the updateUserPointsAndLeaderboard function 
 * without referrer point distribution.
 *
 * @param userId - The unique identifier of the user.
 * @param points - The number of points to be added to the user's account.
 * @param source - The source of the points being awarded.
 * @param description - A description of the points transaction.
 * @param userType - The type of user (e.g., admin, regular user) for filtering leaderboard entries.
 * @returns An object containing updated userBeamPoints, leveledUp status, newLevel, and levelCaption.
 */
export const updateUserPointsAndLeaderboard2 = async (
  userId: string, 
  points: number, 
  source: PointsSource, 
  description: string, 
  userType: UserType
) => {
    // Step 1: Find or create the userBeamPoints record
    let userBeamPoints = await db.userBeamPoints.findUnique({
      where: { userId },
      include: { level: true }, // Include level information
    });

    // If userBeamPoints doesn't exist, create a new record
    if (!userBeamPoints) {
      const initialLevel = await db.level.findFirst({
        where: { levelNumber: 1 }, // Get the first level
      });
      userBeamPoints = await db.userBeamPoints.create({
        data: {
          userId,
          beams: points, // Set initial beams
          levelId: initialLevel!.id, // Assign initial level
        },
        include: { level: true }, // Include level information in the response
      });
    } else {
      // If it exists, update the existing record with new points
      userBeamPoints = await db.userBeamPoints.update({
        where: { userId },
        data: { beams: { increment: points } }, // Increment existing beams
        include: { level: true }, // Include level information
      });
    }

    // Step 2: Check for level-up
    let leveledUp = false; // Flag for level-up status
    let newLevel = userBeamPoints.level; // Current level
    let levelCaption = null; // Level caption

    // If beams exceed the maximum points for the current level, attempt to level up
    if (userBeamPoints.beams > userBeamPoints.level.maxPoints) {
      const nextLevel = await db.level.findFirst({
        where: { levelNumber: { gt: userBeamPoints.level.levelNumber } }, // Find next level
      });

      // If a next level exists, update the userBeamPoints with the new level
      if (nextLevel) {
        userBeamPoints = await db.userBeamPoints.update({
          where: { userId },
          data: { levelId: nextLevel.id }, // Update level ID
          include: { level: true }, // Include level information
        });
        leveledUp = true; // Set leveledUp flag to true
        newLevel = nextLevel; // Update newLevel to the next level
        levelCaption = nextLevel.caption; // Get the level caption
      }
    }

    // Step 3: Record points history for the user
    await recordPointsHistory(userId, points, source, description);

    // Step 4: Update leaderboard entry for the user
    await updateLeaderboardEntry2(userId, points, userType);

    // Return updated userBeamPoints and leveling information
    return {
      userBeamPoints,
      leveledUp,
      newLevel,
      levelCaption,
    };
};
