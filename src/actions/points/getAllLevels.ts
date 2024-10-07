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


export const getUserLevelAndBeams = async (userId:string): Promise<any> => {
    try {
      const beams = await db.userBeamPoints.findUnique({
        where : {
            userId :  userId
        },
        
        include : {
           level : true
        }
        
      });
      const levelDefault = await db.level.findFirst({
        where : {
          levelNumber :  1
        }
      })
      if (beams) {
        return beams;
      } else {
        return {
          beams: 0, // Default beams to 0
          level: levelDefault, // Set the default level to Level 1
        };
      }
      
    } catch (error) {
      throw new Error(`Error fetching beamsToday entries: ${(error as Error).message}`);
    }
  };
  



  