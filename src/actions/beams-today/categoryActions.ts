'use server';

import { db } from "@/libs/db";

export const getAllCategories = async () => {
  try {
    const categories = await db.beamsTodayCategory.findMany();
    return categories;
  } catch (error) {
    throw new Error(`Error fetching categories: ${(error as Error).message}`);
  }
};

export const fetchCategoryTopics = async (selectedCategoryIds: string[]) => {
  try {
    const topics = await db.beamsToday.findMany({
      where: {
        categoryId: {
          in: selectedCategoryIds,
        },
      },
      include: {
        category: true,
      },
    });
    return topics;
  } catch (error) {
    console.error(error);
  }
};


// src/actions/beams-today/fetchCategoryTopics.ts
export const fetchCategoryRelatedTopics = async (categoryId: string) => {
  try {
    const topics = await db.beamsToday.findMany({
      where: { categoryId },
      include: { category: true },
      orderBy: { date: 'desc' },
    });
    return topics;
  } catch (error) {
    throw new Error(`Error fetching category topics: ${(error as Error).message}`);
  }
};
