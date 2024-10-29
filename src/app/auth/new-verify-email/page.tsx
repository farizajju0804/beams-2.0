'use client'

import React, { useState, useEffect, useRef } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { verifyCode } from "@/actions/auth/verifyCode"

import FormError from "@/components/form-error"
import CardWrapper from "@/app/auth/_components/card-wrapper"
import { useSearchParams } from "next/navigation"
import { resendVerificationCode } from "@/actions/auth/register"
import Image from "next/image"
import { useRouter } from "next/navigation"
import RegisterSide from "../_components/RegisterSide"
import toast, { Toaster } from 'react-hot-toast'
import { Button, Spinner } from "@nextui-org/react"

const verifyEmailSchema = z.object({
  code: z
    .string()
    .min(1, { message: "Code required." })
    .min(6, { message: "Code must be exactly 6 digits." })
    .max(6, { message: "Code must be exactly 6 digits." })
    .regex(/^\d{6}$/, { message: "Code must contain only numbers." }),
})

type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>

export default function Page() {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<VerifyEmailFormData>({
    defaultValues: { code: "" },
    resolver: zodResolver(verifyEmailSchema),
  })

  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [countdown, setCountdown] = useState(30)  // Start with 30 seconds
  const [showResend, setShowResend] = useState(false)  // Start with resend hidden

  const searchParams = useSearchParams()
  const router = useRouter()
  const emailFromUrl = searchParams.get("email")
  const email = emailFromUrl

  const code = watch("code")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const numericValue = value.replace(/\D/g, "").slice(0, 6)
    setValue("code", numericValue)
  }

  const onSubmit: SubmitHandler<VerifyEmailFormData> = async (data) => {
    setError("")
    setSuccess(false)
    setIsLoading(true)
    try {
      if(email){
      const result = await verifyCode(data.code, email)
      if (result?.success) {
        setSuccess(true)
        toast.success('Email verified successfully!')
      } else {
        setError(result?.error || "Verification failed.")
        toast.error(result?.error || "Verification failed.")
      }
    }
    } catch (err) {
      console.error("Error:", err)
      setError("An unexpected error occurred.")
      toast.error("An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    setShowResend(false)
    setError("")
    setIsResending(true)
    try {
      if(email){

    
      const result = await resendVerificationCode(email)
      if (result?.success) {
        toast.success(`A new verification code has been sent to ${email}`)
        setCountdown(30)
      } else {
        setError("Failed to resend verification code. Please try again later.")
        toast.error("Failed to resend verification code. Please try again later.")
        setShowResend(true)
      }
    }
    } catch (err) {
      console.error("Error resending the verification code:", err)
      setError("An unexpected error occurred.")
      toast.error("An unexpected error occurred.")
      setShowResend(true)
    } finally {
      setIsResending(false)
    }
  }

  useEffect(() => {
    if (success && email) {
      const timer = setTimeout(() => {
        router.push(`/auth/security-questions?email=${encodeURIComponent(email)}`)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [success, router, email])

  
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setShowResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [countdown])

  return (
    <div className="md:min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      <RegisterSide />
      <div className="w-full md:pt-6 lg:pt-0 lg:min-h-screen flex items-center justify-center">
        {
          isResending ? (
            <Spinner />
          ) : (
        <CardWrapper headerLabel={success ? "Email Verified Successfully!" : "Verify Your Email"}>
          {success ? (
            <div className="text-center space-y-6">
              <Image
                className="mx-auto"
                priority
                alt="Verification success"
                src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1725379939/authentication/email-verify-3d_ukbke4.webp"
                width={200}
                height={200}
              />
              <p className="text-lg text-text mb-6">You&apos;re Ready to Rock and Roll!</p>
              <Button color="primary" className="w-full font-semibold text-white text-lg" disabled>
                Redirecting...
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-4">
                <Image priority src="/images/email.png" alt="Verification Illustration" width={250} height={200} />
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <p className="text-left text-text text-sm">
                    We have sent a <strong className="text-secondary-2">6-digit verification code</strong> to:{" "}
                    <strong className="text-secondary-2">{email}</strong>
                  </p>
                  <p className="text-left text-text text-sm">
                    Enter the code below to verify your account. If you can&apos;t find it, check your spam or junk folder.
                  </p>
                  <div className="flex justify-center">
                    <input
                      {...register("code")}
                      type="text"
                      maxLength={6}
                      autoComplete="code"
                      onChange={handleInputChange}
                      value={code}
                      ref={inputRef}
                      aria-label="code"
                      placeholder="Enter the code"
                      className="w-full h-10 text-center border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-primary text-2xl tracking-widest"
                    />
                  </div>
                  {errors.code && <p className="text-red-500 text-sm font-medium text-left">{errors.code.message}</p>}
                </div>

                <Button type="submit" color="primary" className="w-full text-lg font-semibold text-white" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify Me"}
                </Button>
                {error && <FormError message={error} />}
              </form>
              <div className="my-4 flex flex-col items-center gap-2 text-center">
                <p className="text-sm text-muted-foreground">Didn&apos;t receive the code?</p>
                {countdown > 0 ? (
                  <p className="text-text font-semibold">Resend available in {countdown}s</p>
                ) : (
                  showResend &&  (
                    <Button
                      variant="light"
                      onClick={handleResendCode}
                      isDisabled={isResending}
                      color="primary"
                      className="text-primary font-semibold  focus:outline-none"
                    >
                      {isResending ? "Resending..." : "Resend Code"}
                    </Button>
                  )
                )}
              </div>
            </>
          )}
        </CardWrapper>
        )
        }
      </div>
      <Toaster position="top-center" />
    </div>
  )
}