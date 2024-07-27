'use server'
import { db } from "@/libs/db";
import { BeamsTodayCategory } from "@/types/beamsToday";

// Fetch all categories
export const getCategories = async (): Promise<BeamsTodayCategory[]> => {
  try {
    const categories = await db.beamsTodayCategory.findMany();
    return categories as any;
  } catch (error) {
    throw new Error(`Error fetching categories: ${(error as Error).message}`);
  }
};

// Create a new category
export const createCategory = async (name: string): Promise<BeamsTodayCategory> => {
  try {
    const newCategory = await db.beamsTodayCategory.create({
      data: { name },
    });
    return newCategory as any;
  } catch (error) {
    throw new Error(`Error creating category: ${(error as Error).message}`);
  }
};
