"use server"
import { db } from '@/libs/db';

export const updateUserPoints = async (userId: string, points: number) => {
    let userBeamPoints: any = await db.userBeamPoints.findUnique({
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
  
    let leveledUp = false;
    let newLevel;
    if (userBeamPoints.beams >= userBeamPoints.level.maxPoints) {
      newLevel = await db.level.findFirst({
        where: { levelNumber: { gt: userBeamPoints.level.levelNumber } },
      });
      if (newLevel) {
        userBeamPoints = await db.userBeamPoints.update({
          where: { userId },
          data: { levelId: newLevel.id },
          include: { level: true },
        });
        leveledUp = true;
      }
    }
  
    return { userBeamPoints, leveledUp, newLevel: userBeamPoints.level };
  };
  