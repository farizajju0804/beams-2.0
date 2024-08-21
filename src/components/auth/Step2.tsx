"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { verifyCode } from "@/actions/auth/verifyCode";
import { Input, Button } from "@nextui-org/react";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import CardWrapper from "@/components/auth/card-wrapper";
import Stepper from "./Stepper";
import { resendVerificationCode } from "@/actions/auth/register";
import { useEmailStore } from "@/store/email";
import Image from "next/image";

interface VerifyEmailFormData {
  code: string;
}

const Step2Form: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { register, handleSubmit, watch, setValue } = useForm<VerifyEmailFormData>({
    defaultValues: { code: "" },
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const emailFromStore = useEmailStore((state: any) => state.email);
  const email = emailFromStore || (typeof window !== "undefined" ? localStorage.getItem("email") : "");

  useEffect(() => {
    if (!email) {
      console.error("No email found. Please start from the first step.");
    }
  }, [email]);

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
      const result = await verifyCode(code);
      if (result?.success) {
        console.log("Email verified successfully!");
        onNext();
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

  return (
    <CardWrapper headerLabel="Verify Your Email">
      {/* <Stepper currentStep={2} totalSteps={4} stepLabels={["Account Info", "Email Verification", "User Info", "Security Questions"]} /> */}

      <div className="flex justify-center mb-4">
        <Image src="/images/email.png" alt="Verification Illustration" width={250} height={200} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <p className="text-center text-sm text-gray-600">
            {resendMessage ? (
              <span dangerouslySetInnerHTML={{ __html: resendMessage }} />
            ) : (
              <>We have sent a 6-digit verification code to your email: <strong className="text-secondary-2">{email}</strong>. Please enter it below.</>
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

       
        <Button
          type="submit"
          color="primary"
          className="w-full font-semibold text-white text-lg"
          isLoading={isLoading}
          disabled={code.length !== 6 || isLoading}
        >
          {isLoading ? "Verifying..." : "Verify"}
        </Button>
        {error && <FormError message={error} />}
        {success && <FormSuccess message={success} />}
      </form>
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
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
    </CardWrapper>
  );
};

export default Step2Form;