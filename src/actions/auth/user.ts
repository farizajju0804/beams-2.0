'use server'
import { currentUser } from "@/libs/auth";
import { db } from "@/libs/db";

import { revalidatePath } from "next/cache";

export const changeProfileImage = async (url: string): Promise<string | null> => {
  try {
    const self = await currentUser();

    await db.user.update({
      where: { id: self?.id },
      data: { image: url },
    });

    return "Profile picture changed";
  } catch (error) {
    throw error;
  }
};
