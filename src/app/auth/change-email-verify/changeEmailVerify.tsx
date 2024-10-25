"use client"; // Ensures this component runs on the client side

import React, { useState, useRef } from "react"; // Import React hooks for state management and lifecycle
import { useForm, SubmitHandler } from "react-hook-form"; // Import hooks from React Hook Form for form handling
import { z } from "zod"; // Zod for schema validation
import { zodResolver } from "@hookform/resolvers/zod"; // Zod resolver for React Hook Form
import { verifyCodeAndChangeEmail } from "@/actions/auth/verifyCode"; // Action to verify the code and change the email
import {  Button } from "@nextui-org/react"; // Import Input and Button components from NextUI
import FormError from "@/components/form-error"; // Component for displaying form errors
import CardWrapper from "@/app/auth/_components/card-wrapper"; // Wrapper component for consistent UI
import { useSearchParams } from "next/navigation"; // Next.js router hooks for navigation and reading URL params
import { resendVerificationCode3 } from "@/actions/auth/register"; // Action to resend the verification code
import { useEmailStore } from "@/store/email"; // Zustand store for email state management
import Image from "next/image"; // Next.js optimized image component
import Link from "next/link"; // Link component for navigation
import { Sms } from "iconsax-react"; // Icon used in the button
import { RiLoginCircleFill } from "react-icons/ri"; // Icon for login button

// Define the Zod schema for validation
const verifyEmailSchema = z.object({
  code: z
    .string()
    .min(1, { message: "Code required." })
    .min(6, { message: "Code must be exactly 6 digits." })
    .max(6, { message: "Code must be exactly 6 digits." })
    .regex(/^\d{6}$/, { message: "Code must contain only numbers." }),
});

// TypeScript interface for form data based on Zod schema
type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;

/**
 * VerifyEmail component handles the email verification process, where a user
 * enters a 6-digit code to verify and change their email address.
 */
const VerifyEmail: React.FC<{}> = ({}) => {
  // Form state management using React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }, // Access errors from formState
  } = useForm<VerifyEmailFormData>({
    defaultValues: { code: "" },
    resolver: zodResolver(verifyEmailSchema), // Zod schema resolver
  });

  // Component state for errors, success, loading, and resend message
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  // Fetching email and old email from Zustand store and URL search params
  const emailFromStore = useEmailStore((state: any) => state.email);
  const searchParams = useSearchParams();
  const oldEmail: any = searchParams.get("oldEmail");
  const emailFromUrl = searchParams.get("email");
  const email: any = emailFromUrl;

  const code = watch("code"); // Watch the form field for changes
  const inputRef = useRef<HTMLInputElement>(null); // Ref for the input field

  // Handles input changes, ensuring only numeric values are allowed
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numericValue = value.replace(/\D/g, "").slice(0, 6); // Allow only digits
    setValue("code", numericValue); // Update form value
  };

  // Form submission handler for verifying the code and changing the email
  const onSubmit: SubmitHandler<VerifyEmailFormData> = async (data) => {
    setError("");
    setIsLoading(true);
    try {
      const result = await verifyCodeAndChangeEmail(data.code, oldEmail); // Verify the code and change email
      if (result?.success) {
        setSuccess(true); // Set success state if successful
      } else {
        setError(result?.error || "Verification failed."); // Set error if verification fails
      }
    } catch (err) {
      console.error("Error:", err);
      setError("An unexpected error occurred."); // Handle unexpected errors
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  // Handles the resend verification code action
  const handleResendCode = async () => {
    setResendMessage("");
    setError("");
    try {
      const resend = await resendVerificationCode3(email, oldEmail); // Resend the verification code
      if (resend?.success) {
        setResendMessage(`A new 6-digit verification code has been sent to <strong class="text-secondary-2">${email}</strong>. Please check your inbox, including your spam folder.`); // Show success message
      } else {
        setError("Failed to resend verification code. Please try again later."); // Handle resend failure
      }
    } catch (err) {
      console.error("Error resending the verification code:", err);
      setError("An unexpected error occurred."); // Handle unexpected errors
    }
  };

  return (
    <CardWrapper
      headerLabel={success ? "Email Updated Successfully" : "Verify Your New Email"} // Header label changes based on success state
      backButtonPosition="bottom" // Position the back button at the bottom
      backButtonSubText={!success ? "" : " If you need to reset your password, you can do that"} // Subtext for the back button
      backButtonHref={!success ? "" : "/auth/reset"} // Link for the back button
      backButtonLabel={!success ? "" : "here"} // Label for the back button
    >
      {!success ? (
        <>
          {/* Image and form for verification */}
          <div className="flex justify-center mb-4">
            <Image priority src="/images/email.png" alt="Verification Illustration" width={250} height={200} />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              <p className="text-left text-sm text-grey-2 ">
                {resendMessage ? (
                  <span dangerouslySetInnerHTML={{ __html: resendMessage }} /> // Display resend message if available
                ) : (
                  <>We need to verify your email before we change it. So, we&apos;ve sent a 6-digit verification code to <strong className="text-secondary-2">{email}</strong>.</> // Message for verification
                )}
              </p>
              <p className="text-left text-text text-sm">
                Enter the code below to verify your account. If you can&apos;t find it,
                check your spam or junk folder—sometimes magic hides there too! Be
                sure to mark it as safe!
              </p>
              <div className="flex justify-center">
                <input
                  {...register("code")} // Register the input field with validation
                  type="text"
                  maxLength={6} // Limit input to 6 digits
                  onChange={handleInputChange}
                  value={code}
                  placeholder="Enter the Code"
                  ref={inputRef}
                  className="w-48 h-10 text-center border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-primary text-2xl tracking-widest"
                />
              </div>
              {errors.code && <p className="text-red-500 font-medium text-left text-sm">{errors.code?.message}</p>} {/* Display Zod validation errors */}
            </div>

            {error && <FormError message={error} />} {/* Display form errors if any */}

            <Button
              type="submit"
              endContent={<Sms variant="Bold" />} // Icon for the button
              color="primary"
              className="w-full font-semibold text-white text-lg lg:text-xl py-6"
              isLoading={isLoading} // Show loading state during form submission
              disabled={isLoading} // Disable the button while loading
            >
              {isLoading ? "Changing..." : "Change My Email"} {/* Button label changes based on loading state */}
            </Button>
          </form>

          {/* Resend code section */}
          <div className="my-4 flex flex-col items-center gap-1 text-center">
            <p className="text-sm text-grey-2">Didn&apos;t receive the code? Click below</p>
            <button
              type="button"
              className="text-primary text-sm font-semibold hover:underline focus:outline-none"
              onClick={handleResendCode} // Resend code handler
            >
              Resend Code
            </button>
          </div>
        </>
      ) : (
        // Success message and redirect to login
        <div className="text-left w-full">
          <Image
            className="mx-auto mb-6"
            priority
            alt="email success"
            src={"https://res.cloudinary.com/drlyyxqh9/image/upload/v1725442009/authentication/3d-email-verification-2_ldnj89.webp"} // Success image
            width={170}
            height={200}
          />
          <p className="text-text font-medium mb-6">
            You&apos;re all set! Your email has been changed from <strong className="font-bold text-secondary-2">{oldEmail}</strong> to <strong className="font-bold text-secondary-2">{email}</strong>.
          </p>
          <p className="text-sm text-text font-normal mb-6">
            Remember to use your new email next time you log in.
          </p>
          <Link href="/auth/login" passHref>
            <Button color="primary" endContent={<RiLoginCircleFill />} className="w-full font-semibold text-white text-lg py-6 md:text-xl mb-4">
              Go to Login {/* Redirect to login button */}
            </Button>
          </Link>
        </div>
      )}
    </CardWrapper>
  );
};

export default VerifyEmail; // Export the VerifyEmail component
