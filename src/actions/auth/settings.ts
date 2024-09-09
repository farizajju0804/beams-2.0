"use server";
import * as z from 'zod';
import { db } from "@/libs/db"; // Database instance
import { ChangeEmailSchema, ChangePasswordSchema, SettingsSchema } from '@/schema'; // Validation schemas
import { currentUser } from '@/libs/auth'; // Retrieves the currently logged-in user
import { getUserByEmail } from './getUserByEmail'; // Fetch user by email
import { getVerificationToken } from '@/libs/tokens'; // Generates verification tokens
import { sendChangeEmail } from '@/libs/mail'; // Sends change email instructions
import bcrypt from 'bcryptjs'; // Library for hashing passwords

/**
 * Updates user settings based on the input values, including:
 * - Email change request
 * - Password update
 * - Two-Factor Authentication toggle
 * - General profile updates
 * 
 * @param {Object} values - The settings form values to be updated.
 * @returns {Object} - Success or error messages depending on the operation.
 */
export const settings = async (
  values: z.infer<typeof SettingsSchema> | z.infer<typeof ChangeEmailSchema> | z.infer<typeof ChangePasswordSchema> | any
) => {
  // Get the currently authenticated user
  const user:any = await currentUser();
  
  if (!user) {
    return { error: "Unauthorized" }; // Return error if no user is authenticated
  }

  // Get the user data from the database
  const dbUser:any = await getUserByEmail(user?.email);

  // Handle email change request
  if ("changeEmail" in values && values.changeEmail === true) {
    const verificationToken = await getVerificationToken(user.email);
    await sendChangeEmail(user.email, user.firstName, verificationToken.token);
    return { success: `We have sent an email to ${user.email} with the instructions to change your email.` };
  }

  // Handle password update request
  if ("password" in values && "newPassword" in values) {
    // Check if the current password is correct
    const passwordsMatch = await bcrypt.compare(values.password, dbUser?.password);
    if (!passwordsMatch) {
      return { error: "Incorrect password! Please enter your correct current password." };
    }

    // Hash and update the new password
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

  // Handle Two-Factor Authentication toggle
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

  // Handle general profile updates
  await db.user.update({
    where: {
      id: user.id,
    },
    data: {
      ...values, // Apply profile updates
    },
  });

  return { success: "User profile updated successfully!" };
};
