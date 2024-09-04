"use client"

import CardWrapper from "@/app/auth/_components/card-wrapper"
import { BeatLoader } from 'react-spinners'
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import FormError from "@/components/form-error"
import FormSuccess from "@/components/form-success"
import { newEmail, verifyToken } from "@/actions/auth/new-email"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input, Button } from "@nextui-org/react"
import { useRouter } from "next/navigation"
import RedirectionMessage from "@/components/RedirectionMessage"
import { Send2 } from "iconsax-react"

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
})

const ChangeEmail = () => {
  const [error, setError] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  const [isTokenValid, setIsTokenValid] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false);
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
  })

  const verifyTokenCallback = useCallback(() => {
    if (!token) {
      setError("Invalid Link")
      setIsLoading(false)
      return
    }

    verifyToken(token)
      .then((data) => {
        if (data.error) {
          setError(data.error)
        } else {
          setIsTokenValid(true)
        }
      })
      .catch(() => {
        setError("Something went wrong!")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [token])

  useEffect(() => {
    verifyTokenCallback()
  }, [verifyTokenCallback])

  const onSubmit = async (data: z.infer<typeof emailSchema>) => {
    setError(undefined);
    if (!token) {
      setError("Invalid Link")
      return
    }

    setIsSubmitting(true)
    try {
      const result: any = await newEmail(token, data.email)
      if (result.error) {
        setError(result.error)
      } else {
        setIsRedirecting(true);
        router.push(`/auth/change-email-verify?email=${encodeURIComponent(data.email)}&oldEmail=${encodeURIComponent(result.oldEmail)}`)
      }
    } catch {
      setError("Something went wrong!")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <CardWrapper headerLabel="Verifying Your Identity">
        <div className="flex items-center justify-center w-full">
          <BeatLoader color="#f96f2e" />
        </div>
      </CardWrapper>
    )
  }

  return (
    <>
     {isRedirecting ? (
        <RedirectionMessage/>
      ) : (
    <CardWrapper subMessage={!isTokenValid ? "" :"Ready for a change? Enter your new email below, and we'll keep you connected!"} headerLabel={isTokenValid ? "Change Your Email" : "Identity Verification Failed"}>
      {isTokenValid && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-4">
          <Input
            {...register("email")}
            type="email"
            variant="underlined"
            labelPlacement="outside"
            label="New Email Address"
            classNames={{
              label: 'font-semibold text-text',
              mainWrapper: "w-full flex-1",
              inputWrapper : "h-12",
              input: [
                "placeholder:text-grey-2",
                'w-full flex-1 font-medium'
              ]
            }}
            placeholder="Enter your new email"
            disabled={isSubmitting}
          />
          
          <Button 
            type="submit" 
            endContent={<Send2 variant="Bold"/>}
            className="w-full text-white bg-primary font-semibold py-6 text-lg lg:text-xl"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Verification Code"}
          </Button>
          {error && <FormError message={error} />}
        </form>
      )}
    </CardWrapper>
    )}
    </>
  )
}

export default ChangeEmail