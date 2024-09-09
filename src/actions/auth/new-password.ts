"use server"

import * as z from "zod"
import bcrypt from 'bcryptjs'
import { NewPasswordSchema } from "@/schema" // Schema for validating new password
import { getPasswordResetTokenByToken } from "./getPasswordToken" // Fetch token details by token
import { getUserByEmail } from "./getUserByEmail" // Fetch user details by email
import { db } from "@/libs/db" // Database instance
import { sendPasswordResetReminderEmail } from "@/libs/mail" // Sends email to user after successful reset

/**
 * Resets the password of a user based on the provided reset token and new password.
 * @param {z.infer<typeof NewPasswordSchema>} values - New password to be set.
 * @param {string | null} token - Password reset token.
 * @returns Success message or error if the process fails.
 */
export const newPassword = async( values : z.infer<typeof NewPasswordSchema>,token?: string|null ) => {

  // Check if the reset token is valid
  if(!token){
    return {error : "Invalid Link!"}
  }

  // Validate new password fields
  const validatedFields = NewPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid Fields!" };
  }

  const { password } = validatedFields.data;

  // Fetch the reset token details from the database
  const existingToken = await getPasswordResetTokenByToken(token)

  if (!existingToken) {
    return { error: "Invalid link" };
  }

  // Check if the token has expired
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired){
    return { error : "Link has expired!"};
  }

  // Fetch the user associated with the token
  const existingUser:any = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error : "Email does not exist!" };
  }
  
  // Check if the new password matches the old one
  const passwordMatch = await bcrypt.compare(password, existingUser.password);
  if (passwordMatch) {
    return { error: "New password cannot be the same as the old password" };
  }

  // Hash the new password and update the user in the database
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.user.update({    
    where: { id: existingUser.id },
    data: { password: hashedPassword }
  });

  // Delete the used password reset token
  await db.passwordResetToken.delete({
    where: { id: existingToken.id }
  });

  // Send a confirmation email to the user
  await sendPasswordResetReminderEmail(existingToken.email, existingUser.firstName);

  return { success : "Your password has been successfully reset." }
}
