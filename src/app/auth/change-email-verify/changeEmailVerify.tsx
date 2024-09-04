"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { verifyCodeAndChangeEmail } from "@/actions/auth/verifyCode";
import { Input, Button } from "@nextui-org/react";
import FormError from "@/components/form-error";
import CardWrapper from "@/app/auth/_components/card-wrapper";
import { useRouter, useSearchParams } from "next/navigation";
import { resendVerificationCode3 } from "@/actions/auth/register";
import { useEmailStore } from "@/store/email";
import Image from "next/image";
import Link from "next/link";
import { Sms } from "iconsax-react";
import { RiLoginCircleFill } from "react-icons/ri";

interface VerifyEmailFormData {
  code: string;
}

const VerifyEmail: React.FC<{}> = ({}) => {
  const { register, handleSubmit, watch, setValue } = useForm<VerifyEmailFormData>({
    defaultValues: { code: "" },
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
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
    <CardWrapper 
    headerLabel={success ? "Email Updated Successfully" : "Verify Your New Email"}
    backButtonPosition="bottom"
    backButtonSubText={!success ? "" : " If you need to reset your password, you can do that"}
    backButtonHref={!success ? "" : "/auth/reset"}
    backButtonLabel={!success? "" :"here"}
    >
      {!success ? (
        <>
          <div className="flex justify-center mb-4">
            <Image priority src="/images/email.png" alt="Verification Illustration" width={250} height={200} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              <p className="text-left text-sm text-grey-2 ">
                {resendMessage ? (
                  <span dangerouslySetInnerHTML={{ __html: resendMessage }} />
                ) : (
                  <>We need to verify your email before we change it. So, we&apos;ve sent a 6-digit verification code to <strong className="text-secondary-2">{email}</strong>.</>
                )}
              </p>
              <p className="text-left text-text text-sm">
                    Enter the code below to verify your account. If you can&apos;t find it,
                    check your spam or junk folder—sometimes magic hides there too! Be
                    sure to mark it as safe!
                  </p>
              <div className="flex justify-center">
                <input
                  {...register("code", { required: true, pattern: /^\d{6}$/ })}
                  type="text"
                  maxLength={6}
                  onChange={handleInputChange}
                  value={code}
                  placeholder="Enter the Code"
                  ref={inputRef}
                  className="w-48 h-10 text-center border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-primary text-2xl tracking-widest"
                />
              </div>
            </div>

            {error && <FormError message={error} />}

            <Button
              type="submit"
              endContent={<Sms variant="Bold"/>}
              color="primary"
              className="w-full font-semibold text-white text-lg lg:text-xl py-6"
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? "Changing..." : "Change My Email"}
            </Button>
          </form>
          <div className="my-4 flex flex-col items-center gap-1 text-center">
                <p className="text-sm text-grey-2">Didn&apos;t receive the code? Click below</p>
                <button
                  type="button"
                  className="text-primary text-sm font-semibold hover:underline focus:outline-none"
                  onClick={handleResendCode}
                >
                  Resend Code
                </button>
              </div>
        </>
      ) : (
        <div className="text-left w-full">
          <Image
          className="mx-auto mb-6"
          priority
          alt="email success"
          src={"https://res.cloudinary.com/drlyyxqh9/image/upload/v1725442009/authentication/3d-email-verification-2_ldnj89.webp"}
          width={170}
          height={200}
        />
          <p className="text-text font-medium mb-6">
          You&apos;re all set! Your email has been changed from <strong className="font-bold text-secondary-2">{oldEmail}</strong>  to <strong className="font-bold text-secondary-2">{email}</strong>.
          </p>
          <p className="text-sm text-text font-normal mb-6">
          Remember to use your new email next time you log in.
          </p>
          <Link href="/auth/login" passHref>
          <Button color="primary" endContent={<RiLoginCircleFill/>} className="w-full font-semibold text-white text-lg py-6 md:text-xl mb-4">
            Go to Login
          </Button>
        </Link>
        </div>

            
      )}
    </CardWrapper>
  );
};

export default VerifyEmail;
