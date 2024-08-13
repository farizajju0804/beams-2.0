'use server';
import * as z from 'zod';
import { db } from "@/libs/db";
import { SettingsSchema } from '@/schema';
import { currentUser } from '@/libs/auth';
import { getUserById } from '@/actions/auth/getUserById';

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id as string);
  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  const updateData: any = {
    firstName: values.firstName,
    lastName: values.lastName,
  };

  if (dbUser.userType === 'STUDENT') {
    updateData.grade = values.grade;
    updateData.dob = values.dob;
  }

  await db.user.update({
    where: {
      id: user.id,
    },
    data: updateData,
  });

  return { success: "User Profile updated!" };
};
