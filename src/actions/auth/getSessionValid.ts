'use server'

import { currentUser } from "@/libs/auth";
import { getUserById } from "./getUserById";
import { db } from "@/libs/db";


export async function validateSession() {
 const user:any = await currentUser()
  
  if (!user) {
    return 
  }

  try {
    const response = await db.user.findUnique({
        where : {
            id : user.id
        },
        select : {
            isSessionValid: true,
            isBanned : true
        }
    })
    return response;
  } catch (error) {
    console.error('Error validating session:', error);
    throw new Error('Failed to validate session');
  }
}