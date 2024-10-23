"use server";
import { db } from '@/libs/db';
import { updateLeaderboardEntry } from './updateLeaderboardEntry';
import { recordPointsHistory } from './recordPointsHistory';
import { PointsSource, User, UserType } from '@prisma/client';
import { NETWORK_POINTS_PERCENTAGE } from '@/constants/pointsConstants';

// Centralized action for updating user points, history, and leaderboard
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

   

    const user = await db.user.findUnique({
      where : {
        id : userId
      },
      select : {
        referredById : true,
        email : true
      }
    })

    console.log("referrer exists status" ,user?.referredById )

    if (user?.referredById) {
      const referrer: User | null = await db.user.findUnique({
        where: { id: user.referredById },
      });
     
      console.log("referrer found" ,referrer )
      if (referrer) {
        const referrerPoints = Math.floor(points * NETWORK_POINTS_PERCENTAGE);
        console.log(`[updateUserPointsAndLeaderboard] Referrer ID: ${referrer.id},  Adding Points: ${referrerPoints}`);
        // Update referrer's points and record network points history
        const updatedReferrerBeamPoints  = await db.userBeamPoints.update({
          where: { userId: referrer.id },
          data: { beams: { increment: referrerPoints } },
          include: { level: true },
        });
  
        console.log(`[updateUserPointsAndLeaderboard] Referrer ID: ${referrer.id}, Updated Points: ${updatedReferrerBeamPoints.beams}`);
   
      if (updatedReferrerBeamPoints.beams > updatedReferrerBeamPoints.level.maxPoints) {
        const nextReferrerLevel = await db.level.findFirst({
          where: { levelNumber: { gt: updatedReferrerBeamPoints.level.levelNumber } },
        });

        if (nextReferrerLevel) {
          await db.userBeamPoints.update({
            where: { userId: referrer.id },
            data: { levelId: nextReferrerLevel.id },
            include: { level: true },
          });
          console.log(`[updateUserPointsAndLeaderboard] Referrer ID: ${referrer.id}, Leveled Up to: ${nextReferrerLevel.levelNumber}`);
        }
      }
        await recordPointsHistory(
          referrer.id, 
          referrerPoints,
          "NETWORK_POINTS", 
          `Network points earned from activity of referred user: ${user.email}`
        );
  
        // Update leaderboard entry for the referrer
        await updateLeaderboardEntry(referrer.id, referrerPoints, referrer.userType);
      }
    }
    return {
      userBeamPoints,
      leveledUp,
      newLevel,
      levelCaption,
    };
};



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

  
    return {
      userBeamPoints,
      leveledUp,
      newLevel,
      levelCaption,
    };
};
