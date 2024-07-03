"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/schema";
import { db } from "@/libs/db";
import { getUserByEmail, getUserByUsername } from "@/actions/auth/getUserByEmail";
import { getVerificationToken } from "@/libs/tokens";
import { sendVerificationEmail } from "@/libs/mail";

export const validateUsername = async (username: string) => {
  const existingUser = await getUserByUsername(username);
  return !existingUser;
};

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid Fields!" };
  }

  const { name, email, password, username, securityQuestion, securityAnswer } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    const linkedAccount = await db.account.findFirst({
      where: {
        userId: existingUser.id,
      },
    });

    if (linkedAccount) {
      return { error: `Your account is linked with ${linkedAccount.provider}. Try logging in with that.` };
    }

    return { error: "Account already exists. Try using a different email." };
  }

  const existingUsername = await getUserByUsername(username);
  if (existingUsername) {
    return { error: "Username already taken. Try a different username!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      username,
      securityQuestion,
      securityAnswer,
    },
  });

  const verificationToken = await getVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Confirmation email sent!" };
};
