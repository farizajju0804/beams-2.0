"use client"; // Ensures this component runs on the client side

import CardWrapper from "@/app/auth/_components/card-wrapper"; // Card wrapper for consistent UI layout
import { BeatLoader } from 'react-spinners'; // Loader for showing a loading spinner
import { useSearchParams } from "next/navigation"; // Hook to retrieve search parameters from the URL
import { useCallback, useEffect, useState } from "react"; // React hooks for state management and lifecycle events
import FormError from "@/components/form-error"; // Component to display form errors
import { newEmail, verifyToken } from "@/actions/auth/new-email"; // Actions to handle email change and token verification
import { useForm } from "react-hook-form"; // React Hook Form for form handling
import { zodResolver } from "@hookform/resolvers/zod"; // Resolver for integrating Zod validation with React Hook Form
import * as z from "zod"; // Zod for schema validation
import { Input, Button } from "@nextui-org/react"; // Input and Button components from NextUI
import { useRouter } from "next/navigation"; // Next.js router hook for navigation
import { Send2 } from "iconsax-react"; // Icon used in the button for visual feedback
import RedirectMessage from "@/components/Redirection";

// Zod schema for email validation
const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

/**
 * ChangeEmail is a React functional component that handles changing the user's email.
 * It verifies the token from the URL, and if valid, allows the user to submit a new email.
 */
const ChangeEmail = () => {
  const [error, setError] = useState<string | undefined>(); // State for error messages
  const [isLoading, setIsLoading] = useState(true); // Loading state during token verification
  const [isTokenValid, setIsTokenValid] = useState(false); // State to check if the token is valid
  const [isSubmitting, setIsSubmitting] = useState(false); // State for form submission
  const [isRedirecting, setIsRedirecting] = useState(false); // State for handling redirection
  const searchParams = useSearchParams(); // Hook to get search parameters from the URL
  const token = searchParams.get("token"); // Get the token from the URL
  const router = useRouter(); // Next.js router hook for navigation

  // React Hook Form setup with Zod schema validation
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
  });

  // Callback function to verify the token
  const verifyTokenCallback = useCallback(() => {
    if (!token) {
      setError("Invalid Link"); // Set error if no token is found
      setIsLoading(false);
      return;
    }

    verifyToken(token)
      .then((data) => {
        if (data.error) {
          setError(data.error); // Display error if token verification fails
        } else {
          setIsTokenValid(true); // Set token as valid if successful
        }
      })
      .catch(() => {
        setError("Something went wrong!"); // Handle unexpected errors
      })
      .finally(() => {
        setIsLoading(false); // Stop loading after verification attempt
      });
  }, [token]);

  // Trigger token verification on component mount
  useEffect(() => {
    verifyTokenCallback();
  }, [verifyTokenCallback]);

  // Form submission handler
  const onSubmit = async (data: z.infer<typeof emailSchema>) => {
    setError(undefined);
    if (!token) {
      setError("Invalid Link"); // Display error if token is missing
      return;
    }

    setIsSubmitting(true);
    try {
      const result: any = await newEmail(token, data.email); // Submit the new email
      if (result.error) {
        setError(result.error); // Display error if email change fails
      } else {
        setIsRedirecting(true); // Set redirecting state if email change is successful
        router.push(`/auth/change-email-verify?email=${encodeURIComponent(data.email)}&oldEmail=${encodeURIComponent(result.oldEmail)}`); // Redirect to email verification page
      }
    } catch {
      setError("Something went wrong!"); // Handle unexpected errors
    } finally {
      setIsSubmitting(false); // Stop form submission loading state
    }
  };

  // Show loader while verifying the token
  if (isLoading) {
    return (
      <CardWrapper headerLabel="Verifying Your Identity">
        <div className="flex items-center justify-center w-full">
          <BeatLoader color="#f96f2e" /> {/* Loading spinner */}
        </div>
      </CardWrapper>
    );
  }

  return (
    <>
      {isRedirecting ? (
        <RedirectMessage /> 
      ) : (
        <CardWrapper 
          subMessage={!isTokenValid ? "" : "Ready for a change? Enter your new email below, and we'll keep you connected!"} 
          headerLabel={isTokenValid ? "Change Your Email" : "Identity Verification Failed"}
        >
          {isTokenValid && ( // If the token is valid, render the form
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-4">
              <Input
                {...register("email")} // Register the input field with React Hook Form
                type="email"
                variant="underlined"
                labelPlacement="outside"
                label="New Email Address"
                classNames={{
                  label: 'font-semibold text-text', // Label styling
                  mainWrapper: "w-full flex-1",
                  inputWrapper: "h-12",
                  input: [
                    "placeholder:text-grey-2", // Input placeholder styling
                    'w-full flex-1 font-medium',
                  ],
                }}
                placeholder="Enter your new email" // Input placeholder
                disabled={isSubmitting} // Disable input while submitting
              />
              
              <Button 
                type="submit" 
                endContent={<Send2 variant="Bold" />} // Icon in the button
                className="w-full text-white bg-primary font-semibold py-6 text-lg lg:text-xl"
                disabled={isSubmitting} // Disable button while submitting
              >
                {isSubmitting ? "Sending..." : "Send Verification Code"} {/* Button label */}
              </Button>
              {error && <FormError message={error} />} {/* Display form errors if any */}
            </form>
          )}
        </CardWrapper>
      )}
    </>
  );
};

export default ChangeEmail; // Export the ChangeEmail component
