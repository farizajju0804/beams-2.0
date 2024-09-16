import { db } from "@/libs/db";

// Function to fetch all relevant BeamsToday data based on watched content IDs
export const getWatchedBeamsTodayContent = async (userId: string) => {
  try {
    // Fetch the watched content for the user
    const watchedContent = await db.beamsTodayWatchedContent.findUnique({
      where: { userId },
      select: { completedBeamsToday: true }  // Only fetch completed content IDs
    });

    // If no watched content exists, return an empty array instead of throwing an error
    if (!watchedContent || watchedContent.completedBeamsToday.length === 0) {
      return [];  // Return empty array if there's no watched content
    }

    // Fetch all BeamsToday content that matches the IDs in completedBeamsToday
    const beamsTodayContent = await db.beamsToday.findMany({
      where: {
        id: { in: watchedContent.completedBeamsToday }
      }
    });

    return beamsTodayContent;
  } catch (error) {
    console.error("Error fetching watched BeamsToday content:", error);
    throw new Error("Error fetching watched BeamsToday content");
  }
};
