// app/actions/beams-today/search.ts
'use server';

import { db } from '@/libs/db';
import { Prisma } from '@prisma/client';

interface SearchParams {
  query?: string;
  page: number;
  selectedDate?: string;
  sortBy: string;
  categories?: string[];
  beamedStatus?: 'beamed' | 'unbeamed' | undefined; // Fixed type
  userId?: string;
}


// }

/**
 * Searches for topics based on provided filters, pagination, and sorting options.
 *
 * @param {SearchParams} params - The parameters for the search.
 * @returns {Promise<SearchResult>} A promise that resolves to the search result, including topics and pagination data.
 * @throws {Error} Throws an error if the search operation fails.
 */
// app/actions/beams-today/search.ts
interface SearchParams {
  query?: string;
  page: number;
  selectedDate?: string;
  sortBy: string;
  categories?: string[];
  beamedStatus?: 'beamed' | 'unbeamed' | undefined;
  userId?: string;
}

interface SearchResult {
  topics: TransformedBeamsToday[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

// Interface for MongoDB BSON types
interface MongoDBDocument {
  _id: { $oid: string };
  date: { $date: string };
  title: string;
  shortDesc: string;
  viewCount: number;
  completionCount: number;
  totalWatchTime: number;
  videoViewCount: number;
  audioViewCount: number;
  textViewCount: number;
  totalVideoWatchTime: number;
  totalAudioListenTime: number;
  totalTextSpentTime: number;
  videoUrl?: string;
  script?: string;
  thumbnailUrl?: string;
  articleUrl?: string;
  audioUrl?: string;
  published: boolean;
  categoryId: { $oid: string };
  category: {
    _id: { $oid: string };
    name: string;
    // Add other category fields as needed
  };
  [key: string]: any;
}

// Interface for transformed document matching Prisma types
export interface TransformedBeamsToday {
  id: string;
  date: Date;
  title: string;
  shortDesc: string;
  viewCount: number;
  completionCount: number;
  totalWatchTime: number;
  videoViewCount: number;
  audioViewCount: number;
  textViewCount: number;
  totalVideoWatchTime: number;
  totalAudioListenTime: number;
  totalTextSpentTime: number;
  videoUrl?: string | null;
  script?: string | null;
  thumbnailUrl?: string | null;
  articleUrl?: string | null;
  audioUrl?: string | null;
  published: boolean;
  categoryId: string;
  category: {
    id: string;
    name: string;
    // Add other category fields as needed
  };
}

function transformMongoDocument(doc: MongoDBDocument): TransformedBeamsToday {
  return {
    id: doc._id.$oid,
    date: new Date(doc.date.$date),
    title: doc.title,
    shortDesc: doc.shortDesc,
    viewCount: doc.viewCount,
    completionCount: doc.completionCount,
    totalWatchTime: doc.totalWatchTime,
    videoViewCount: doc.videoViewCount,
    audioViewCount: doc.audioViewCount,
    textViewCount: doc.textViewCount,
    totalVideoWatchTime: doc.totalVideoWatchTime,
    totalAudioListenTime: doc.totalAudioListenTime,
    totalTextSpentTime: doc.totalTextSpentTime,
    videoUrl: doc.videoUrl || null,
    script: doc.script || null,
    thumbnailUrl: doc.thumbnailUrl || null,
    articleUrl: doc.articleUrl || null,
    audioUrl: doc.audioUrl || null,
    published: doc.published,
    categoryId: doc.categoryId.$oid,
    category: {
      id: doc.category._id.$oid,
      name: doc.category.name,
    }
  };
}

export async function searchTopics({
  query,
  page,
  selectedDate,
  sortBy,
  categories,
  beamedStatus,
  userId
}: SearchParams): Promise<SearchResult> {
  const itemsPerPage = 9; // Constant page size

  try {
    if (query) {
      const pipeline = [
        {
          $search: {
            index: "searchIndex",
            text: {
              query: query,
              path: ["title","shortDesc"],
              fuzzy: {
          maxEdits: 2,
          prefixLength: 0,
          maxExpansions: 50
        }
            }
          }
        },
        {
          $match: {
            published: true,
            ...(selectedDate && {
              date: {
                $gte: new Date(`${selectedDate}T00:00:00.000Z`),
                $lt: new Date(`${selectedDate}T23:59:59.999Z`)
              }
            }),
            ...(categories?.length && {
              categoryId: {
                $in: categories.map(id => ({ $oid: id }))
              }
            })
          }
        },
        {
          $lookup: {
            from: "BeamsTodayCategory",
            localField: "categoryId",
            foreignField: "_id",
            as: "category"
          }
        },
        {
          $unwind: "$category"
        },
        {
          $sort: getSortOrder(sortBy, true)
        }
      ];

      // Get all results first
      const allResults: any = await db.$runCommandRaw({
        aggregate: "BeamsToday",
        pipeline: pipeline,
        cursor: {}
      });

      let allTopics = (allResults.cursor?.firstBatch || []).map((doc: MongoDBDocument) => 
        transformMongoDocument(doc)
      );

      if (beamedStatus && userId) {
        const watchedContent = await db.beamsTodayWatchedContent.findUnique({
          where: { userId },
          select: { completedBeamsToday: true },
        });

        const completedIds = watchedContent?.completedBeamsToday || [];
        allTopics = beamedStatus === 'beamed'
          ? allTopics.filter((topic:any) => completedIds.includes(topic.id))
          : allTopics.filter((topic:any) => !completedIds.includes(topic.id));
      }

      const totalItems = allTopics.length;
      const startIndex = (page - 1) * itemsPerPage;
      const topics = allTopics.slice(startIndex, startIndex + itemsPerPage);

      return {
        topics,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalItems / itemsPerPage),
          totalItems,
        },
      };
    }

    // Non-search query logic
    const whereClause: any = {
      published: true,
    };

    if (selectedDate) {
      whereClause.date = {
        gte: new Date(`${selectedDate}T00:00:00.000Z`),
        lt: new Date(`${selectedDate}T23:59:59.999Z`),
      };
    }

    if (categories?.length) {
      whereClause.categoryId = {
        in: categories,
      };
    }

    // Get all results for consistent pagination
    const allTopics = await db.beamsToday.findMany({
      where: whereClause,
      orderBy: getSortOrder(sortBy),
      include: {
        category: true,
      },
    });

    let filteredTopics = allTopics;
    if (beamedStatus && userId) {
      const watchedContent = await db.beamsTodayWatchedContent.findUnique({
        where: { userId },
        select: { completedBeamsToday: true },
      });

      const completedIds = watchedContent?.completedBeamsToday || [];
      filteredTopics = beamedStatus === 'beamed'
        ? allTopics.filter(topic => completedIds.includes(topic.id))
        : allTopics.filter(topic => !completedIds.includes(topic.id));
    }

    const totalItems = filteredTopics.length;
    const startIndex = (page - 1) * itemsPerPage;
    const topics = filteredTopics.slice(startIndex, startIndex + itemsPerPage);

    return {
      topics,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / itemsPerPage),
        totalItems,
      },
    };

  } catch (error) {
    console.error('Search error:', error);
    throw new Error('Failed to search topics');
  }
}


function getSortOrder(sortBy: string, isMongoDb: boolean = false): any {
  const { asc, desc } = Prisma.SortOrder;

  if (isMongoDb) {
    // MongoDB sort format
    switch (sortBy) {
      case 'nameAsc':
        return { title: 1 };
      case 'nameDesc':
        return { title: -1 };
      case 'dateAsc':
        return { date: 1 };
      case 'dateDesc':
      default:
        return { date: -1 };
    }
  }

  // Prisma sort format
  switch (sortBy) {
    case 'nameAsc':
      return { title: asc };
    case 'nameDesc':
      return { title: desc };
    case 'dateAsc':
      return { date: asc };
    case 'dateDesc':
    default:
      return { date: desc };
  }
}