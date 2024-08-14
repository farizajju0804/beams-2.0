'use client'

import React from 'react'
import { updateOnboardingStatus } from '@/actions/auth/onboarding'
import { Button } from '@nextui-org/react'
import { useTransition } from 'react'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { redirect, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
const OnboardingPage = () => {
  const [isPending, startTransition] = useTransition()
  const { data: session, update } = useSession();
  const router = useRouter();
  const handleAction = (skip: boolean) => {
    startTransition(async () => {
      const response  = await updateOnboardingStatus(true)
      if (response.success) {
        await update();
        router.refresh();
        router.push('/beams-today')
       
      } else {
        console.error('Failed to update user metadata:', response.error)
      }
        
    })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <Button 
        onClick={() => handleAction(false)} 
        className="w-48"
        isLoading={isPending}
      >
        Launch Beam Today
      </Button>
      <Button 
        onClick={() => handleAction(true)} 
        variant="bordered" 
        className="w-48"
        isLoading={isPending}
      >
        Skip
      </Button>
    </div>
  )
}

export default OnboardingPage