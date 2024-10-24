'use server'
import { db } from "@/libs/db";

export const getBeamsTodayAnalytics = async () => {
  try {
    const topics = await db.beamsToday.findMany({
      include: {
        category: true,
      },
    });
    return topics;
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw new Error("Error fetching analytics data");
  }
};



export const getUserAnalytics = async () => {
  try {
    const userAnalytics = await db.beamsTodayUserAnalytics.findMany({
      include: {
        user: true,
      },
    });
    return userAnalytics;
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    throw new Error("Error fetching user analytics");
  }
};