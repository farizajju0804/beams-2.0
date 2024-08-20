"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { verifyCodeAndChangeEmail } from "@/actions/auth/verifyCode";
import { Input, Button } from "@nextui-org/react";
import FormError from "@/components/form-error";
import CardWrapper from "@/components/auth/card-wrapper";
import { useRouter, useSearchParams } from "next/navigation";
import { resendVerificationCode3 } from "@/actions/auth/register";
import { useEmailStore } from "@/store/email";
import Image from "next/image";
import Link from "next/link";

interface VerifyEmailFormData {
  code: string;
}

const VerifyEmail: React.FC<{}> = ({}) => {
  const { register, handleSubmit, watch, setValue } = useForm<VerifyEmailFormData>({
    defaultValues: { code: "" },
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // Use boolean for success state
  const [isLoading, setIsLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const emailFromStore = useEmailStore((state: any) => state.email);
  const searchParams = useSearchParams();
  const oldEmail:any = searchParams.get("oldEmail");
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
    setIsLoading(true);
    try {
      const result = await verifyCodeAndChangeEmail(code, oldEmail);
      if (result?.success) {
        setSuccess(true); 
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
      const resend = await resendVerificationCode3(email,oldEmail);
      if (resend?.success) {
        setResendMessage(`A new 6-digit verification code has been sent to <strong class="text-secondary-2">${email}</strong>. Please check your inbox, including your spam folder.`);
      } else {
        setError("Failed to resend verification code. Please try again later.");
      }
    } catch (err) {
      console.error("Error resending the verification code:", err);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <CardWrapper headerLabel={success ? "Email Changed Successfully" : "Verify Your Email"}>
      {!success ? (
        <>
          <div className="flex justify-center mb-4">
            <Image src="/images/email.png" alt="Verification Illustration" width={250} height={200} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <p className="text-center text-sm text-gray-600 ">
                {resendMessage ? (
                  <span dangerouslySetInnerHTML={{ __html: resendMessage }} />
                ) : (
                  <>We need to verify your email before we change it. So, we have sent a 6-digit verification code to your new email: <strong className="text-secondary-2">{email}</strong>. Please enter it below.</>
                )}
              </p>
              <div className="flex justify-center">
                <input
                  {...register("code", { required: true, pattern: /^\d{6}$/ })}
                  type="text"
                  maxLength={6}
                  onChange={handleInputChange}
                  value={code}
                  ref={inputRef}
                  className="w-48 h-10 text-center border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-primary text-2xl tracking-widest"
                />
              </div>
            </div>

            {error && <FormError message={error} />}

            <Button
              type="submit"
              color="primary"
              className="w-full font-semibold text-white text-lg"
              isLoading={isLoading}
              disabled={code.length !== 6 || isLoading}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-grey-2">
              Did not receive the code? <br />Check your spam folder or{" "}
              <button
                type="button"
                className="text-primary hover:underline focus:outline-none"
                onClick={handleResendCode}
              >
                Resend
              </button>
            </p>
          </div>
        </>
      ) : (
        <div className="text-center space-y-6">
          <p className="text-lg text-grey-2 mb-6">
            Your email has been successfully changed from <strong className="font-bold text-purple">{oldEmail}</strong> to <strong className="font-bold text-purple">{email}</strong>.
          </p>
          <Link href="/auth/login" passHref>
            <Button color="primary" className="w-full font-semibold text-white text-lg mb-4">
              Go to Login
            </Button>
          </Link>
        </div>
      )}
    </CardWrapper>
  );
};

export default VerifyEmail;
