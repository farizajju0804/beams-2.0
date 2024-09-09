'use server'
import { db } from "@/libs/db"; // Importing the database connection instance

/**
 * Fetches all FAQs from the database, ordered by the creation date in descending order.
 * 
 * @returns {Promise<Array>} A promise that resolves to an array of FAQs.
 * @throws {Error} If no FAQs are found or if the database query fails.
 */
export const getAllFAQs = async () => {
  try {
    // Query the database to retrieve all FAQs, ordered by `createdAt` in descending order
    const faqs = await db.fAQ.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // If no FAQs are found, throw an error
    if (!faqs || faqs.length === 0) {
      throw new Error("No FAQs found");
    }

    // Return the FAQs if successful
    return faqs;
  } catch (error) {
    // If an error occurs, throw a new error with a descriptive message
    throw new Error(`Error fetching FAQs: ${(error as Error).message}`);
  }
};
