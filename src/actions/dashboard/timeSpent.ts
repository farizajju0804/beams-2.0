'use server'

import { currentUser } from "@/libs/auth";
import { db } from "@/libs/db";



export const getUserAnalyticsById = async () => {
  const user = await currentUser()
  try {
    const userAnalytics = await db.beamsTodayUserAnalytics.findUnique({
    where : {
        userId: user?.id
    }
    });
    return userAnalytics;
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    throw new Error("Error fetching user analytics");
  }
};