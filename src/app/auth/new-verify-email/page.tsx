"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { verifyCode, verifyCode2 } from "@/actions/auth/verifyCode";
import { Input, Button } from "@nextui-org/react";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import CardWrapper from "@/app/auth/_components/card-wrapper";
import { useSearchParams } from "next/navigation";
import { deletePendingVerification, resendVerificationCode } from "@/actions/auth/register";
import { useEmailStore } from "@/store/email";
import Image from "next/image";
import { useRouter } from "next/navigation";
import RegisterSide from "../_components/RegisterSide";
import { TickCircle } from "iconsax-react";

interface VerifyEmailFormData {
  code: string;
}

const VerifyEmail: React.FC<{}> = ({}) => {
  const { register, handleSubmit, watch, setValue } = useForm<VerifyEmailFormData>({
    defaultValues: { code: "" },
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();
  
  const emailFromUrl = searchParams.get("email");
  const email:any = emailFromUrl;
  
  

  const code = watch("code");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numericValue = value.replace(/\D/g, "").slice(0, 6);
    setValue("code", numericValue);
  };

  const onSubmit: SubmitHandler<VerifyEmailFormData> = async () => {
    setError("");
    setSuccess("");
    setIsLoading(true);
    try {
      const result = await verifyCode(code,email);
      if (result?.success) {
        // console.log("Email verified successfully!");
        // await deletePendingVerification(email)
        setTimeout(() => {
          router.push(`/auth/security-questions?email=${encodeURIComponent(email)}`);
        }, 3000);
      } else {
        setError(result?.error || "Verification failed.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendMessage("");
    setError("");
    try {
      const result = await resendVerificationCode(email);
      if (result?.success) {
        setResendMessage(`A new 6-digit verification code has been sent to <strong class="text-secondary-2">${email}</strong>. Please check your inbox, including your spam folder.`);
      } else {
        setError("Failed to resend verification code. Please try again later.");
      }
    } catch (err) {
      console.error("Error resending the verification code:", err);
      setError("An unexpected error occurred.");
    }
  };
  const handleRedirect = async () => {
    await deletePendingVerification(email)
    router.push(`/auth/register`);
  };
  return (
    <div className="h-full m-0 flex flex-col lg:flex-row min-h-screen w-full items-center justify-center">
    <RegisterSide/>
    <div className="w-full lg:w-[50%] md:pt-6 lg:pt-0 lg:min-h-screen flex items-center justify-center">
    <CardWrapper headerLabel={success ? "Email Verified Successfully!" : "Verify Your Email"}>
    {success ? (
        <div className="text-center space-y-6">
          <Image
            className="mx-auto"
            priority
            alt="password"
            src={"https://res.cloudinary.com/drlyyxqh9/image/upload/v1725379939/authentication/email-verify-3d_ukbke4.webp"}
            width={200}
            height={200}
          />
          <p className="text-lg text-text mb-6">You're Ready to Rock and Roll! </p>
          <Button
            color="primary"
            className="w-full font-semibold py-6 mb-4 text-white md:text-xl text-lg"
            isLoading={true} // Keep the button in loading state
          >
            Redirecting
          </Button>
        </div>
      ) : (
        <>
      <div className="flex justify-center mb-4">
        <Image src="/images/email.png" alt="Verification Illustration" width={250} height={200} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <p className="text-left text-text text-sm">
            {resendMessage ? (
              <span dangerouslySetInnerHTML={{ __html: resendMessage }} />
            ) : (
              <>We have sent a <strong className="text-secondary-2">6-digit verification code</strong> to : <strong className="text-secondary-2">{email}</strong></>
            )}
          </p>
          <p className="text-left text-text text-sm">
          Enter the code below to verify your account. If you can&apos;t find it, check your spam or junk folder—sometimes magic hides there too! Be sure to mark it as safe!
          </p>
          <div className="flex justify-center">
            <input
              {...register("code", { required: true, pattern: /^\d{6}$/ })}
              type="text"
              maxLength={6}
              onChange={handleInputChange}
              value={code}
              ref={inputRef}
              placeholder="Enter the code"
              className="w-full h-10 text-center border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-primary text-2xl tracking-widest"
            />
          </div>
        </div>

       
        <Button
          type="submit"
          color="primary"
          endContent={<TickCircle variant="Bold"/>}
          className="w-full font-semibold text-white py-6 text-lg md:text-xl"
          isLoading={isLoading}
          disabled={code.length !== 6 || isLoading}
        >
          {isLoading ? "Verifying You..." : "Verify Me"}
        </Button>
        {error && <FormError message={error} />}
        {success && <FormSuccess message={success} />}
      </form>
      <div className="my-4 flex flex-col items-center gap-2 text-center">
        <p className="text-sm text-grey-2">
          Didn&apos;t receive the code? Click below
        </p>
        <button
            type="button"
            className="text-primary font-semibold hover:underline focus:outline-none"
            onClick={handleResendCode}
          >
            Resend Code
          </button>
      </div>
      </>
      )}
      {/* <div className="my-4 text-center">
        <p className="text-sm text-grey-2">
          Not You? or Do you want to change your email{" "}
          <button
            type="button"
            className="text-primary hover:underline focus:outline-none"
            onClick={handleRedirect}
          >
            Click Here
          </button>
        </p>
      </div> */}
    </CardWrapper>
    </div>
    </div>
  );
};

export default VerifyEmail;
