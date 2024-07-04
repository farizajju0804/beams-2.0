'use server'
import * as  z from 'zod'
import {db} from "@/libs/db"
import { SettingsSchema } from '@/schema'
import { currentUser } from '@/libs/auth'
import { getUserById } from './getUserById'
import { getUserByEmail } from './getUserByEmail'
import { getVerificationToken } from '@/libs/tokens'
import { sendVerificationEmail2 } from '@/libs/mail'
import bcrypt from 'bcryptjs'
export const settings = async (
    values : z.infer<typeof SettingsSchema>
) => {
  
    const user = await currentUser()
    if(!user){
        return {error : "Unauthorized"}
    }

    const dbUser = await getUserById(user.id as string);
    if(!dbUser){
        return {error : "Unauthorized"}
    }
     
    if(user.isOAuth){
        values.email = undefined;
        values.isTwoFactorEnabled = undefined;
        values.password = undefined;
        values.newPassword=undefined;

    }

    if(values.email && values.email !== user.email){
        const existingUser = await getUserByEmail(values.email);
         
        if(existingUser && existingUser.id !== user.id){
            return {error : "Email already in use"}
        }

        const verificationToken = await getVerificationToken(values.email)
        await sendVerificationEmail2(verificationToken.email,verificationToken.token)

        return {success : "Verification email sent!"}
    }

    if(values.password && values.newPassword && dbUser.password){
         const passwordsMatch = await bcrypt.compare(
            values.password,
            dbUser.password
         )

         if(!passwordsMatch){
            return { error : "Incorrect password!"}
         }

         const hashedPassword = await bcrypt.hash(
            values.newPassword,
            10
         )
         values.password = hashedPassword
         values.newPassword = undefined;
    }
    await db.user.update({
        where : {
            id : user.id 
        },
        data:{
            ...values
        }
    })

    return { success : "Settings updated!"}
}