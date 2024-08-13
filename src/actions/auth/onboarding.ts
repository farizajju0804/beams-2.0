'use server'

import { db } from "@/libs/db"
import { auth } from "@/auth"

export async function updateOnboardingStatus(status: boolean) {
  const session = await auth()

  if (!session || !session.user) {
    throw new Error("Not authenticated")
  }

  const response = await db.user.update({
    where: { id: session.user.id },
    data: { onBoardingCompleted: status },
  })

  return response;
}