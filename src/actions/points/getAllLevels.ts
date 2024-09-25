'use server'
import { db } from "@/libs/db";


export const getAllLevels = async (): Promise<any[]> => {
  try {
    const levels = await db.level.findMany({
    });
    return levels;
  } catch (error) {
    throw new Error(`Error fetching beamsToday entries: ${(error as Error).message}`);
  }
};


export const getUserBeams = async (userId:string): Promise<any> => {
    try {
      const beams = await db.userBeamPoints.findUnique({
        where : {
            userId :  userId
        },
        select :{
            beams: true
        }
      });
      return beams;
    } catch (error) {
      throw new Error(`Error fetching beamsToday entries: ${(error as Error).message}`);
    }
  };
  