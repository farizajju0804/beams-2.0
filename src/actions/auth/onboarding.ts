// actions/auth/onboarding.ts
'use server'

import { db } from "@/libs/db"
import { auth } from "@/auth"
import { redirect } from 'next/navigation'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'

export async function updateOnboardingStatus(status: boolean) {
  const session = await auth()

  if (!session || !session.user) {
    throw new Error("Not authenticated")
  }

 

  try {
    const response = await db.user.update({
      where: { id: session.user.id },
      data: { onBoardingCompleted: status },
    })
    return { success: true };
  } catch (error) {
    console.error("Error updating onboarding status:", error);
    return { success: false, error: "Failed to onboarding status" };
  }
};
