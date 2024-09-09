"use server";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/schema";
import { auth, signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/actions/auth/getUserByEmail";
import { getVerificationToken, getTwoFactorToken } from "@/libs/tokens";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/libs/mail";
import { getTwoFactorTokenByEmail } from "./two-factor-token";
import { db } from "@/libs/db";
import { getTwoFactorConfirmationByUserId } from "./two-factor-confirmation";

/**
 * Handles the login process, including credential verification, email verification, 
 * and two-factor authentication if enabled.
 * 
 * @param {z.infer<typeof LoginSchema>} values - The validated login fields (email, password, code).
 * @param {string} ip - The IP address of the client attempting to log in.
 * @returns {Promise<Object>} - A result object containing success, error, or twoFactor fields.
 */
export const login = async (values: z.infer<typeof LoginSchema>, ip: string) => {
  // Validate the input fields
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid Fields!", success: undefined };
  }

  const { email, password, code } = validatedFields.data;

  // Fetch user by email
  let existingUser: any = await getUserByEmail(email);

  if (!existingUser || !existingUser.email) {
    return { error: "Hmm, can't find that email. Sure it's right?", success: undefined };
  }

  // Check if the user has a linked account with a provider (e.g., Google, GitHub)
  if (!existingUser.password) {
    const linkedAccount = await db.account.findFirst({
      where: {
        userId: existingUser.id,
      },
    });

    if (linkedAccount) {
      return { error: `Looks like you signed up with ${linkedAccount.provider}. Use ${linkedAccount.provider} to log in!`, success: undefined };
    }

    return { error: "Your account may be linked with other providers", success: undefined };
  }

  // Compare the provided password with the stored hash
  const passwordMatch = await bcrypt.compare(password, existingUser.password);
  if (!passwordMatch) {
    return { error: "Those credentials don't seem to match. Try again", success: undefined };
  }

  // Handle email verification if not verified
  if (!existingUser.emailVerified) {
    const verificationToken = await getVerificationToken(existingUser.email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);
    return { error: "VERIFY_EMAIL", success: undefined };
  }

  // Handle two-factor authentication if enabled
  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken) {
        return { error: "No Code found", success: undefined };
      }

      // Validate the two-factor code
      if (twoFactorToken.token !== code) {
        return { error: "Invalid Code", success: undefined };
      }

      // Check for code expiration
      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if (hasExpired) {
        return { error: "Code expired!", success: undefined };
      }

      // Remove the token after successful verification
      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      // Remove previous two-factor confirmation if it exists
      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      // Store new two-factor confirmation for this session
      await db.twoFactorConfirmation.create({
        data: { userId: existingUser.id },
      });
    } else {
      // If no code is provided, send a two-factor code to the user's email
      const twoFactorToken: any = await getTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, existingUser.firstName, twoFactorToken.token);
      return { twoFactor: true }; // Indicates that two-factor authentication is required
    }
  }

  // Final sign-in process
  try {
    await signIn("credentials", { email, password, redirect: false });

    // Update user login details
    await db.user.update({
      where: { id: existingUser.id },
      data: {
        lastLoginIp: ip,
        lastLoginAt: new Date(),
      },
    });

    return { success: "Login success" }; // Successful login
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials", success: undefined };
        default:
          return { error: "Something went wrong! Let's try that again", success: undefined };
      }
    }
    throw error;
  }
};
