'use server'; // Indicates that this module should be treated as a server-side module

import { db } from "@/libs/db"; // Importing the database instance
import { Achievement, UserAchievement } from "@prisma/client"; // Importing types for Achievement and UserAchievement

/**
 * Fetches all published achievements from the database.
 * 
 * @returns A promise that resolves to an array of published Achievement objects.
 * @throws Throws an error if there is a problem fetching the achievements.
 */
export const getAllAchievements = async (): Promise<Achievement[]> => {
  try {
    // Fetching achievements from the database, filtering for published ones and ordering by creation date
    const achievements = await db.achievement.findMany({
      where: {
        published: true // Only include achievements that are published
      },
      orderBy: {
        createdAt: "asc" // Order achievements by creation date in ascending order
      }
    });
    return achievements; // Return the fetched achievements
  } catch (error) {
    // Log the error and throw a new error for higher-level handling
    console.error("Error fetching all achievements:", error);
    throw new Error("Failed to fetch achievements");
  }
};

/**
 * Fetches achievements for a specific user by their ID.
 * 
 * @param userId - The ID of the user whose achievements are to be fetched.
 * @returns A promise that resolves to an array of UserAchievement objects for the specified user.
 * @throws Throws an error if there is a problem fetching the user's achievements.
 */
export const getUserAchievements = async (userId: string): Promise<UserAchievement[]> => {
  try {
    // Fetching user achievements from the database, filtering by user ID
    const userAchievements = await db.userAchievement.findMany({
      where: {
        userId: userId, // Filter by the provided user ID
      },
      include: {
        achievement: true, // Include related achievement details
      },
    });
    return userAchievements; // Return the fetched user achievements
  } catch (error) {
    // Log the error and throw a new error for higher-level handling
    console.error("Error fetching user achievements:", error);
    throw new Error("Failed to fetch user achievements");
  }
};

/**
 * Fetches completed achievements for a specific user.
 * 
 * @param userId - The ID of the user whose completed achievements are to be fetched.
 * @returns A promise that resolves to an array of UserAchievement objects that are completed.
 * @throws Throws an error if there is a problem fetching the completed achievements.
 */
export const getCompletedAchievements = async (userId: string): Promise<UserAchievement[]> => {
  try {
    // Fetching completed user achievements from the database, filtering by user ID and completion status
    const userAchievements = await db.userAchievement.findMany({
      where: {
        userId: userId, // Filter by the provided user ID
        completionStatus: true // Only include achievements that are marked as completed
      },
      include: {
        achievement: true, // Include related achievement details
      }
    });
    return userAchievements; // Return the fetched completed achievements
  } catch (error) {
    // Log the error and throw a new error for higher-level handling
    console.error("Error fetching user achievements:", error);
    throw new Error("Failed to fetch user achievements");
  }
};
