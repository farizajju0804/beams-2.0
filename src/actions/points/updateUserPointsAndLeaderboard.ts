"use server";
import { db } from '@/libs/db';
import { updateLeaderboardEntry } from './updateLeaderboardEntry';
import { recordPointsHistory } from './recordPointsHistory';
import { UserType } from '@prisma/client';

// Centralized action for updating user points, history, and leaderboard
export const updateUserPointsAndLeaderboard = async (
  userId: string, 
  points: number, 
  source: string, 
  description: string, 
  userType: UserType
) => {
    // Step 1: Find or create the userBeamPoints record
    let userBeamPoints = await db.userBeamPoints.findUnique({
      where: { userId },
      include: { level: true },
    });

    if (!userBeamPoints) {
      const initialLevel = await db.level.findFirst({
        where: { levelNumber: 1 },
      });
      userBeamPoints = await db.userBeamPoints.create({
        data: {
          userId,
          beams: points,
          levelId: initialLevel!.id,
        },
        include: { level: true },
      });
    } else {
      userBeamPoints = await db.userBeamPoints.update({
        where: { userId },
        data: { beams: { increment: points } },
        include: { level: true },
      });
    }

    // Step 2: Check for level-up
    let leveledUp = false;
    let newLevel = userBeamPoints.level;
    let levelCaption = null;
    
    if (userBeamPoints.beams > userBeamPoints.level.maxPoints) {
      const nextLevel = await db.level.findFirst({
        where: { levelNumber: { gt: userBeamPoints.level.levelNumber } },
      });

      if (nextLevel) {
        userBeamPoints = await db.userBeamPoints.update({
          where: { userId },
          data: { levelId: nextLevel.id },
          include: { level: true },
        });
        leveledUp = true;
        newLevel = nextLevel;
        levelCaption = nextLevel.caption;
      }
    }

    // Step 3: Record points history
    await recordPointsHistory(userId, points, source, description);

    // Step 4: Update leaderboard entry
    await updateLeaderboardEntry(userId, points, userType);

    // Step 5: Return user points and level-up details
    return {
      userBeamPoints,
      leveledUp,
      newLevel,
      levelCaption,
    };
};
