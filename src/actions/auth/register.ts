"use server";
import { redirect } from 'next/navigation'
import * as z from "zod";
import bcrypt from "bcryptjs";
import { RegisterSchema, SecuritySchema } from "@/schema";
import { db } from "@/libs/db";
import { getUserByEmail } from "@/actions/auth/getUserByEmail";
import { getVerificationToken } from "@/libs/tokens";
import { sendVerificationEmail, sendVerificationEmail2, sendVerificationEmail3 } from "@/libs/mail";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { currentUser } from '@/libs/auth';

export const registerAndSendVerification = async (values: z.infer<typeof RegisterSchema>,ip:string) => {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid Fields!" };
  }

  const { email, password } = validatedFields.data;

  const existingUser:any = await getUserByEmail(email);
  
  if (existingUser) {
    if (!existingUser?.emailVerified) {
      
      const verificationToken = await getVerificationToken(existingUser?.email);
      await sendVerificationEmail(verificationToken.email, verificationToken.token);
      return { error: "VERIFY_EMAIL", success: undefined };
    }
    return { error: "Account already exists. Try using a different email." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await db.user.create({
    data: {
      email,
      password: hashedPassword,
      lastLoginIp : ip,
      lastLoginAt: new Date(),
    },
  });

  // await db.pendingVerification.create({
  //   data: {
  //     email: values.email,
  //     ip: ip,
  //   },
  // });

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

export const resendVerificationCode2 = async (email:string) => {
  const verificationToken = await getVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);
  console.log("Verification email sent. Please check your inbox.");

  return { success: "Verification email sent. Please check your inbox." };
}

export const resendVerificationCode3 = async (email:string,oldEmail:string) => {
  const user:any= await currentUser()
  const verificationToken = await getVerificationToken(email);
  await sendVerificationEmail2(verificationToken.email,oldEmail, user?.firstName,verificationToken.token);
  console.log("Verification email sent. Please check your inbox.");

  return { success: "Verification email sent. Please check your inbox." };
}


export const updateUserMetadata = async (email: string, values: {
  firstName?: string,
  lastName?: string,
  dob?: Date,
  grade?: string,
  schoolName? :string,
  interests? : string[],
  gender? : string,
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
    return response;
  } catch (error) {
    console.error("Error updating user metadata:", error);
    return error;
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

export const checkPendingVerification = async (ip: string) => {
  const res =  await db.pendingVerification.findFirst({
    where: {ip} ,
    orderBy: {
      createdAt: 'desc', 
    },
    select : {
      email : true
    }
  });
  console.log(res)
  return res
}

export const deletePendingVerification = async (email: string) => {
  const res =  await db.pendingVerification.delete({
    where: {email} ,
  });
  console.log(res)
  return res
}