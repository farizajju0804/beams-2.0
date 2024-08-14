"use server";
import { redirect } from 'next/navigation'
import * as z from "zod";
import bcrypt from "bcryptjs";
import { RegisterSchema, SecuritySchema } from "@/schema";
import { db } from "@/libs/db";
import { getUserByEmail } from "@/actions/auth/getUserByEmail";
import { getVerificationToken } from "@/libs/tokens";
import { sendVerificationEmail } from "@/libs/mail";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const registerAndSendVerification = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid Fields!" };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: "Account already exists. Try using a different email." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await db.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  const verificationToken = await getVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);
  console.log("Verification email sent. Please check your inbox.");

  return { success: "Verification email sent. Please check your inbox." };
};

export const resendVerificationCode = async (email:string) => {
  const verificationToken = await getVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);
  console.log("Verification email sent. Please check your inbox.");

  return { success: "Verification email sent. Please check your inbox." };
}



export const updateUserMetadata = async (email: string, values: {
  firstName?: string,
  lastName?: string,
  dob?: Date,
  grade?: string,
  userType?: "STUDENT" | "NON_STUDENT"
}) => {
  try {
    const response = await db.user.update({
      where: { email },
      data: {
        ...values,
        userFormCompleted: true
      }
    });
    console.log('updateUserMetadata: Updated user:', response);
    return { success: true, redirect: '/onboarding'};
  } catch (error) {
    console.error("Error updating user metadata:", error);
    return { success: false, error: "Failed to update user metadata" };
  }
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

  // Attempt to log in the user after updating security answers
  try {
    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return { error: "User not found." };
    }

    const result = await signIn("credentials", {
      email: existingUser.email,
      password: existingUser.password,
      redirect: false,
      isAutoLogin: true, 
    }) as { error?: string; status?: number; ok?: boolean };

    if (result?.error) {
      console.error("Sign-in error:", result.error);
      return { error: "Sign-in failed." };
    }

    console.log("Login successful!");
   
  } catch (error) {
    console.error("Error during sign-in:", error);
    return { error: "An unexpected error occurred during sign-in." };
  }
  redirect('/user-info')
};

