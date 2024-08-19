'use server'
import { db } from '@/libs/db';

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: { id },
    });
    console.log("Prisma query successful");
    return user;
  } catch (error) {
    console.error("Prisma query failed:", error);
    throw error;
  }
};
