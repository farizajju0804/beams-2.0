"use server";
import * as z from "zod";
import { ForgotEmailSchema } from "@/schema";
import { db } from "@/libs/db";
import { getUserBySecurityAnswers } from "@/actions/auth/getUserByEmail";

export const forgotEmail = async (values: z.infer<typeof ForgotEmailSchema>) => {
  const validatedFields = ForgotEmailSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid Fields!", success: undefined };
  }

  const { securityAnswer1, securityAnswer2 } = validatedFields.data;

  const user = await getUserBySecurityAnswers(securityAnswer1, securityAnswer2);

  if (!user) {
    return { error: "Incorrect security answers", success: undefined };
  }

  try {
    const email = user.email as string;
    const maskedEmail = email.replace(/(.{2})(.*)(?=@)/, (_, a, b) => `${a}${'*'.repeat(b.length - 2)}${b.slice(-2)}`);
    return { error: undefined, success: "Email retrieved successfully", maskedEmail };
  } catch (error) {
    return { error: "Something went wrong!", success: undefined };
  }
};
