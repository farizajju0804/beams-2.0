'use server';
import * as z from 'zod';
import { db } from "@/libs/db";
import { ChangeEmailSchema, ChangePasswordSchema, SettingsSchema } from '@/schema';
import { currentUser } from '@/libs/auth';
import { getUserById } from '@/actions/auth/getUserById';
import { getUserByEmail } from './getUserByEmail';
import { getVerificationToken } from '@/libs/tokens';
import { sendVerificationEmail2 } from '@/libs/mail';
import bcrypt from 'bcryptjs';
export const settings = async (
  values: z.infer<typeof SettingsSchema> | z.infer<typeof ChangeEmailSchema> | z.infer<typeof ChangePasswordSchema>
) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser: any = await getUserById(user.id as string);
  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  if ("newEmail" in values && values.newEmail) {
    const existingUser = await getUserByEmail(values.newEmail);

    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use" };
    }

    const verificationToken = await getVerificationToken(values.newEmail);
    await sendVerificationEmail2(verificationToken.email, verificationToken.token);

    return { success: "Verification email sent!" };
  }

  if ("password" in values && "newPassword" in values) {
    const passwordsMatch = await bcrypt.compare(values.password, dbUser.password);

    if (!passwordsMatch) {
      return { error: "Incorrect password! Please enter your correct current password" };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return { success: "Password updated Successfully!" };
  }

  // For general profile updates (name, userType, etc.)
  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      ...values,
    },
  });

  return { success: "User Profile updated!" };
};
