"use client"
import CardWrapper from "@/components/auth/card-wrapper"
import {BeatLoader} from 'react-spinners'
import { useSearchParams } from "next/navigation"
import { Suspense, useCallback, useEffect, useState } from "react"
import { newVerification } from "@/actions/auth/new-verification"
import FormError from "@/components/form-error"
import FormSuccess from "@/components/form-success"
import { newEmail } from "@/actions/auth/new-email"
const NewVerification = () => {
  const [error, setError] = useState<string | undefined>()
  const [success, setSuccess] = useState<string | undefined>()  
  const searchParams= useSearchParams()
  const token = searchParams.get("token")

  const onSubmit = useCallback(() => {
    if(success || error){
      return;
    }
     if(!token){
      setError("Missing Token")
      return;
     } 
     newEmail(token)
     .then((data) => {
      setSuccess(data.success)
      setError(data.error)
      
     })
     .catch(()=> {
      setError("Something went Wrong!")
     })
  },[token,success,error]);

  useEffect(() => {
  onSubmit();
  },[onSubmit]);
  return (
    <Suspense>
    <CardWrapper
    headerLabel="Confirming Your Verification"
    backButtonHref="/settings"
    backButtonLabel="Back to settings"
    >
    <div className="flex items-center justify-center w-full">
      {!success && !error && (
      <BeatLoader/>
      )} 
      <FormSuccess message={success}/>
      {
        !success && (
         <FormError message={error}/>   
        )
      }
    </div>
    </CardWrapper>
    </Suspense>
  )
}

export default NewVerification