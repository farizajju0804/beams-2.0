'use server'; // Specifies that this file contains server-side logic.

import { db } from "@/libs/db"; // Import the Prisma database instance from the application's database utilities.

/**
 * Fetch all categories from the 'beamsTodayCategory' table.
 * @returns A list of all categories.
 * @throws Throws an error if the categories cannot be fetched.
 */
export const getAllCategories = async () => {
  try {
    // Retrieve all records from the 'beamsTodayCategory' table.
    const categories = await db.beamsTodayCategory.findMany();
    return categories;
  } catch (error) {
    // Throw a descriptive error message if the fetch operation fails.
    throw new Error(`Error fetching categories: ${(error as Error).message}`);
  }
};

/**
 * Fetch topics from the 'beamsToday' table based on selected category IDs.
 * @param selectedCategoryIds - An array of category IDs to filter topics by.
 * @returns A list of topics that belong to the selected categories.
 * @throws Throws an error if the topics cannot be fetched.
 */
export const fetchCategoryTopics = async (selectedCategoryIds: string[]) => {
  try {
    // Retrieve topics from the 'beamsToday' table where the categoryId is in the list of selectedCategoryIds.
    const topics = await db.beamsToday.findMany({
      where: {
        categoryId: {
          in: selectedCategoryIds, // Filter based on selected category IDs.
        },
      },
      include: {
        category: true, // Include related category data in the result.
      },
    });
    return topics; // Return the list of topics.
  } catch (error) {
    // Log the error to the console for debugging purposes.
    console.error(error);
  }
};

// File path: src/actions/beams-today/fetchCategoryTopics.ts

/**
 * Fetch topics from a specific category, sorted by date in descending order.
 * @param categoryId - The ID of the category to fetch topics from.
 * @returns A list of topics that belong to the specified category, ordered by the date in descending order.
 * @throws Throws an error if the topics cannot be fetched.
 */
export const fetchCategoryRelatedTopics = async (categoryId: string) => {
  try {
    // Retrieve topics from the 'beamsToday' table for the given categoryId.
    const topics = await db.beamsToday.findMany({
      where: { categoryId }, // Filter by categoryId.
      include: { category: true }, // Include related category data in the result.
      orderBy: { date: 'desc' }, // Order topics by date in descending order.
    });
    return topics; // Return the list of topics.
  } catch (error) {
    // Throw a descriptive error message if the fetch operation fails.
    throw new Error(`Error fetching category topics: ${(error as Error).message}`);
  }
};
