"use server"; // Indicates that this code runs on the server side.

import { currentUser } from "@/libs/auth"; // Importing the current user authentication method.
import { db } from "@/libs/db"; // Import the Prisma database instance.
import { date } from "zod"; // Importing date validation from the Zod library.
import { generateNotification } from "../notifications/notifications"; // Importing the notification generation function.
import { Prisma } from "@prisma/client"; // Importing Prisma types.
import { streakBadge } from "@/constants/victoryConstants"; // Importing constant for streak achievements.
import { Category } from "iconsax-react";

/**
 * Marks the fact as completed for a given user.
 * 
 * @param userId - The ID of the user who completed the fact.
 * @param factId - The ID of the fact the user completed.
 * @param clientDate - The date from the client for tracking completion.
 * @returns A confirmation message or throws an error.
 */
export const markFactAsCompleted = async (userId: string, factId: string, clientDate: string) => {
  try {
    // Log the initiation of the fact completion process
    console.log(`[markFactAsCompleted] Starting process for userId: ${userId}, factId: ${factId}, clientDate: ${clientDate}`);

    // Check if the user has already completed the fact
    const existingCompletion = await db.factCompletion.findUnique({
      where: {
        factId_userId: { // Unique composite key for fact completion
          factId,
          userId,
        },
      },
    });

    if (!existingCompletion) {
      // If no completion record exists, create a new entry
      console.log(`[markFactAsCompleted] No existing completion found. Creating new completion entry for userId: ${userId}, factId: ${factId}`);

      await db.factCompletion.create({
        data: {
          factId,
          userId,
          completed: true, // Mark as completed
          completedAt: new Date(), // Set completion date to now
        },
      });
      console.log(`[markFactAsCompleted] New fact completion entry created for userId: ${userId}, factId: ${factId}`);
    } else {
      // If a completion record exists, update it
      console.log(`[markFactAsCompleted] Existing completion found. Updating entry for userId: ${userId}, factId: ${factId}`);

      await db.factCompletion.update({
        where: {
          factId_userId: {
            factId,
            userId,
          },
        },
        data: {
          completed: true, // Ensure it's marked as completed
          completedAt: new Date(), // Update the completion date to now
        },
      });
      console.log(`[markFactAsCompleted] Existing fact completion entry updated for userId: ${userId}, factId: ${factId}`);
    }

    // Log the successful marking of the fact as completed
    console.log(`[markFactAsCompleted] Fact marked as completed for userId: ${userId}, factId: ${factId}`);
    
    // Update achievement progress for the user based on the completion
    const { streakDay } = await updateAchievementProgress(userId, streakBadge, clientDate);

    console.log(`[markFactAsCompleted] Achievement progress updated for userId: ${userId} for achievement`);

    return { streakDay }; // Return the current streak day as a response
  } catch (error) {
    // Handle and log any errors that occur
    console.error(`[markFactAsCompleted] Error marking fact as completed for userId: ${userId}, factId: ${factId}:`, error);
    throw new Error(`Error marking fact as completed: ${(error as Error).message}`);
  }
};




export const markFactAsCompleted2 = async (userId: string, factId: string) => {
  try {
    // Check if the user has already completed the fact
    const existingCompletion = await db.factCompletion.findUnique({
      where: {
        factId_userId: {
          factId,
          userId,
        },
      },
    });

    if (!existingCompletion) {
      // Create new completion record if none exists
      await db.factCompletion.create({
        data: {
          factId,
          userId,
          completed: true,
          completedAt: new Date(),
        },
      });
    } else {
      // Update existing completion record
      await db.factCompletion.update({
        where: {
          factId_userId: {
            factId,
            userId,
          },
        },
        data: {
          completed: true,
          completedAt: new Date(),
        },
      });
    }

    return true;
  } catch (error) {
    console.error(`Error marking fact as completed:`, error);
    return false;
  }
};
/**
 * Updates the achievement progress for a user based on completion.
 * 
 * @param userId - The ID of the user whose achievement progress is updated.
 * @param achievementName - The name of the achievement to update.
 * @param clientDate - The date from the client for tracking.
 * @returns An object containing the streak day count.
 */
async function updateAchievementProgress(userId: string, achievementName: string, clientDate: string): Promise<{ streakDay: number }> {
  const user: any = await currentUser(); // Fetch the current user
  const username = user?.firstName || "User"; // Get the user's first name or default to "User"

  try {
    // Log the initiation of the achievement progress update
    console.log(`[updateAchievementProgress] Starting process for userId: ${userId}, achievementName: ${achievementName}, clientDate: ${clientDate}`);

    // Find the achievement by its name in the database
    const achievement = await db.achievement.findUnique({
      where: { name: achievementName },
    });

    if (!achievement) {
      // If the achievement does not exist, throw an error
      console.error(`[updateAchievementProgress] Achievement '${achievementName}' not found`);
      throw new Error(`Achievement '${achievementName}' not found`);
    }

    console.log(`[updateAchievementProgress] Found achievement '${achievementName}' with ID: ${achievement.id}`);

    // Parse the client date and set time to midnight for date comparison
    const today = new Date(clientDate);
    today.setUTCHours(0, 0, 0, 0); 

    console.log(`[updateAchievementProgress] Today's date set to ${today.toISOString()}`);

    // Check if the user already has progress for this achievement
    let userAchievement = await db.userAchievement.findUnique({
      where: { userId_achievementId: { userId, achievementId: achievement.id } },
    });

    // If the achievement is already completed, return early
    if (userAchievement && userAchievement.completionStatus) {
      console.log(`[updateAchievementProgress] Achievement already completed for userId: ${userId}`);
      return { streakDay: userAchievement.progress }; // Return the current progress
    }

    let newProgress = 1; // Initialize new progress
    let message: string | null = null; // Message to store any notifications
    let isReset = false; // Flag to indicate if progress is reset

    if (!userAchievement) {
      // If no existing achievement progress, create a new entry
      console.log(`[updateAchievementProgress] No existing achievement progress found. Creating new entry for userId: ${userId}, achievementId: ${achievement.id}`);

      userAchievement = await db.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id,
          progress: newProgress, // Set initial progress
          updatedAt: today, // Set update date
          completionStatus: false, // Initially not completed
        },
      });

      console.log(`[updateAchievementProgress] New achievement progress created for userId: ${userId}, achievementId: ${achievement.id}`);
    } else {
      // If existing achievement progress found, check last updated date
      console.log(`[updateAchievementProgress] Existing achievement progress found for userId: ${userId}, achievementId: ${achievement.id}`);

      const lastUpdated = new Date(userAchievement.updatedAt);
      lastUpdated.setUTCHours(0, 0, 0, 0); // Reset hours for comparison

      // Calculate the difference in days between today and the last update
      const dayDifference = Math.floor((today.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24));

      if (dayDifference === 1) {
        // If last update was yesterday, increment progress
        console.log(`[updateAchievementProgress] Last updated yesterday. Incrementing progress for userId: ${userId}`);
        newProgress = userAchievement.progress + 1;
      } else if (dayDifference > 1) {
        // If last update was more than a day ago, reset progress
        console.log(`[updateAchievementProgress] Last updated more than 1 day ago. Resetting progress for userId: ${userId}`);
        newProgress = 1; // Reset progress to 1
        isReset = true; // Indicate a reset occurred
      } else {
        // If already updated today, keep the current progress
        console.log(`[updateAchievementProgress] Progress already updated for today for userId: ${userId}`);
        newProgress = userAchievement.progress;
      }

      // Check if new progress meets or exceeds total achievement count
      const isNowCompleted = newProgress >= achievement.totalCount;

      // Update the achievement progress in the database
      userAchievement = await db.userAchievement.update({
        where: { id: userAchievement.id },
        data: {
          progress: newProgress, // Update the progress count
          completionStatus: isNowCompleted, // Update completion status
          updatedAt: today, // Update date
        },
      });

      console.log(`[updateAchievementProgress] Achievement progress updated for userId: ${userId}, new progress: ${newProgress}, completed: ${isNowCompleted}`);

      // If achievement is now completed, generate a notification for the user
      if (isNowCompleted) {
        await generateNotification(
          userId,
          'ACHIEVEMENT',
          `Congratulations ${username}! You've unlocked the ${achievementName} badge!`, // Notification message
          `/achievements#${achievement.id}` // Link to the achievement
        );
      }
    }

    return { streakDay: newProgress }; // Return the current streak day count
  } catch (error) {
    // Handle and log any errors that occur
    console.error(`[updateAchievementProgress] Error updating achievement progress for userId: ${userId}, achievementName: ${achievementName}:`, error);
    throw new Error(`Error updating achievement progress: ${(error as Error).message}`);
  }
}






type SortOption = "dateDesc" | "dateAsc" | "nameAsc" | "nameDesc";
type FilterOption = "all" | "beamed" | "unbeamed";

interface GetTrendingFactsParams {
  clientDate: string;
  page?: number;
  limit?: number;
  sortBy?: SortOption;
  filterOption?: FilterOption;
  userId?: string; // To check completed facts
}

interface PaginatedResponse {
  facts: any[];
  totalPages: number;
  currentPage: number;
}



/**
 * Fetches the fact of the day and the completion status for a specific user.
 * 
 * @param userId - The ID of the user for whom to fetch the fact and completion status.
 * @param clientDate - The date from the client to find the corresponding fact.
 * @returns An object containing the fact details and the completion status for the user.
 * @throws Will throw an error if there is an issue fetching the fact and completion status.
 */
export const getFactAndCompletionStatus = async (userId: string, clientDate: string) => {
  try {
    console.log(`[getFactAndCompletionStatus] Fetching fact and completion status for userId: ${userId}, clientDate: ${clientDate}`);

    const factWithCompletion = await db.factOfTheday.findFirst({
      where: {
        date: new Date(clientDate),
        published : true
      },
      include: {
        category : true,
        completions: {
          where: { userId },
        },
      },
    });

    if (!factWithCompletion) {
      return { fact: null, completed: false };
    }

    const isCompleted = factWithCompletion.completions.length > 0
      ? factWithCompletion.completions[0].completed
      : false;

      return {
        id: factWithCompletion.id,
        date: factWithCompletion.date,
        title: factWithCompletion.title,
        finalImage: factWithCompletion.finalImage,
        thumbnail: factWithCompletion.thumbnail,
        referenceLink1: factWithCompletion.referenceLink1 || undefined,
        referenceLink2: factWithCompletion.referenceLink2 || undefined,
        hashtags: factWithCompletion.hashtags,
        category: {
          name: factWithCompletion.category.name,
          color: factWithCompletion.category.color
        },
        completed: isCompleted
      };
  } catch (error) {
    console.error(`[getFactAndCompletionStatus] Error fetching fact and completion status for userId: ${userId}, clientDate: ${clientDate}:`, error);
    throw new Error(`Error fetching fact and completion status: ${(error as Error).message}`);
  }
};

/**
 * Fetches trending facts with optional filtering and sorting.
 * 
 * @param clientDate - The date for which to fetch trending facts.
 * @param page - The page number for pagination (default is 1).
 * @param limit - The number of facts to return per page (default is 9).
 * @param sortBy - The sorting option (default is "dateDesc").
 * @param filterOption - The filter option for completed or uncompleted facts (default is "all").
 * @param userId - The ID of the user to check for completed facts.
 * @returns An object containing the list of trending facts, total pages, and current page.
 * @throws Will throw an error if there is an issue fetching trending facts.
 */
export const getTrendingFacts = async ({
  clientDate,
  page = 1,
  limit = 9,
  sortBy = "dateDesc",
  filterOption = "all",
  userId
}: GetTrendingFactsParams): Promise<PaginatedResponse> => {
  const today = new Date(clientDate);
  today.setUTCHours(0, 0, 0, 0);

  try {
    const skip = (page - 1) * limit;

    const orderBy: Prisma.FactOfThedayOrderByWithRelationInput = (() => {
      switch (sortBy) {
        case "nameAsc":
          return { title: Prisma.SortOrder.asc };
        case "nameDesc":
          return { title: Prisma.SortOrder.desc };
        case "dateAsc":
          return { date: Prisma.SortOrder.asc };
        case "dateDesc":
        default:
          return { date: Prisma.SortOrder.desc };
      }
    })();

    let whereClause: Prisma.FactOfThedayWhereInput = {
      date: {
        lt: today,
      },
      published : true
    };

    if (filterOption !== "all" && userId) {
      const completedFactsCondition = {
        completions: {
          some: {
            userId: userId,
            completed: true
          }
        }
      };

      if (filterOption === "beamed") {
        whereClause = { ...whereClause, ...completedFactsCondition };
      } else if (filterOption === "unbeamed") {
        whereClause = { ...whereClause, NOT: completedFactsCondition };
      }
    }

    const totalCount = await db.factOfTheday.count({
      where: whereClause,
    });

    const trendingFacts = await db.factOfTheday.findMany({
      where: whereClause,
      orderBy,
      skip,
      take: limit,
      include : {
        category : true,
        completions: {
          where: {
            userId: userId,
            completed: true
          },
          select: {
            id: true
          }
        }
      }
    });

    const transformedFacts = trendingFacts.map(fact => ({
      id: fact.id,
      finalImage: fact.finalImage,
      title: fact.title,
      date: fact.date,
      thumbnail : fact.thumbnail,
      hashtags : fact.hashtags,
      referenceLink1 :  fact.referenceLink1,
      referenceLink2 : fact.referenceLink2,
      category : {
        name : fact.category.name,
        color : fact.category.color
      },
      isCompleted: fact.completions.length > 0
    }));

    return {
      facts: transformedFacts,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  } catch (error) {
    throw new Error(`Error fetching trending facts: ${(error as Error).message}`);
  }
};

/**
 * Fetches the completed facts for a specific user.
 * 
 * @param userId - The ID of the user whose completed facts are being fetched.
 * @returns An array of completed fact IDs.
 * @throws Will throw an error if the user is not authenticated or if there is an issue fetching completed facts.
 */
export const getCompletedFacts = async (userId: string) => {
  if (!userId) {
    throw new Error("User not authenticated");
  }

  try {
    const completedFacts = await db.factCompletion.findMany({
      where: {
        userId: userId,
        completed: true,
      },
      select: {
        factId: true,
      },
    });

    return completedFacts.map((completion) => completion.factId);
  } catch (error) {
    console.error("Error fetching completed facts:", error);
    throw new Error("Failed to fetch completed facts");
  }
};
