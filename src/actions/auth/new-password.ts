"use server"
import * as z from "zod"
import bcrypt from 'bcryptjs'
import { NewPasswordSchema } from "@/schema"
import { getPasswordResetTokenByToken } from "./getPasswordToken"
import { getUserByEmail } from "./getUserByEmail"
import { db } from "@/libs/db"
import { sendPasswordResetReminderEmail } from "@/libs/mail"

export const newPassword = async( values : z.infer<typeof NewPasswordSchema>,token?: string|null ) => {

  if(!token){
    return {error : "Invalid Link!"}
  }

  const validatedFields = NewPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid Fields!" };
  }

  const {password} = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token)

  if(!existingToken){
    return {error: "Invalid link" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired){
        return { error : "Link has expired!"};
    }
   

    const existingUser:any = await getUserByEmail(existingToken.email);

    if(!existingUser){
        return { error : "Email does not exist!"};
    }
     
  const passwordMatch = await bcrypt.compare(password, existingUser.password);
  if (passwordMatch) {
    return { error: "New password cannot be same as the old password", success: undefined };
  }
    

    const hashedPassword = await bcrypt.hash(password,10);

    await db.user.update({    
        where : {
            id : existingUser.id
        },
        data:{
            password : hashedPassword
        }

    })

    await db.passwordResetToken.delete({
        where : {
            id : existingToken.id
        }
    })

    await sendPasswordResetReminderEmail(existingToken.email,existingUser.firstName)

    return {success : "Your password has been successfully reset."}
} 