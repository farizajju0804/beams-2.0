import { db } from "@/libs/db";

// Function to fetch all relevant BeamsToday data based on watched content IDs
export const getWatchedBeamsTodayContent = async (userId: string) => {
  try {
    const watchedContent = await db.beamsTodayWatchedContent.findUnique({
      where: { userId }
    });

    if (!watchedContent) {
      throw new Error("No watched content found for this user.");
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
