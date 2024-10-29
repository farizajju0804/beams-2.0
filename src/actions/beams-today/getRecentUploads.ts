'use server';
import { db } from "@/libs/db";
import { getTopicOfTheDay } from "./getTopicOfTheDay";
import { Prisma } from '@prisma/client';

type SortOption = "dateDesc" | "dateAsc" | "nameAsc" | "nameDesc";

interface GetRecentUploadsParams {
  clientDate: string;
  page?: number;
  limit?: number;
  sortBy?: SortOption;
}

interface PaginatedResponse {
  uploads: any[];
  totalPages: number;
  currentPage: number;
}
/**
 * Fetch recent uploads based on the provided parameters.
 *
 * @param {GetRecentUploadsParams} params - The parameters for fetching uploads.
 * @returns {Promise<PaginatedResponse>} The paginated response containing uploads and pagination info.
 * @throws {Error} Throws an error if fetching uploads fails.
 */
export const getRecentUploads = async ({
  clientDate,
  page = 1,
  limit = 9,
  sortBy = "dateDesc"
}: GetRecentUploadsParams): Promise<PaginatedResponse> => {
  // Normalize the client date to the start of the day in UTC
  const today = new Date(clientDate);
  today.setUTCHours(0, 0, 0, 0);

  try {
    // Get the topic of the day based on the client date
    const topicOfTheDay = await getTopicOfTheDay(clientDate);

    // Calculate how many items to skip for pagination
    const skip = (page - 1) * limit;

    // Determine the order by configuration based on the sortBy parameter
    const orderBy: Prisma.BeamsTodayOrderByWithRelationInput = (() => {
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

    // Count the total number of records for pagination
    const totalCount = await db.beamsToday.count({
      where: {
        AND: [
          {
            date: {
              lt: today,
            },
          },
          {
            id: {
              not: topicOfTheDay?.id,
            },
          },
          {
            published: true,
          },
        ],
      },
    });

    // Fetch the paginated and sorted recent uploads
    const recentVideos = await db.beamsToday.findMany({
      where: {
        AND: [
          {
            date: {
              lt: today,
            },
          },
          {
            id: {
              not: topicOfTheDay?.id,
            },
          },
          {
            published: true,
          },
        ],
      },
      orderBy,
      skip,
      take: limit,
      include: {
        category: true // Include category information in the result
      }
    });

    // Return the uploads along with pagination info
    return {
      uploads: recentVideos,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  } catch (error) {
    throw new Error(`Error fetching recent uploads: ${(error as Error).message}`);
  }
};