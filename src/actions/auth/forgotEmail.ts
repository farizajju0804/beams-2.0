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


// Function to mask email
const maskEmail = (email: string) => {
  return email.replace(/(.{2})(.*)(?=@)/, (_, a, b) => `${a}${'*'.repeat(b.length - 2)}${b.slice(-2)}`);
};

export const forgotEmail = async (values: z.infer<typeof ForgotEmailSchema>, firstName?: string) => {
  const validatedFields = ForgotEmailSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid Fields!", success: undefined };
  }

  const { securityAnswer1, securityAnswer2 } = validatedFields.data;

  // Get all users with the same security answers
  const users = await getUserBySecurityAnswers(securityAnswer1, securityAnswer2);

  if (!users || users.length === 0) {
    return { error: "Incorrect security answers", success: undefined };
  }

  // If there's only one user, proceed with the masking process
  if (users.length === 1) {
    const email = users[0].email as string;
    const maskedEmail = maskEmail(email);
    return { success: "Email retrieved successfully", maskedEmail };
  }

  // If there are multiple users, filter by first name if provided
  if (firstName) {
    const matchedUsers = users.filter((user: any) => user?.firstName.toLowerCase() === firstName.toLowerCase());
    
    if (matchedUsers.length === 1) {
      const email = matchedUsers[0].email as string;
      const maskedEmail = maskEmail(email);
      return { success: "Email retrieved successfully", maskedEmail };
    } 
    
    // If there are still multiple users after first name match, return all masked emails
    if (matchedUsers.length > 1) {
      const maskedEmails = matchedUsers.map((user:any) => maskEmail(user.email));
      return { success: "Multiple emails found", maskedEmails };
    } else {
      return { error: "First name did not match any record.", success: undefined };
    }
  }

  // If there are multiple users but no first name provided, prompt for the first name
  const userFirstNames = users.map(user => user.firstName);
  return { success: "Multiple users found", userFirstNames };
};
