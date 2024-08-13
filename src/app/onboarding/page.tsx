'use client'
import React from 'react'
import { updateOnboardingStatus } from '@/actions/auth/onboarding'
import { useRouter } from 'next/navigation'
import { Button } from '@nextui-org/react'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'

const OnboardingPage = () => {
  const router = useRouter()

  const handleLaunch = async () => {
    await updateOnboardingStatus(true)
    router.push(DEFAULT_LOGIN_REDIRECT)
  }

  const handleSkip = async() => {
    await updateOnboardingStatus(true)
    router.push(DEFAULT_LOGIN_REDIRECT)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <Button onClick={handleLaunch} className="w-48">
        Launch Beam Today
      </Button>
      <Button onClick={handleSkip} variant="bordered" className="w-48">
        Skip
      </Button>
    </div>
  )
}

export default OnboardingPage