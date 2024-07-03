"use server";
import * as z from "zod";
import { ForgotUsernameEmailSchema } from "@/schema";
import { db } from "@/libs/db";
import { getUserBySecurityQuestion } from "@/actions/auth/getUserByEmail";
import {sendUsernameEmail}  from "@/libs/mail";

export const forgotUsernameEmail = async (values: z.infer<typeof ForgotUsernameEmailSchema>) => {
  const validatedFields = ForgotUsernameEmailSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid Fields!", success: undefined };
  }

  const { securityQuestion, securityAnswer } = validatedFields.data;

  const user = await getUserBySecurityQuestion(securityQuestion, securityAnswer);

  if (!user) {
    return { error: "Incorrect security answer", success: undefined };
  }

  try {
    await sendUsernameEmail(user.email as string, user.username as string);
    const maskedEmail = (user.email as string).replace(/(.{2})(.*)(?=@)/, (_, a, b) => `${a}${'*'.repeat(b.length)}`);
    return { error: undefined, success: `Username and email sent to ${maskedEmail}` };
  } catch (error) {
    return { error: "Something went wrong!", success: undefined };
  }
};
