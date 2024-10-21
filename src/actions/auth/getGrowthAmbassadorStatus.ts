"use server";

import { db } from "@/libs/db";

export async function getGrowthAmbassadorStatus(referrerId: string) {
  try {
   
    // Find the Week Warrior achievement
    const weekWarriorAchievement = await db.achievement.findUnique({
      where: { name: "Growth Ambassador" },
    });

    if (!weekWarriorAchievement) {
    //   console.error("[getWeekWarriorStatus] Week Warrior achievement not found");
      throw new Error("Growth Ambassador achievement not found");
    }

    // Find the user's progress for the Week Warrior achievement
    const userAchievement = await db.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId: referrerId,
          achievementId: weekWarriorAchievement.id,
        },
      },
    });

    if (!userAchievement) {
      console.log(`[getGrowthAmbassadorStatus] No progress found for referrerId: ${referrerId}`);
      return {
        completed: false,
      };
    }

    console.log(`[getGrowthAmbassadorStatus] Status retrieved for referrerId: ${referrerId}`);
    return {
      completed: userAchievement.completionStatus
    };

  } catch (error) {
    console.error(`[getGrowthAmbassadorStatus] Error fetching Week Warrior status for referrerId: ${referrerId}:`, error);
    throw new Error(`Error fetching Week Warrior status: ${(error as Error).message}`);
  }
}