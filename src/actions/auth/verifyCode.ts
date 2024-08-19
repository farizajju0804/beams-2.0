"use server";

import { db } from "@/libs/db";
import { getVerificationTokenByToken } from "@/actions/auth/getVerificationToken";
import { getUserByEmail } from "@/actions/auth/getUserByEmail";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";

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

export const verifyCode2 = async (code: string) => {
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

  try {
    console.log("Attempting to sign in the user...");

    // Perform sign in using credentials
    const result = await signIn("credentials", {
      redirect: false,
      email: existingUser.email,
      password: existingUser.password, 
      isAutoLogin: true, 
    });

    

    console.log("Login successful!");
    return { success: "Login successful!", url: DEFAULT_LOGIN_REDIRECT };
  } catch (error: any) {
    console.error("Something went wrong during sign-in:", error.message);
    throw new Error(`Something went wrong during sign-in: ${error.message}`);
  }

  
};


export const verifyCodeAndChangeEmail = async (code: string, oldEmail:string) => {
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
    const newUser = await db.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        email: existingToken.email
      }
    });
  
    await db.verificationToken.delete({ where: { id: existingToken.id } });
  
    return { success: true };
  } catch (error) {
    console.error("Error updating user or deleting token:", error);
    return { error: "Failed to update email. Please try again." };
  }

  
};
