"use server";

import { db } from "@/libs/db";
import { getVerificationTokenByToken } from "@/actions/auth/getVerificationToken";
import { getUserByEmail } from "@/actions/auth/getUserByEmail";

export const verifyCode = async (code: string) => {
  const existingToken = await getVerificationTokenByToken(code);

  if (!existingToken) {
    return { error: "Invalid or expired code." };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Code has expired." };
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "User not found." };
  }

  await db.user.update({
    where: { email: existingToken.email },
    data: { emailVerified: new Date() },
  });

  await db.verificationToken.delete({ where: { id: existingToken.id } });

  return { success: "Email verified successfully!" };
};
