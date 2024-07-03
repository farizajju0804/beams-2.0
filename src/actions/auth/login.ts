"use server";
import * as z from "zod";
import { LoginSchema } from "@/schema";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "./getUserByEmail";
import { getVerificationToken } from "@/libs/tokens";
import { sendVerificationEmail } from "@/libs/mail";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid Fields!", success: undefined };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if(!existingUser || !existingUser.email || !existingUser.password){
    return {error : "Invaild Credentials"}
  }

  if(!existingUser.emailVerified){
    const verificationToken = await getVerificationToken(existingUser.email);
    await sendVerificationEmail (verificationToken.email,verificationToken.token)
    return {success : "Confirmation email sent!"}
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
    return { error: undefined, success: "Login successful!" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials", success: undefined };
        case "CallbackRouteError":
          return { error: "Invalid Credentials", success: undefined };
        default:
          return { error: "Something went wrong!", success: undefined };
      }
    }

    throw error;
  }
};
