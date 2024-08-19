'use server'

import { db } from "@/libs/db"
import { getVerificationTokenByToken } from "@/actions/auth/getVerificationToken"
import { getUserByEmail } from "./getUserByEmail"
import { getVerificationToken } from "@/libs/tokens"
import { sendVerificationEmail, sendVerificationEmail2, sendVerificationEmail3 } from "@/libs/mail"

export const verifyToken = async (token: string) => {
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

export const newEmail = async (token: string, newEmail: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Invalid Link!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Link has expired!" };
  }

  const user = await db.user.findUnique({
    where: { email: existingToken.email }
  });

  if (!user) {
    return { error: "User not found!" };
  }
  if (user.email === newEmail) {
    return { error: "New email must be different from your current email" };
  }
  const existingUser = await getUserByEmail(newEmail);

  if (existingUser) {
    return { error: "Email already in use!" };
  }


  await db.verificationToken.delete({
    where: { id: existingToken.id }
  });
  const verificationToken = await getVerificationToken(newEmail);
  await sendVerificationEmail2(verificationToken.email,existingToken.email, verificationToken.token);

  return { success: "Verification email sent. Please check your inbox." , oldEmail : existingToken.email};

//   return { success: "Email updated successfully! Use this email to login in the future" };
}