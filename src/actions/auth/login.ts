"use server";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/schema";
import { signIn,} from "@/auth";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/actions/auth/getUserByEmail";
import { getVerificationToken, getTwoFactorToken } from "@/libs/tokens";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/libs/mail";
import { getTwoFactorTokenByEmail } from "./two-factor-token";
import { db } from "@/libs/db";
import { getTwoFactorConfirmationByUserId } from "./two-factor-confirmation";
import { getClientIp } from "@/utils/getClientIp";

/**
 * Handles the login process, including credential verification, email verification, 
 * and two-factor authentication if enabled.
 * 
 * @param {z.infer<typeof LoginSchema>} values - The validated login fields (email, password, code).
 * @returns {Promise<Object>} - A result object containing success, error, or twoFactor fields.
 */
export const login = async (values: z.infer<typeof LoginSchema>) => {
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

  if (existingUser.isBanned) {
    return { error: "Your Account is Banned", success: undefined };
  }

  // Check if the user has a linked account with a provider (OAuth user)
  const linkedAccount = await db.account.findFirst({
    where: {
      userId: existingUser.id,
    },
  });

  // Check if the user is an OAuth user (no password, linked to provider)
  if (!existingUser.password && linkedAccount) {
    return { error: `Looks like you signed up with ${linkedAccount.provider}. Use ${linkedAccount.provider} to log in!`, success: undefined };
  }

  // Compare the provided password with the stored hash (for non-OAuth users)
  const passwordMatch = await bcrypt.compare(password, existingUser.password);
  if (!passwordMatch) {
    return { error: "Those credentials don't seem to match. Try again", success: undefined };
  }

  // Handle email verification if not verified
  if (!existingUser.emailVerified) {
    const verificationToken = await getVerificationToken(existingUser.email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token);
    return { error: "VERIFY_EMAIL", success: undefined }; // Redirect to email verification
  }

  // Check if the user has not set security answers (for non-OAuth users)
  if (!existingUser.securityAnswer1 && !existingUser.securityAnswer2 && !linkedAccount) {
    return { error: "SET_SECURITY_ANSWERS", success: undefined }; // Redirect to security answers setup page
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
    const ip = await getClientIp()
    // Update user login details
    const updated = await db.user.update({
      where: { id: existingUser.id },
      data: {
        lastLoginIp: ip,
        lastLoginAt: new Date(),
        isSessionValid: true 

      },
    });
    console.log("db updated",updated)

    return { success: "Login success" }; // Successful login
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials", success: undefined };
        default:
          return { error: "Network or server error. Please Check your internet or try again later.", success: undefined };
      }
    }
    throw error;
  }
};
