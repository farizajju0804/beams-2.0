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

  await db.user.update({
    where: { id: session.user.id },
    data: { onBoardingCompleted: status },
  })

  redirect(DEFAULT_LOGIN_REDIRECT)
}