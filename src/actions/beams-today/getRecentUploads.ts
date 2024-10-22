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

export const getRecentUploads = async ({
  clientDate,
  page = 1,
  limit = 9,
  sortBy = "dateDesc"
}: GetRecentUploadsParams): Promise<PaginatedResponse> => {
  const today = new Date(clientDate);
  today.setUTCHours(0, 0, 0, 0);

  try {
    const topicOfTheDay = await getTopicOfTheDay(clientDate);

    // Calculate the number of items to skip
    const skip = (page - 1) * limit;

    // Define the sorting configuration based on sortBy
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

    // Get total count for pagination
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

    // Fetch paginated and sorted data
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
      // select: {
      //   id: true,
      //   thumbnailUrl: true,
      //   title: true,
      //   date: true,
      //   category: true,
      //   shortDesc: true,
      // },
      include: {
        category : true
      }
    });

    return {
      uploads: recentVideos,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  } catch (error) {
    throw new Error(`Error fetching recent uploads: ${(error as Error).message}`);
  }
};