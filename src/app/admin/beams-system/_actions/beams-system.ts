'use server'
import { Level, Achievement } from '@prisma/client';

export async function getLevels(): Promise<Level[]> {
   
    const db = (await import('@/libs/db')).db;
    return db.level.findMany();
  }
  
 export  async function createLevel(data: Omit<Level, 'id' | 'createdAt' | 'updatedAt'>): Promise<Level> {
 
    const db = (await import('@/libs/db')).db;
    return db.level.create({ data });
  }

  
  
  export async function updateLevel(id: string, data: Partial<Omit<Level, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Level> {
  
    const db = (await import('@/libs/db')).db;
    return db.level.update({ where: { id }, data });
  }
  
  export async function deleteLevel(id: string): Promise<Level> {
   
    const db = (await import('@/libs/db')).db;
    return db.level.delete({ where: { id } });
  }
  
  export  async function getAchievements(): Promise<Achievement[]> {
   
    const db = (await import('@/libs/db')).db;
    return db.achievement.findMany();
  }
  
  export async function createAchievement(data: Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>): Promise<Achievement> {
    
    const db = (await import('@/libs/db')).db;
    return db.achievement.create({ data });
  }
  
  export async function updateAchievement(id: string, data: Partial<Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Achievement> {
   
    const db = (await import('@/libs/db')).db;
    return db.achievement.update({ where: { id }, data });
  }
  
  export async function deleteAchievement(id: string): Promise<Achievement> {
    
    const db = (await import('@/libs/db')).db;
    return db.achievement.delete({ where: { id } });
  }