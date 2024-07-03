"use server";
import * as z from "zod";
import { LoginSchema } from "@/schema";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail, getUserByUsername } from "@/actions/auth/getUserByEmail";
import { getVerificationToken } from "@/libs/tokens";
import { sendVerificationEmail } from "@/libs/mail";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid Fields!", success: undefined };
  }

  const { identifier, password } = validatedFields.data;

  let existingUser = await getUserByEmail(identifier);
  if (!existingUser) {
    existingUser = await getUserByUsername(identifier);
  }

  if (!existingUser || !existingUser.email) {
    return { error: "No account found", success: undefined };
  }

  if (!existingUser.password) {
    return { error: "Your account may be linked with other providers", success: undefined };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await getVerificationToken(existingUser.email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);
    return { success: "You haven't verified your email. Confirmation email sent!", error: undefined };
  }

  try {
    await signIn("credentials", {
      identifier,
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
