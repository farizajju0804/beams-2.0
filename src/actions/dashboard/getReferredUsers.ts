'use server'

import { db } from "@/libs/db"

export const getReferredUsers = async(userId:string) => {
   const referred = await db.user.findMany(
    {
        where : {
            referredById : userId ,
            referralStatus : 'VERIFIED'
        }
    }
   )

   return referred;
} 