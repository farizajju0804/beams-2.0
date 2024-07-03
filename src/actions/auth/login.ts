"use server";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/schema";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail, getUserByUsername } from "@/actions/auth/getUserByEmail";
import { getVerificationToken, getTwoFactorToken } from "@/libs/tokens";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/libs/mail";
import { getTwoFactorTokenByEmail } from "./two-factor-token";
import { db } from "@/libs/db";
import { getTwoFactorConfirmationByUserId } from "./two-factor-confirmation";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid Fields!", success: undefined };
  }

  const { identifier, password, code } = validatedFields.data;

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

  const passwordMatch = await bcrypt.compare(password, existingUser.password);
  if (!passwordMatch) {
    return { error: "Invalid Credentials", success: undefined };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await getVerificationToken(existingUser.email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);
    return { success: "You haven't verified your email. Confirmation email sent!", error: undefined };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      console.log(code);
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      console.log(twoFactorToken);
      if (!twoFactorToken) {
        return { error: "No Code found" };
      }

      if (twoFactorToken.token !== code) {
        return { error: "Invalid Code" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if (hasExpired) {
        return { error: "Code expired!" };
      }

      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await getTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      return { twoFactor: true };
    }
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
