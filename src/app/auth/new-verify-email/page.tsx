"use client"; // Ensures this component runs on the client side

import React, { useState, useEffect, useRef } from "react"; // Import React hooks for managing state, lifecycle, and refs
import { useForm, SubmitHandler } from "react-hook-form"; // React Hook Form utilities for form handling
import { verifyCode } from "@/actions/auth/verifyCode"; // Action to verify the code
import { Input, Button } from "@nextui-org/react"; // Import Input and Button components from NextUI
import FormError from "@/components/form-error"; // Import component for displaying form errors
import CardWrapper from "@/app/auth/_components/card-wrapper"; // Card wrapper for consistent UI
import { useSearchParams } from "next/navigation"; // Next.js hook to retrieve search params
import { resendVerificationCode } from "@/actions/auth/register"; // Action to resend the verification code
import Image from "next/image"; // Next.js optimized Image component
import { useRouter } from "next/navigation"; // Next.js router hook for navigation
import RegisterSide from "../_components/RegisterSide"; // Side UI component for the registration page
import { TickCircle } from "iconsax-react"; // Icon for visual feedback

// TypeScript interface for form data
interface VerifyEmailFormData {
  code: string; // The verification code field
}

/**
 * VerifyEmail is a React functional component for verifying a user's email
 * by entering a 6-digit code sent to their email. It handles form submission,
 * error handling, and the ability to resend the verification code.
 */
const VerifyEmail: React.FC<{}> = ({}) => {
  // Initialize form handling with default value for the code
  const { register, handleSubmit, watch, setValue } = useForm<VerifyEmailFormData>({
    defaultValues: { code: "" },
  });

  // State management for error, success, loading, and resend message
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const searchParams = useSearchParams(); // Get search parameters from URL
  const router = useRouter(); // Hook for navigation
  const emailFromUrl = searchParams.get("email"); // Extract email from the URL
  const email: any = emailFromUrl; // Typecast email

  const code = watch("code"); // Watch the code field for changes
  const inputRef = useRef<HTMLInputElement>(null); // Reference to the input field

  // Handle input changes, allowing only numeric values and limiting to 6 digits
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numericValue = value.replace(/\D/g, "").slice(0, 6); // Remove non-digit characters
    setValue("code", numericValue); // Set value in form state
  };

  // Form submission handler
  const onSubmit: SubmitHandler<VerifyEmailFormData> = async () => {
    setError(""); // Reset error state
    setSuccess(false); // Reset success state
    setIsLoading(true); // Set loading state to true
    try {
      const result = await verifyCode(code, email); // Verify the code
      if (result?.success) {
        setSuccess(true); // Set success state if the result is successful
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

  // Handle resend code action
  const handleResendCode = async () => {
    setResendMessage(""); // Reset resend message
    setError(""); // Reset error state
    try {
      const result = await resendVerificationCode(email); // Resend verification code
      if (result?.success) {
        setResendMessage(
          `A new 6-digit verification code has been sent to <strong class="text-secondary-2">${email}</strong>. Please check your inbox, including your spam folder.`
        ); // Display success message
      } else {
        setError("Failed to resend verification code. Please try again later."); // Handle resend failure
      }
    } catch (err) {
      console.error("Error resending the verification code:", err);
      setError("An unexpected error occurred."); // Handle unexpected errors
    }
  };

  // Redirect to security questions page on successful verification after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push(`/auth/security-questions?email=${encodeURIComponent(email)}`); // Redirect after successful verification
      }, 3000);

      return () => clearTimeout(timer); // Clear timeout if component unmounts
    }
  }, [success, router]);

  return (
    <div className="md:min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      <RegisterSide /> {/* Side component for registration UI */}
      <div className="w-full md:pt-6 lg:pt-0 lg:min-h-screen flex items-center justify-center">
        <CardWrapper
          headerLabel={success ? "Email Verified Successfully!" : "Verify Your Email"} // Change header label based on success state
        >
          {success ? (
            <div className="text-center space-y-6">
              <Image
                className="mx-auto"
                priority
                alt="Verification success"
                src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1725379939/authentication/email-verify-3d_ukbke4.webp" // Success image
                width={200}
                height={200}
              />
              <p className="text-lg text-text mb-6">You&apos;re Ready to Rock and Roll!</p>
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
                <Image src="/images/email.png" alt="Verification Illustration" width={250} height={200} /> {/* Email illustration */}
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <p className="text-left text-text text-sm">
                    {resendMessage ? (
                      <span dangerouslySetInnerHTML={{ __html: resendMessage }} /> // Display resend message if available
                    ) : (
                      <>
                        We have sent a{" "}
                        <strong className="text-secondary-2">6-digit verification code</strong>{" "}
                        to: <strong className="text-secondary-2">{email}</strong>
                      </>
                    )}
                  </p>
                  <p className="text-left text-text text-sm">
                    Enter the code below to verify your account. If you can&apos;t find it,
                    check your spam or junk folder—sometimes magic hides there too! Be
                    sure to mark it as safe!
                  </p>
                  <div className="flex justify-center">
                    <input
                      {...register("code", { required: true, pattern: /^\d{6}$/ })} // Register input field for code with validation
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
                  endContent={<TickCircle variant="Bold" />} // Icon on the button
                  className="w-full font-semibold text-white py-6 text-lg md:text-xl"
                  isLoading={isLoading} // Show loading state during form submission
                  disabled={isLoading} // Disable button while loading
                >
                  {isLoading ? "Verifying You..." : "Verify Me"} {/* Dynamic button text */}
                </Button>
                {error && <FormError message={error} />} {/* Display form error if any */}
              </form>

              <div className="my-4 flex flex-col items-center gap-2 text-center">
                <p className="text-sm text-grey-2">Didn&apos;t receive the code? Click below</p>
                <button
                  type="button"
                  className="text-primary font-semibold hover:underline focus:outline-none"
                  onClick={handleResendCode} // Resend the verification code
                >
                  Resend Code
                </button>
              </div>
            </>
          )}
        </CardWrapper>
      </div>
    </div>
  );
};

export default VerifyEmail; // Export the VerifyEmail component
