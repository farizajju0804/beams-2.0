// app/actions/beams-today/search.ts
'use server';

import { db } from '@/libs/db';

interface SearchParams {
  query?: string;
  page: number;
  selectedDate?: string;
  sortBy: string;
  categories?: string[];
  beamedStatus?: 'beamed' | 'unbeamed' | undefined; // Fixed type
  userId?: string;
}

interface SearchResult {
  topics: any[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

/**
 * Searches for topics based on provided filters, pagination, and sorting options.
 *
 * @param {SearchParams} params - The parameters for the search.
 * @returns {Promise<SearchResult>} A promise that resolves to the search result, including topics and pagination data.
 * @throws {Error} Throws an error if the search operation fails.
 */
export async function searchTopics({
  query,
  page,
  selectedDate,
  sortBy,
  categories,
  beamedStatus,
  userId
}: SearchParams): Promise<SearchResult> {
  const itemsPerPage = 9;

  try {
    // Base query conditions for fetching topics
    let whereClause: any = {
      published: true,
    };

    // Search query to filter by title, short description, or script
    if (query) {
      whereClause.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { shortDesc: { contains: query, mode: 'insensitive' } },
        { script: { contains: query, mode: 'insensitive' } },
      ];
    }

    // Date filter to get topics published on the selected date
    if (selectedDate) {
      whereClause.date = {
        gte: new Date(`${selectedDate}T00:00:00.000Z`),
        lt: new Date(`${selectedDate}T23:59:59.999Z`),
      };
    }

    // Category filter to include topics in specified categories
    if (categories && categories.length > 0) {
      whereClause.categoryId = {
        in: categories,
      };
    }

    // Beamed status filter to show only 'beamed' or 'unbeamed' topics for the user
    if (beamedStatus && userId) {
      const completedTopics = await db.beamsTodayWatchedContent.findUnique({
        where: { userId },
        select: { completedBeamsToday: true },
      });

      const completedIds = completedTopics?.completedBeamsToday || [];

      if (beamedStatus === 'beamed') {
        whereClause.id = { in: completedIds };
      } else if (beamedStatus === 'unbeamed') {
        whereClause.id = { notIn: completedIds };
      }
    }

    // Configure sorting order based on sortBy parameter
    let orderBy: any = {};
    switch (sortBy) {
      case 'nameAsc':
        orderBy = { title: 'asc' };
        break;
      case 'nameDesc':
        orderBy = { title: 'desc' };
        break;
      case 'dateAsc':
        orderBy = { date: 'asc' };
        break;
      case 'dateDesc':
      default:
        orderBy = { date: 'desc' };
        break;
    }

    // Execute count query to get total items for pagination
    const totalItems = await db.beamsToday.count({ where: whereClause });
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Execute main query with pagination, sorting, and category inclusion
    const topics = await db.beamsToday.findMany({
      where: whereClause,
      orderBy,
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
      include: {
        category: true,
      },
    });

    // Return search results and pagination info
    return {
      topics,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
      },
    };
  } catch (error) {
    console.error('Search error:', error);
    throw new Error('Failed to search topics');
  }
}