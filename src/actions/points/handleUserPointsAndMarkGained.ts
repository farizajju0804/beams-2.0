"use server";
import { db } from '@/libs/db';
import { updateUserPointsAndLeaderboard } from './updateUserPointsAndLeaderboard';
import { UserType } from '@prisma/client';

// This function calls the centralized action for updating points and updates hasGainedBeams
export const handleUserPointsAndMarkGained = async (
  userId: string,
  points: number,
  source: string,
  description: string,
  userType: UserType,
  achievementId: string
) => {
  // Step 1: Check if the user has already gained beams for this achievement
  const userAchievement = await db.userAchievement.findUnique({
    where: {
      userId_achievementId: {
        userId: userId,
        achievementId: achievementId,
      },
    },
  });

  // If beams have already been gained, return early
  if (userAchievement?.hasGainedBeams) {
    return {
      hasGainedBeams: true,
      userBeamPoints: null,
      leveledUp: false,
      newLevel: null,
      levelCaption: null,
    };
  }

  // Step 2: Update hasGainedBeams to true
  const updated = await db.userAchievement.update({
    where: {
      userId_achievementId: {
        userId: userId,
        achievementId: achievementId,
      },
    },
    data: {
      hasGainedBeams: true,
    },
    include: {
      achievement: true,
    },
  });

  // Step 3: Update user points, leaderboard, and handle level-up if applicable
  const { userBeamPoints, leveledUp, newLevel, levelCaption } = await updateUserPointsAndLeaderboard(
    userId,
    points,
    source,
    description,
    userType
  );

  // Step 4: Return the updated data along with hasGainedBeams status
  return {
    hasGainedBeams: true,
    userBeamPoints,
    leveledUp,
    newLevel,
    levelCaption,
  };
};




export const getHasGainedBeamsStatus = async (userId: string, achievementId: string) => {
  const userAchievement = await db.userAchievement.findUnique({
    where: {
      userId_achievementId: {
        userId: userId,
        achievementId: achievementId,
      },
    },
    select: {
      hasGainedBeams: true,
    },
  });

  return userAchievement?.hasGainedBeams || false;
};