'use server'

import { db } from "@/libs/db";



export const getUserAnalyticsById = async (id:string) => {

  try {
    const userAnalytics = await db.beamsTodayUserAnalytics.findUnique({
    where : {
        userId: id
    }
    });
    return userAnalytics;
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    throw new Error("Error fetching user analytics");
  }
};