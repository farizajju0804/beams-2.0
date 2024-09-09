"use server";
import * as z from "zod";
import { ForgotEmailSchema } from "@/schema"; // Schema for validating forgot email form input
import { db } from "@/libs/db"; // Database instance
import { getUserBySecurityAnswers } from "@/actions/auth/getUserByEmail"; // Function to get user based on security answers

/**
 * Recovers the user's email based on their security answers.
 * @param {z.infer<typeof ForgotEmailSchema>} values - Security answers provided by the user.
 * @returns {Object} - Success message with masked email, or error message if the process fails.
 */
export const forgotEmail = async (values: z.infer<typeof ForgotEmailSchema>) => {
  // Validate the form input based on schema
  const validatedFields = ForgotEmailSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid Fields!", success: undefined };
  }

  const { securityAnswer1, securityAnswer2 } = validatedFields.data;

  // Find user by matching the security answers
  const user = await getUserBySecurityAnswers(securityAnswer1, securityAnswer2);

  if (!user) {
    return { error: "Incorrect security answers", success: undefined };
  }

  try {
    // Mask the email for privacy before returning it
    const email = user.email as string;
    const maskedEmail = email.replace(/(.{2})(.*)(?=@)/, (_, a, b) => `${a}${'*'.repeat(b.length - 2)}${b.slice(-2)}`);
    
    // Return masked email and success message
    return { error: undefined, success: "Email retrieved successfully", maskedEmail };
  } catch (error) {
    // Handle any unexpected errors
    return { error: "Something went wrong!", success: undefined };
  }
};
