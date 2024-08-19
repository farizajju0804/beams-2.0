"use client"

import CardWrapper from "@/components/auth/card-wrapper"
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

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
})

const ChangeEmail = () => {
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(true)
  const [isTokenValid, setIsTokenValid] = useState(false)

  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const router  = useRouter()
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
    if (!token) {
      setError("Invalid Link")
      return
    }

    try {
      const result:any = await newEmail(token, data.email)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(result.success)
        router.push(`/auth/change-email-verify?email=${encodeURIComponent(data.email)}&oldEmail=${encodeURIComponent(result.oldEmail)}`);
      }
    } catch {
      setError("Something went wrong!")
    }
  }

  if (isLoading) {
    return (
      <CardWrapper headerLabel="Verifying Your Identity">
        <div className="flex items-center justify-center w-full">
          <BeatLoader />
        </div>
      </CardWrapper>
    )
  }

  return (
    <CardWrapper headerLabel={isTokenValid ? "Enter New Email" : "Identity Verification Failed"}>
      
      {isTokenValid && !success && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-4">
          <Input
            {...register("email")}
            type="email"
            label="New Email"
            placeholder="Enter your new email"
          />
          {error && <FormError message={error} />}
          {success && <FormSuccess message={success} />}
          <Button type="submit" className="w-full text-white bg-primary font-medium text-lg ">
            Change Email
          </Button>
        </form>
      )}
    </CardWrapper>
  )
}

export default ChangeEmail