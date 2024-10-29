"use server"

import { getAllBeamsToday } from "../actions/beams-today/getAllBeamsToday";
import { format } from 'date-fns';

/**
 * Fetches the minimum and maximum dates from all BeamsToday topics.
 *
 * @returns {Promise<{minDateString: string | null, maxDateString: string | null}>}
 * An object containing the minimum and maximum dates as strings in 'yyyy-MM-dd' format.
 */
export const getMinAndMaxDate = async () => {
  // Fetch all BeamsToday topics
  const topics = await getAllBeamsToday();

  if (topics) {
    // Extract and format the dates from topics
    const highlightDates1 = topics.map((topic: any) =>
      new Date(topic.date).toISOString().split("T")[0]
    );

    const highlightDates = highlightDates1.map((dateString: any) => {
      const date = new Date(dateString);
      // Create a UTC Date object for consistent date manipulation
      return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    });

    // Calculate the minimum date string in 'yyyy-MM-dd' format
    const minDateString =
      highlightDates.length > 0
        ? format(new Date(Math.min(...highlightDates.map((date: any) => date.getTime()))), "yyyy-MM-dd")
        : null;

    // Calculate the maximum date string in 'yyyy-MM-dd' format
    const maxDateString =
      highlightDates.length > 0
        ? format(new Date(Math.max(...highlightDates.map((date: any) => date.getTime()))), "yyyy-MM-dd")
        : null;

    // Return the minimum and maximum date strings
    return { minDateString, maxDateString };
  }
};
