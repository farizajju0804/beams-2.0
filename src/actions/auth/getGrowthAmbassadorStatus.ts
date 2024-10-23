"use server";

import { referalBadgeName } from "@/constants/victoryConstants";
import { db } from "@/libs/db";

export async function getGrowthAmbassadorStatus(referrerId: string) {
  try {
   
   
    const weekWarriorAchievement = await db.achievement.findUnique({
      where: { name: referalBadgeName},
    });

    if (!weekWarriorAchievement) {
 
      throw new Error(`${referalBadgeName} achievement not found`);
    }


    const userAchievement = await db.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId: referrerId,
          achievementId: weekWarriorAchievement.id,
        },
      },
    });

    if (!userAchievement) {
      console.log(`[ No progress found for referrerId: ${referrerId}`);
      return {
        completed: false,
      };
    }

    console.log(`Status retrieved for referrerId: ${referrerId}`);
    return {
      completed: userAchievement.completionStatus
    };

  } catch (error) {
    console.error(` Error fetching  status for referrerId: ${referrerId}:`, error);
    throw new Error(`Error fetching  status: ${(error as Error).message}`);
  }
}