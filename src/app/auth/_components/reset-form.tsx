"use client"; // Ensures this component runs on the client side

import { useForm } from "react-hook-form"; // Import React Hook Form for form handling
import * as z from "zod"; // Import Zod for schema validation
import { ResetSchema } from "@/schema/index"; // Import validation schema for password reset
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"; // Import custom form components
import { Button } from "@nextui-org/react"; // Import Button component from NextUI
import CardWrapper from "@/app/auth/_components/card-wrapper"; // Import CardWrapper for consistent UI layout
import { zodResolver } from "@hookform/resolvers/zod"; // Integrate Zod with React Hook Form
import { Input } from "@nextui-org/react"; // Import Input component from NextUI
import { resendPasswordResetEmail, reset } from "@/actions/auth/reset"; // Actions to handle password reset and resending email
import { useState, useTransition } from "react"; // Import necessary React hooks
import { Send2 } from "iconsax-react"; // Import Send2 icon for button UI
import FormError from "../../../components/form-error"; // Component to display form errors

/**
 * ResetForm component provides a user interface for requesting a password reset.
 * It also allows users to resend reset instructions if needed.
 */
const ResetForm = () => {
  const [error, setError] = useState<string | undefined>(""); // State for managing error messages
  const [success, setSuccess] = useState<boolean>(false); // State for managing success status
  const [isResending, setIsResending] = useState<boolean>(false); // State for resending email status
  const [hasResent, setHasResent] = useState<boolean>(false); // State for tracking if the reset email has been resent
  const [isPending, startTransition] = useTransition(); // Hook to manage transition state during form submission

  // Set up form with Zod validation and default values
  const form = useForm<z.infer<typeof ResetSchema>>({
    mode:"onBlur",
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  // Handle resending the password reset email
  const handleResend = () => {
    setError(""); // Clear previous errors
    setIsResending(true); // Set resending state
    startTransition(() => {
      const values = form.getValues(); // Get current form values (email)
      resendPasswordResetEmail(values.email).then((data) => {
        setIsResending(false); // Reset resending state
        if (data?.success) {
          setHasResent(true); // Track that email was resent
          setSuccess(true); // Show success state
        } else {
          setError(data?.error || "Failed to resend reset instructions."); // Set error if resending fails
        }
      });
    });
  };

  // Handle form submission to request password reset
  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError(""); // Clear previous errors
    setSuccess(false); // Reset success state
    startTransition(() => {
      reset(values).then((data) => {
        if (data?.success) {
          setSuccess(true); // Show success state if reset instructions are sent
        } else {
          setError(data?.error || "Failed to send reset instructions."); // Set error if reset fails
        }
      });
    });
  };

  return (
    <CardWrapper
      subMessage={success ? "" : "Don't worry, we've got your back."} // Sub-message when reset instructions are sent
      headerLabel={success ? (isResending ? "Resending Email..." : "Check Your Inbox 📧") : "Forgot Password 🔑"} // Header label changes based on success or resending state
      backButtonPosition="bottom" // Back button at the bottom of the card
      backButtonSubText="Remember Password?" // Subtext for the back button
      backButtonHref="/auth/login" // Link for back button to navigate to login page
      backButtonLabel="Login" // Label for the back button
    >
     {success && !isResending ? (
  <div className="text-left">
    <p className="text-sm text-text mb-4">
      {hasResent
        ? `We've resent the password reset instructions to your email at `
        : `We've emailed the password reset instructions to you at `}
      <strong className="font-bold text-secondary-2">{form.getValues("email")}</strong>.
    </p>
    <p className="text-sm text-text mb-4">
      If you don&apos;t see our email, check your spam or junk folder—sometimes our messages like to play hide and seek. Be sure to mark it as safe!
    </p>
    <p className="text-sm text-text mb-6">
      {hasResent
        ? `If you still don't see it after a few minutes, please check your email again or try resending.`
        : `If you still can't find it, no worries—click below to resend it.`}
    </p>
    {!hasResent && (
      <Button
        onClick={handleResend}
        endContent={<Send2 variant="Bold" />}
        color="primary"
        className="w-full font-semibold text-white text-lg md:text-xl py-6 mb-4"
        isLoading={isResending} // Show loading state while resending
      >
        Resend Email
      </Button>
    )}
  </div>
) : (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mb-4">
      <div className="space-y-4">
        {/* Email input field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field ,fieldState }) => (
            <FormItem>
              <FormControl>
                <Input
                  isRequired
                  variant="underlined"
                  classNames={{
                    label: "font-semibold text-text",
                    mainWrapper: "w-full flex-1",
                    input: [
                      "placeholder:text-grey-2 text-xs",
                      "w-full flex-1",
                    ],
                  }}
                  label="Email Address"
                  labelPlacement="outside"
                  placeholder="Enter your email"
                  {...field}
                  type="email"
                  disabled={isPending || isResending} // Disable input during submission or resending
                ></Input>
              </FormControl>
              <FormMessage>
        {fieldState.error ? fieldState.error.message : null}
      </FormMessage>
            </FormItem>
          )}
        />
      </div>
      {/* Submit button */}
      {!hasResent &&
      <Button
        type="submit"
        color="primary"
        endContent={<Send2 variant="Bold" />}
        className="w-full text-white text-lg py-6 md:text-xl font-semibold"
        isLoading={isPending || isResending} // Show loading state on the button
      >
        {isPending ? "Sending..." : "Send Reset Instructions"}
      </Button>
      }
      {error && <FormError message={error} />} {/* Show error message if present */}
    </form>
  </Form>
)}
    </CardWrapper>
  );
};

export default ResetForm; // Export the component
