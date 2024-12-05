// app/actions/global-search.ts
'use server';

import { db } from '@/libs/db';

// Types and Interfaces
interface MongoDocument {
  _id: { $oid: string };
  title: string;
  date: { $date: string };
  thumbnail?: string;
  thumbnailUrl?: string;
  category?: {
    _id: { $oid: string };
    name: string;
    color?: string;
  };
  score: number;
  shortDesc?: string;
  viewCount?: number;
  completionCount?: number;
  fact?: string;      // Add this
  whyItsImportant?: string;  // Add this
  hashtags?: string[];      // Add this
}

interface MongoCursorResponse {
  cursor: {
    firstBatch: MongoDocument[];
  };
  ok: number;
}

export interface GlobalSearchParams {
    query?: string;
    page: number;
    userId?: string;
    itemsPerPage?: number;
    sortBy?: SortByType;
    contentType?: ContentTypeFilter;
    categories?: string[];
    beamedStatus?: BeamedStatusType;
  }

export type SortByType = 'dateDesc' | 'dateAsc' | 'nameAsc' | 'nameDesc';
export type ContentTypeFilter = 'all' | 'beamsToday' | 'fact' | 'connectionGame';
export type BeamedStatusType = 'all' | 'beamed' | 'unbeamed';

export type ContentType = 'fact' | 'beamsToday' | 'connectionGame';

export interface BaseSearchResult {
  id: string;
  title: string;
  type: ContentType;
  thumbnail: string;
  date: Date;
  completed?: boolean;
  category?: {
    id: string;
    name: string;
    color?: string;
  };
  score?: number;
  content?: string;
  viewCount?: number;
  completionCount?: number;
  fact?: string;      // Add this
  whyItsImportant?: string;  // Add this
  hashtags?: string[];      // Add this
}

export interface GlobalSearchResult {
  results: BaseSearchResult[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// In global-search.ts, modify getSortStage:
function getSortStage(sortBy: GlobalSearchParams['sortBy'] = 'dateDesc') {
    console.log('Getting sort stage for:', sortBy);
    
    const sortStage = (() => {
      switch (sortBy) {
        case 'nameAsc':
          return { $sort: { title: 1 } };
        case 'nameDesc':
          return { $sort: { title: -1 } };
        case 'dateAsc':
          return { $sort: { date: 1 } };
        case 'dateDesc':
        default:
          return { $sort: { date: -1 } };
      }
    })();
    
    console.log('Generated sort stage:', sortStage);
    return sortStage;
  }
function createSearchStage(query: string, index: string, paths: string[]) {
  if (!query) return null;
  
  return {
    $search: {
      index,
      text: {
        query,
        path: paths,
        fuzzy: {
          maxEdits: 1,
          prefixLength: 2
        }
      }
    }
  };
}

export async function globalSearch({
  query = '',
  page = 1,
  userId,
  itemsPerPage = 9,
  sortBy = 'dateDesc',
  contentType = 'all',
  categories = [],
  beamedStatus = 'all'
}: GlobalSearchParams): Promise<GlobalSearchResult> {
  try {
    console.log('Starting search with params:', { query, sortBy, contentType });
    const sortStage = getSortStage(sortBy);
    
    // Define match stages based on filters
    const baseMatch = { published: true };
    const categoryMatch = categories.length > 0 ? { categoryId: { $in: categories.map(id => ({ $oid: id })) } } : {};

    const pipelines = {
      facts: [
        ...(query ? [createSearchStage(query, "factSearchIndex", ["title", "fact", "whyItsImportant", "hashtags"])] : []),
        { $match: { ...baseMatch, ...categoryMatch } },
        {
          $lookup: {
            from: "FactCategory",
            localField: "categoryId",
            foreignField: "_id",
            as: "category"
          }
        },
        { $unwind: "$category" },
        ...(userId ? [{
          $lookup: {
            from: "FactCompletion",
            let: { factId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$factId", "$$factId"] },
                      { $eq: ["$userId", { $oid: userId }] },
                      { $eq: ["$completed", true] }
                    ]
                  }
                }
              }
            ],
            as: "completion"
          }
        }] : []),
        {
          $project: {
            _id: 1,
            title: 1,
            date: 1,
            thumbnail: 1,
            hashtags: 1,
            whyItsImportant: 1,
            fact: 1,
            category: {
              _id: "$category._id",
              name: "$category.name",
              color: "$category.color"
            },
            completed: { $gt: [{ $size: "$completion" }, 0] }
          }
        },
        sortStage
      ],
      beamsToday: [
        ...(query ? [createSearchStage(query, "searchIndex", ["title", "shortDesc"])] : []),
        { $match: { ...baseMatch, ...categoryMatch } },
        {
          $lookup: {
            from: "BeamsTodayCategory",
            localField: "categoryId",
            foreignField: "_id",
            as: "category"
          }
        },
        { $unwind: "$category" },
        ...(userId ? [{
          $lookup: {
            from: "BeamsTodayWatchedContent",
            let: { contentId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$userId", { $oid: userId }] },
                      { $in: ["$$contentId", "$completedBeamsToday"] }
                    ]
                  }
                }
              }
            ],
            as: "completion"
          }
        }] : []),
        {
          $project: {
            _id: 1,
            title: 1,
            date: 1,
            thumbnailUrl: 1,
            shortDesc: 1,
            viewCount: 1,
            completionCount: 1,
            category: {
              _id: "$category._id",
              name: "$category.name"
            },
            completed: { $gt: [{ $size: "$completion" }, 0] }
          }
        },
        sortStage
      ],
      connectionGames: [
        ...(query ? [createSearchStage(query, "connectionGameIndex", ["title"])] : []),
        { $match: baseMatch },
        ...(userId ? [{
          $lookup: {
            from: "ConnectionGameCompletion",
            let: { gameId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$connectionGameId", "$$gameId"] },
                      { $eq: ["$userId", { $oid: userId }] },
                      { $eq: ["$completed", true] }
                    ]
                  }
                }
              }
            ],
            as: "completion"
          }
        }] : []),
        {
          $project: {
            _id: 1,
            title: 1,
            date: 1,
            thumbnail: 1,
            completed: { $gt: [{ $size: "$completion" }, 0] }
          }
        },
        sortStage
      ]
    };

    // Execute relevant searches based on contentType
    const searches: Promise<any>[] = [];
    if (contentType === 'all' || contentType === 'fact') {
      searches.push(db.$runCommandRaw({
        aggregate: "FactOfTheday",
        pipeline: pipelines.facts,
        cursor: {}
      }));
    }
    if (contentType === 'all' || contentType === 'beamsToday') {
      searches.push(db.$runCommandRaw({
        aggregate: "BeamsToday",
        pipeline: pipelines.beamsToday,
        cursor: {}
      }));
    }
    if (contentType === 'all' || contentType === 'connectionGame') {
      searches.push(db.$runCommandRaw({
        aggregate: "ConnectionGame",
        pipeline: pipelines.connectionGames,
        cursor: {}
      }));
    }

    const results = await Promise.all(searches);

    // Log raw results from each collection
    results.forEach((result, index) => {
      const collectionType = contentType === 'all' ? 
        (index === 0 ? 'fact' : index === 1 ? 'beamsToday' : 'connectionGame') :
        contentType;
      
      const docs = (result as MongoCursorResponse).cursor.firstBatch;
      console.log(`Raw ${collectionType} results:`, docs.map(d => ({ 
        title: d.title, 
        date: d.date.$date 
      })));
    });

    let allResults: BaseSearchResult[] = [];
    
    // Transform and normalize the results
    results.forEach((result, index) => {
      const docs = (result as MongoCursorResponse).cursor.firstBatch;
      const type = contentType === 'all' ? 
        (index === 0 ? 'fact' : index === 1 ? 'beamsToday' : 'connectionGame') :
        contentType as ContentType;

      const transformedResults:any = docs.map((doc: MongoDocument) => ({
        id: doc._id.$oid,
        title: doc.title?.trim() || '',
        type,
     
        thumbnail: doc.thumbnail || doc.thumbnailUrl || '',
        date: new Date(doc.date.$date),
        content: doc.fact || doc.shortDesc || '',
        
        category: doc.category ? {
          id: doc.category._id.$oid,
          name: doc.category.name,
          color: doc.category.color
        } : undefined,
        completed: 'completed' in doc ? doc.completed : undefined,
        viewCount: doc.viewCount,
        completionCount: doc.completionCount,
        fact: doc.fact,
        whyItsImportant: doc.whyItsImportant,
        hashtags: doc.hashtags || []
      }));

      allResults = [...allResults, ...transformedResults];
    });

    console.log('Titles before sorting:', allResults.map(r => ({ title: r.title, type: r.type })));

    // Apply final sort to combined results
    if (sortBy) {
      allResults.sort((a, b) => {
        try {
          switch (sortBy) {
            case 'nameAsc':
              return (a.title || '').localeCompare(b.title || '');
            case 'nameDesc':
              return (b.title || '').localeCompare(a.title || '');
            case 'dateAsc':
              return (a.date?.getTime() || 0) - (b.date?.getTime() || 0);
            case 'dateDesc':
              return (b.date?.getTime() || 0) - (a.date?.getTime() || 0);
            default:
              return 0;
          }
        } catch (error) {
          console.error('Sorting error:', {
            error,
            aTitle: a.title,
            bTitle: b.title,
            sortBy
          });
          return 0;
        }
      });
    }

    console.log('Titles after sorting:', allResults.map(r => ({ title: r.title, type: r.type })));

    // Filter by beamed status if specified
    if (beamedStatus !== 'all') {
      allResults = allResults.filter(result => 
        beamedStatus === 'beamed' ? result.completed : !result.completed
      );
    }

    // Calculate pagination
    const totalItems = allResults.length;
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedResults = allResults.slice(startIndex, startIndex + itemsPerPage);

    const response = {
      results: paginatedResults,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalItems / itemsPerPage),
        totalItems,
        hasNextPage: startIndex + itemsPerPage < totalItems,
        hasPreviousPage: page > 1
      }
    };

    console.log('Final response pagination:', response.pagination);
    return response;

  } catch (error) {
    console.error('Global search error:', error);
    throw new Error('Failed to perform global search');
  }
}



export async function getCategories() {
    try {
      // Fetch both fact and beams today categories
      const [factCategories, beamsTodayCategories] = await Promise.all([
        db.factCategory.findMany({
          select: {
            id: true,
            name: true,
            color: true,
          },
          orderBy: {
            name: 'asc'
          }
        }),
        db.beamsTodayCategory.findMany({
          select: {
            id: true,
            name: true,
          },
          orderBy: {
            name: 'asc'
          }
        })
      ]);
  
      // Combine and deduplicate categories by name
      const uniqueCategories = [
        ...factCategories,
        ...beamsTodayCategories.map(cat => ({
          ...cat,
          color: '#808080' // Default color for BeamsToday categories if they don't have one
        }))
      ].reduce((acc, current) => {
        const x = acc.find(item => item.name === current.name);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, [] as typeof factCategories);
  
      return uniqueCategories;
  
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }