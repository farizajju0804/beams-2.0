"use server";
import { redirect } from 'next/navigation';
import * as z from "zod";
import bcrypt from "bcryptjs";
import { RegisterSchema, SecuritySchema } from "@/schema";
import { db } from "@/libs/db";
import { getUserByEmail } from "@/actions/auth/getUserByEmail";
import { getVerificationToken } from "@/libs/tokens";
import { sendVerificationEmail, sendVerificationEmail2, sendVerificationEmail3 } from "@/libs/mail";
import { signIn } from "@/auth";
import { currentUser } from '@/libs/auth';

/**
 * Registers a new user and sends a verification email.
 * @param {z.infer<typeof RegisterSchema>} values - The registration form values (email, password).
 * @param {string} ip - The IP address of the registering user.
 * @returns {Promise<Object>} A response indicating success or error.
 */
export const registerAndSendVerification = async (values: z.infer<typeof RegisterSchema>, ip: string, referralCode?: string) => {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid Fields!" };
  }

  const { email, password } = validatedFields.data;
  const existingUser: any = await getUserByEmail(email);

  if (existingUser) {
    if (!existingUser.emailVerified) {
      const verificationToken = await getVerificationToken(existingUser.email);
      await sendVerificationEmail(verificationToken.email, verificationToken.token);
      return { error: "VERIFY_EMAIL" };
    }
    return { error: "Account already exists. Try using a different email." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let referredById = null;
  if (referralCode) {
    const referrer = await getUserByReferralCode(referralCode);
    if (referrer) {
      referredById = referrer.userId;
    }
  }
  const userData = {
    email,
    password: hashedPassword,
    lastLoginIp: ip,
    lastLoginAt: new Date(),
  };

  if (referralCode && referredById) {
    Object.assign(userData, {
      referredById,
      referralStatus: 'REGISTERED',
      isAccessible: true
    });
  }
  await db.user.create({
    data: userData
  });

  const verificationToken = await getVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);
  console.log("Verification email sent. Please check your inbox.");

  return { success: "Verification email sent. Please check your inbox." };
};

/**
 * Resends the verification code to the user's email.
 * @param {string} email - The user's email address.
 * @returns {Promise<Object>} A response indicating success.
 */
export const resendVerificationCode = async (email: string) => {
  const verificationToken = await getVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);
  console.log("Verification email sent. Please check your inbox.");
  return { success: "Verification email sent. Please check your inbox." };
};

/**
 * Resends the verification code to the user's new email and updates related information.
 * @param {string} email - The new email address.
 * @param {string} oldEmail - The old email address.
 * @returns {Promise<Object>} A response indicating success.
 */
export const resendVerificationCode3 = async (email: string, oldEmail: string) => {
  const user: any = await currentUser();
  const verificationToken = await getVerificationToken(email);
  await sendVerificationEmail2(verificationToken.email, oldEmail, user?.firstName, verificationToken.token);
  console.log("Verification email sent. Please check your inbox.");
  return { success: "Verification email sent. Please check your inbox." };
};

/**
 * Updates the user's metadata (profile information) in the database.
 * @param {string} email - The user's email address.
 * @param {Object} values - The metadata to update (e.g., firstName, lastName, dob, etc.).
 * @returns {Promise<Object>} The updated user information.
 */
export const updateUserMetadata = async (email: string, values: {
  firstName?: string,
  lastName?: string,
  dob?: Date,
  grade?: string,
  schoolName?: string,
  interests?: string[],
  gender?: string,
  userType?: "STUDENT" | "NON_STUDENT",
}) => {
  try {
    const existingUser = await db.user.update({
      where: { email },
      data: {
        ...values,
        userFormCompleted: true,
      },
    });
    
    console.log('updateUserMetadata: Updated user:', existingUser);
    return existingUser;
  } catch (error) {
    console.error("Error updating user metadata:", error);
    return error;
  }
};

/**
 * Submits the user's security answers and updates their profile.
 * @param {z.infer<typeof SecuritySchema>} values - The security question answers.
 * @param {string} email - The user's email address.
 * @returns {Promise<Object>} A response indicating success or error.
 */
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

  try {
    const existingUser = await getUserByEmail(email);
    if (!existingUser) return { error: "User not found." };

    const result = await signIn("credentials", {
      email: existingUser.email,
      password: existingUser.password,
      redirect: false,
      isAutoLogin: true,
    });

    if (result?.error) {
      console.error("Sign-in error:", result.error);
      return { error: "Sign-in failed." };
    }

    return { success: "Saved Successfully" };
  
  } catch (error) {
    console.error("Error during sign-in:", error);
    return { error: "An unexpected error occurred during sign-in." };
  }

};

/**
 * Checks if there is any pending email verification associated with the given IP address.
 * @param {string} ip - The user's IP address.
 * @returns {Promise<Object|null>} The pending verification information, if any.
 */
export const checkPendingVerification = async (ip: string) => {
  const res = await db.pendingVerification.findFirst({
    where: { ip },
    orderBy: { createdAt: 'desc' },
    select: { email: true },
  });
  console.log(res);
  return res;
};

/**
 * Deletes pending email verification by the given email.
 * @param {string} email - The email associated with the pending verification.
 * @returns {Promise<Object>} The result of the delete operation.
 */
export const deletePendingVerification = async (email: string) => {
  const res = await db.pendingVerification.delete({
    where: { email },
  });
  console.log(res);
  return res;
};



export const getUserByReferralCode = async (referralCode: string) => {
  return await db.referral.findUnique({
    where: { referralCode },
    include: { user: true }, // Include the user who referred
  });
};