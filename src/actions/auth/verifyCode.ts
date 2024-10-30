"use server";

import { db } from "@/libs/db";
import { getChangeTokenByToken, getVerificationTokenByToken } from "@/actions/auth/getVerificationToken";
import { getUserByEmail } from "@/actions/auth/getUserByEmail";

/**
 * Verifies the verification code for a user's email verification process.
 * @param {string} code - The verification code.
 * @param {string} email - The user's email.
 * @returns {Object} - Returns an error or success message.
 */
export const verifyCode = async (code: string, email: string) => {
  try {
    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
      return { error: "Invalid Link" };
    }

    if (existingUser.emailVerified) {
      return { success: "Email already verified. Try logging in with your credentials." };
    }

    const existingToken = await getVerificationTokenByToken(code);
    if (!existingToken) {
      return { error: "No account exists with this code." };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      return { error: "Code has expired." };
    }

    await db.user.update({
      where: { email: existingToken.email },
      data: {
        emailVerified: new Date(),  
      },
    });

    await db.verificationToken.delete({ where: { id: existingToken.id } });

    return { success: "Email verified successfully!" };
  } catch (error) {
    console.error("Network or server error:", error);
    return { error: "Network or server error. Check your internet or try again later." };
  }
};




/**
 * Verifies the code and changes the user's email.
 * @param {string} code - The verification code.
 * @param {string} oldEmail - The user's old email.
 *  @param {string} uuid - The user's uuid created.
 * @returns {Object} - Returns an error or success message.
 */
export const verifyCodeAndChangeEmail = async (code: string, oldEmail: string,uuid:string) => {
  const existingToken = await getChangeTokenByToken(code,uuid);
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

    await db.changeToken.delete({ where: { id: existingToken.id } });

    return { success: true };
  } catch (error) {
    console.error("Error updating user or deleting token:", error);
    return { error: "Network Error. Check your internet or try again later." };
  }
};
