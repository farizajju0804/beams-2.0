"use server"

import * as z from "zod"
import { ResetSchema } from "@/schema"

import { getUserByEmail } from "@/actions/auth/getUserByEmail"
import { getPasswordResetToken } from "@/libs/tokens"
import { sendPasswordResetEmail } from "@/libs/mail"

export const reset = async(values :  z.infer<typeof ResetSchema>) => {
   const validatedFields = ResetSchema.safeParse(values);

   if(!validatedFields.success){
    return {error :"Ïnvalid email" }
   }

   const {email} = validatedFields.data;
   const existingUser = await getUserByEmail(email);
   if(!existingUser){
    return {error :"No account found" }
   }

   const passwordResetToken = await getPasswordResetToken(email);
   await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
   )

   return {success : "Email Sent!"}
}