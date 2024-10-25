"use server"

import * as z from "zod";
import { ResetSchema } from "@/schema";
import { getUserByEmail } from "@/actions/auth/getUserByEmail";
import { getPasswordResetToken } from "@/libs/tokens";
import { sendPasswordResetEmail } from "@/libs/mail";
import { db } from "@/libs/db";

/**
 * Handles the password reset request by validating the user's email and generating a password reset token.
 * @param {z.infer<typeof ResetSchema>} values - The email provided by the user.
 * @returns {Promise<Object>} A response indicating success or error.
 */
export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email" };
  }

  const { email } = validatedFields.data;

  try {
    // Check if user exists
    const existingUser: any = await getUserByEmail(email);

    if (!existingUser) {
      return { error: "No account found for this email" };
    }

    if (existingUser.isBanned) {
      return { error: "Your account is banned." };
    }

    // Check if the account is linked to an external provider
    const linkedAccount = await db.account.findFirst({
      where: { userId: existingUser.id },
    });

    if (linkedAccount) {
      return { error: `Your account is linked with ${linkedAccount.provider}. Try logging in with that.` };
    }

    // Generate password reset token and send email
    const passwordResetToken = await getPasswordResetToken(email);
    await sendPasswordResetEmail(
      passwordResetToken.email,
      existingUser.firstName,
      passwordResetToken.token
    );

    return { success: "Email Sent!" };
  } catch (error) {
    console.error("Network or server error:", error);
    return { error: "A network error occurred. Check ypur internet or try again later." };
  }
};

/**
 * Resends the password reset email to the user.
 * @param {string} email - The email address of the user.
 * @returns {Promise<Object>} A response indicating success or error.
 */
export const resendPasswordResetEmail = async (email: string) => {
  const existingUser: any = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "No account found" };
  }

  // Generate password reset token and send email again
  const passwordResetToken = await getPasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    existingUser.firstName,
    passwordResetToken.token
  );

  return { success: "Email Resent!" };
};
