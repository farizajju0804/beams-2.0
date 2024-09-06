'use server'
import { db } from "@/libs/db";
import { auth } from "@/auth";

export async function getLatestUserData() {
  const session = await auth();
 
  if (!session || !session.user?.email) {
    return null;
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: {
      email :true,
      firstName: true,
      lastName: true,
      userType: true,
      image:true,
      grade: true,
      dob: true,
      userFormCompleted: true,
      onBoardingCompleted: true,
      isTwoFactorEnabled:true,
      gender:true,
      schoolName:true,
    },
  });
  
  return user;
}