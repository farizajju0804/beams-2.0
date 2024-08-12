"use server";
import { db } from "@/libs/db";
import { getVerificationTokenByToken } from "@/actions/auth/getVerificationToken";
import { getUserByEmail } from "@/actions/auth/getUserByEmail";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const newVerification = async (token: string) => {
  console.log("Starting newVerification process...");

  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    console.error("Token does not exist!");
    return {error:"Token does not exist!" }
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    console.error("Token has expired!");
    return {error:"Token has expired!" }
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    console.error("Email does not exist!");
    throw new Error("Email does not exist!");
  }

  console.log("Updating user email verification status...");

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await db.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  try {
    console.log("Attempting to sign in the user...");

    // Perform sign in using credentials
    const result = await signIn("credentials", {
      redirect: false,
      email: existingUser.email,
      password: existingUser.password, 
      isAutoLogin: true, 
    });

    if (result?.error) {
      console.error("Sign-in error:", result.error);
      return {error : "Sign in error"}
    }

    console.log("Login successful!");
    return { success: "Login successful!", url: DEFAULT_LOGIN_REDIRECT };
  } catch (error: any) {
    console.error("Something went wrong during sign-in:", error.message);
    throw new Error(`Something went wrong during sign-in: ${error.message}`);
  }
};
