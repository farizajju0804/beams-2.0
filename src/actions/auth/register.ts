"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { RegisterSchema, SecuritySchema } from "@/schema";
import { db } from "@/libs/db";
import { getUserByEmail } from "@/actions/auth/getUserByEmail";
import { getVerificationToken } from "@/libs/tokens";
import { sendVerificationEmail } from "@/libs/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid Fields!" };
  }

  const { name, email, password } = validatedFields.data;

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

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  return { success: "Please answer the security questions!" };
};

export const submitSecurityAnswers = async (values: z.infer<typeof SecuritySchema>, email: string) => {
  const validatedFields = SecuritySchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid Fields!" };
  }

  const { securityAnswer1, securityAnswer2 } = validatedFields.data;

  await db.user.update({
    where: { email },
    data: {
      securityQuestion1: "What was your first pet's name?",
      securityAnswer1,
      securityQuestion2: "What is your mother's maiden name?",
      securityAnswer2,
    },
  });

  const verificationToken = await getVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Confirmation email sent!" };
};
