"use server";
import * as z from 'zod';
import { db } from "@/libs/db";
import { ChangeEmailSchema, ChangePasswordSchema, SettingsSchema } from '@/schema';
import { currentUser } from '@/libs/auth';
import { getUserByEmail } from './getUserByEmail';
import { getVerificationToken } from '@/libs/tokens';
import { sendChangeEmail, sendVerificationEmail2 } from '@/libs/mail';
import bcrypt from 'bcryptjs';

export const settings = async (
  values: z.infer<typeof SettingsSchema> | z.infer<typeof ChangeEmailSchema> | z.infer<typeof ChangePasswordSchema> | any
) => {
  const user:any = await currentUser();
  
  if (!user) {
    return { error: "Unauthorized" };
  }
 
  const dbUser:any = await getUserByEmail(user?.email);
  
  if ("changeEmail" in values && values.changeEmail === true) {
    const verificationToken = await getVerificationToken(user.email);
    await sendChangeEmail(user.email, user.firstName, verificationToken.token);

    return { success: `We have sent an email to ${user.email} with the instructions to change your email.` };
  }
  
  if ("password" in values && "newPassword" in values) {
    const passwordsMatch = await bcrypt.compare(values.password, dbUser?.password);

    if (!passwordsMatch) {
      return { error: "Incorrect password! Please enter your correct current password." };
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

    return { success: "Password updated successfully!" };
  }

  if ("isTwoFactorEnabled" in values) {
    await db.user.update({
      where: { id: user.id },
      data: {
        isTwoFactorEnabled: values.isTwoFactorEnabled as boolean
      },
    });

    const message = values.isTwoFactorEnabled
      ? "Two-Factor Authentication has been enabled."
      : "Two-Factor Authentication has been disabled.";

    return { success: message };
  }

  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      ...values,
    },
  });

  return { success: "User profile updated successfully!" };
};
