'use server'
import { db } from "@/libs/db";
import { Achievement, UserAchievement } from "@prisma/client";

export const getAllAchievements = async (): Promise<Achievement[]> => {
  try {
    const achievements = await db.achievement.findMany();
    return achievements;
  } catch (error) {
    console.error("Error fetching all achievements:", error);
    throw new Error("Failed to fetch achievements");
  }
};

export const getUserAchievements = async (userId: string): Promise<UserAchievement[]> => {
  try {
    const userAchievements = await db.userAchievement.findMany({
      where: {
        userId: userId,
      },
      include: {
        achievement: true,
      },
    });
    return userAchievements;
  } catch (error) {
    console.error("Error fetching user achievements:", error);
    throw new Error("Failed to fetch user achievements");
  }
};