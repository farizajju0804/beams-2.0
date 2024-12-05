// app/actions/facts/search.ts
'use server';

import { db } from '@/libs/db';


interface SearchParams {
  query?: string;
  page: number;
  selectedDate?: string;
  sortBy: string;
  categories?: string[];
  beamedStatus?: 'beamed' | 'unbeamed' | undefined;
  userId?: string;
}

export interface TransformedFact {
  id: string;
  date: Date;
  title: string;
  finalImage: string;
  thumbnail: string;
  factContent: string;
  published: boolean;
  referenceLink1?: string | null;
  referenceLink2?: string | null;
  hashtags: string[];
  categoryId: string;
  category: {
    id: string;
    name: string;
    color: string;
  };
}

interface SearchResult {
  facts: TransformedFact[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export async function searchFacts({
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
      const pipeline: any[] = [];
  
      if (query) {
        pipeline.push({
          $search: {
            index: "factSearchIndex",
            compound: {
              must: [{
                text: {
                  query: query,
                  path: ["title", "fact", "whyItsImportant", "hashtags"],
                  fuzzy: {
                    maxEdits: 1,
                    prefixLength: 2
                  }
                }
              }],
              should: [
                {
                  text: {
                    query: query,
                    path: "title",
                    score: { boost: { value: 3 } }
                  }
                },
                {
                  text: {
                    query: query,
                    path: "factContent",
                    score: { boost: { value: 2 } }
                  }
                }
              ]
            }
          }
        });
      }
  
      // Match stage for filtering
      const matchStage: any = { published: true };
  
      if (selectedDate) {
        matchStage.date = {
          $gte: new Date(`${selectedDate}T00:00:00.000Z`),
          $lt: new Date(`${selectedDate}T23:59:59.999Z`)
        };
      }
  
      if (categories?.length) {
        matchStage.categoryId = {
          $in: categories.map(id => ({ $oid: id }))
        };
      }
  
      pipeline.push({ $match: matchStage });
  
      // Category lookup
      pipeline.push(
        {
          $lookup: {
            from: "FactCategory",
            localField: "categoryId",
            foreignField: "_id",
            as: "category"
          }
        },
        {
          $unwind: "$category"
        }
      );
  
      // Sort the results
      if (query) {
        // If searching, prioritize search score first, then apply requested sort
        pipeline.push({
          $sort: {
            searchScore: -1,
            ...getSortOrder(sortBy, true)
          }
        });
      } else {
        // If not searching, just apply requested sort
        pipeline.push({
          $sort: getSortOrder(sortBy, true)
        });
      }
  
      // Execute the pipeline
      console.log('Executing pipeline:', JSON.stringify(pipeline, null, 2));
      const allResults: any = await db.$runCommandRaw({
        aggregate: "FactOfTheday",
        pipeline: pipeline,
        cursor: {}
      });
  
      let allFacts = allResults.cursor?.firstBatch || [];
      console.log('Raw results:', allFacts.length);
  
      // Apply beamed status filtering
      if (beamedStatus && userId) {
        const completions = await db.factCompletion.findMany({
          where: { 
            userId, 
            completed: true 
          },
          select: { factId: true }
        });
  
        const completedIds = completions.map(c => c.factId);
        allFacts = beamedStatus === 'beamed'
          ? allFacts.filter((fact: any) => completedIds.includes(fact._id.$oid))
          : allFacts.filter((fact: any) => !completedIds.includes(fact._id.$oid));
      }
  
      const totalItems = allFacts.length;
      const startIndex = (page - 1) * itemsPerPage;
      const facts = allFacts.slice(startIndex, startIndex + itemsPerPage);
  
      console.log('Final results:', facts.length);
  
      return {
        facts: facts.map(transformMongoFact),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalItems / itemsPerPage),
          totalItems,
        },
      };
  
    } catch (error) {
      console.error('Search error:', error);
      throw new Error('Failed to search facts');
    }
  }

function getSortOrder(sortBy: string, isMongoDb: boolean = false, hasSearchQuery: boolean = false): any {
  if (isMongoDb) {
    // If there's a search query, prioritize search score unless explicit sort is requested
    if (hasSearchQuery && sortBy === 'dateDesc') {
      return { score: -1, date: -1 };
    }
    
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

  switch (sortBy) {
    case 'nameAsc':
      return { title: 'asc' };
    case 'nameDesc':
      return { title: 'desc' };
    case 'dateAsc':
      return { date: 'asc' };
    case 'dateDesc':
    default:
      return { date: 'desc' };
  }
}

function transformMongoFact(doc: any): TransformedFact {
  return {
    id: doc._id.$oid,
    date: new Date(doc.date.$date),
    title: doc.title,
    finalImage: doc.finalImage,
    thumbnail: doc.thumbnail,
    factContent: doc.factContent,
    published: doc.published,
    referenceLink1: doc.referenceLink1 || null,
    referenceLink2: doc.referenceLink2 || null,
    hashtags: doc.hashtags,
    categoryId: doc.categoryId.$oid,
    category: {
      id: doc.category._id.$oid,
      name: doc.category.name,
      color: doc.category.color
    }
  };
}

export const getAllFactCategories = async () => {
  try {
    const categories = await db.factCategory.findMany();
    return categories;
  } catch (error) {
    throw new Error(`Error fetching categories: ${(error as Error).message}`);
  }
};