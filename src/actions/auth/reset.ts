"use server"

import * as z from "zod";
import { ResetSchema } from "@/schema";
import { getUserByEmail } from "@/actions/auth/getUserByEmail";
import { getPasswordResetToken } from "@/libs/tokens";
import { sendPasswordResetEmail } from "@/libs/mail";
import { db } from "@/libs/db"; // Make sure to import your database instance

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email" };
  }

  const { email } = validatedFields.data;
  const existingUser:any = await getUserByEmail(email);
  
  if (!existingUser) {
    return { error: "No account found" };
  }

  const linkedAccount = await db.account.findFirst({
    where: {
      userId: existingUser.id,
    },
  });

  if (linkedAccount) {
    return { error: `Your account is linked with ${linkedAccount.provider}. Try logging in with that.` };
  }

  const passwordResetToken = await getPasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    existingUser.firstName,
    passwordResetToken.token
  );

  return { success: "Email Sent!" };
};


export const resendPasswordResetEmail = async (email: string) => {
  const existingUser: any = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "No account found" };
  }

 

  const passwordResetToken = await getPasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    existingUser.firstName,
    passwordResetToken.token
  );

  return { success: "Email Resent!" };
};