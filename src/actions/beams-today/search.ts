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
    // Base query conditions
    let whereClause: any = {
      published: true,
    };

    // Search query
    if (query) {
      whereClause.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { shortDesc: { contains: query, mode: 'insensitive' } },
        { script: { contains: query, mode: 'insensitive' } },
      ];
    }

    // Date filter
    if (selectedDate) {
      whereClause.date = {
        gte: new Date(`${selectedDate}T00:00:00.000Z`),
        lt: new Date(`${selectedDate}T23:59:59.999Z`),
      };
    }

    // Category filter
    if (categories && categories.length > 0) {
      whereClause.categoryId = {
        in: categories,
      };
    }

    // Beamed status filter
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

    // Sort configuration
    let orderBy: any = {};
    switch (sortBy) {
      case 'titleAsc':
        orderBy = { title: 'asc' };
        break;
      case 'titleDesc':
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

    // Execute count query for pagination
    const totalItems = await db.beamsToday.count({ where: whereClause });
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Execute main query with pagination
    const topics = await db.beamsToday.findMany({
      where: whereClause,
      orderBy,
      skip: (page - 1) * itemsPerPage,
      take: itemsPerPage,
      include: {
        category: true,
      },
    });

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