'use client'

import React from 'react'
import { updateOnboardingStatus } from '@/actions/auth/onboarding'
import { Button } from '@nextui-org/react'
import { useTransition } from 'react'

const OnboardingPage = () => {
  const [isPending, startTransition] = useTransition()

  const handleAction = (skip: boolean) => {
    startTransition(() => {
      updateOnboardingStatus(true)
        .catch((error) => {
          console.error("Error updating onboarding status:", error)
          // Handle error (e.g., show an error message to the user)
        })
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