"use server";

import { db } from "@/libs/db";
import { getVerificationTokenByToken } from "@/actions/auth/getVerificationToken";
import { getUserByEmail } from "@/actions/auth/getUserByEmail";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "@/auth";

/**
 * Verifies the verification code for a user's email verification process.
 * @param {string} code - The verification code.
 * @param {string} email - The user's email.
 * @returns {Object} - Returns an error or success message.
 */
export const verifyCode = async (code: string, email: string) => {
  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return { error: "User not found." };
  }

  if (existingUser.emailVerified) {
    return { success: "Email already verified. Try logging in with your credentials." };
  }

  const existingToken = await getVerificationTokenByToken(code);
  if (!existingToken) {
    return { error: "Invalid or expired code." };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Code has expired." };
  }

  await db.user.update({
    where: { email: existingToken.email },
    data: { emailVerified: new Date(),
      referralStatus: existingUser.referredById ? 'VERIFIED' : null,
     },
  });

  await db.verificationToken.delete({ where: { id: existingToken.id } });


  return { success: "Email verified successfully!" };
};

/**
 * Verifies the code and signs in the user.
 * @param {string} code - The verification code.
 * @returns {Object} - Returns an error or success message with login details.
 */


/**
 * Verifies the code and changes the user's email.
 * @param {string} code - The verification code.
 * @param {string} oldEmail - The user's old email.
 * @returns {Object} - Returns an error or success message.
 */
export const verifyCodeAndChangeEmail = async (code: string, oldEmail: string) => {
  const existingToken = await getVerificationTokenByToken(code);
  if (!existingToken) {
    return { error: "Invalid or expired code." };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Code has expired." };
  }

  const user = await getUserByEmail(oldEmail);
  if (!user) {
    return { error: "User not found." };
  }

  try {
    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        email: existingToken.email,
      },
    });

    await db.verificationToken.delete({ where: { id: existingToken.id } });

    return { success: true };
  } catch (error) {
    console.error("Error updating user or deleting token:", error);
    return { error: "Failed to update email. Please try again." };
  }
};
