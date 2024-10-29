'use server';

import { db } from "@/libs/db";
import { getVerificationTokenByToken } from "@/actions/auth/getVerificationToken";
import { getUserByEmail } from "./getUserByEmail";
import { getVerificationToken } from "@/libs/tokens";
import { sendVerificationEmail2 } from "@/libs/mail";

/**
 * Verifies the provided token to check if it's valid and not expired.
 * 
 * @param {string} token - The token to verify.
 * @returns {Object} - Returns success if valid, or an error if invalid or expired.
 */
export const verifyToken = async (token: string) => {

  try{
    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
      return { error: "Invalid Link!" };
    }
  
    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return { error: "Link has expired!" };
    }
  
    return { success: true };
  }
  catch (error) {
    console.error("Error updating user or deleting token:", error);
    return { error: "Network Error. Check your internet or try again later." };
  }

};

/**
 * Handles email change request, validates the token and updates the email if valid.
 * Sends a new verification email to the new email address.
 * 
 * @param {string} token - The verification token.
 * @param {string} newEmail - The new email address.
 * @returns {Object} - Returns success with message, or an error if validation fails.
 */
export const newEmail = async (token: string, newEmail: string, uuid :string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Invalid Link!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Link has expired!" };
  }

  const user: any = await db.user.findUnique({
    where: { email: existingToken.email },
  });

  if (!user) {
    return { error: "User not found!" };
  }

  if (user.email === newEmail) {
    return { error: "New email must be different from your current email." };
  }

  const existingUser: any = await getUserByEmail(newEmail);
  if (existingUser) {
    return { error: "Email already in use!" };
  }

  // Delete the used verification token
  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  // Generate a new verification token for the new email
  const verificationToken = await getVerificationToken(newEmail);

  // Send a verification email to the new address
  await sendVerificationEmail2(
    verificationToken.email,
    existingToken.email,
    user.firstName,
    verificationToken.token,
    uuid
  );

  return {
    success: "Verification email sent. Please check your inbox.",
    oldEmail: existingToken.email,
  };
};
