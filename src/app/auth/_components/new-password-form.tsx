"use client"; // Ensures the component runs on the client side

import { useForm } from "react-hook-form"; // Import React Hook Form for form handling
import * as z from "zod"; // Import Zod for schema validation
import { NewPasswordSchema } from "@/schema/index"; // Import schema for new password validation
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"; // Custom form components
import { Button } from "@nextui-org/react"; // Import Button component from NextUI
import CardWrapper from "@/app/auth/_components/card-wrapper"; // Reusable card wrapper component for consistent UI
import { zodResolver } from "@hookform/resolvers/zod"; // Integrate Zod with React Hook Form
import { Input } from "@nextui-org/react"; // Input component from NextUI
import { newPassword } from "@/actions/auth/new-password"; // Action to handle password reset
import { useState, useTransition, useEffect } from "react"; // Import React hooks
import { useSearchParams, useRouter } from "next/navigation"; // Next.js router and search params for navigation and handling URL parameters
import { Eye, EyeSlash, Key } from "iconsax-react"; // Icons for password visibility and form submission
import FormError from "../../../components/form-error"; // Component to display form errors
import PasswordStrength from "./PasswordStrength2"; // Password strength indicator component
import Image from "next/image"; // Optimized image component from Next.js

/**
 * NewPasswordForm handles the user interface for resetting a password.
 * It validates the input and shows password strength.
 */
const NewPasswordForm = () => {
  const searchParams = useSearchParams(); // Get URL search parameters
  const token = searchParams.get("token"); // Retrieve reset token from URL
  const router = useRouter(); // Router for navigation
  const [showPassword, setShowPassword] = useState<boolean>(false); // State for toggling password visibility
  const [error, setError] = useState<string | undefined>(""); // State for error messages
  const [success, setSuccess] = useState<boolean>(false); // State to track if the password reset is successful
  const [isPending, startTransition] = useTransition(); // Transition hook for handling loading state during form submission

  // Setup form with Zod schema validation
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  // Toggle password visibility between plain text and obscured
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  // Handle form submission
  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError(""); // Clear previous errors
    setSuccess(false); // Reset success state
    startTransition(() => {
      newPassword(values, token).then((data) => {
        if (data && data.success) {
          setSuccess(true); // Set success state if password reset is successful
        } else {
          setError(data?.error || "Failed to reset password."); // Set error message if password reset fails
        }
      });
    });
  };

  // Redirect to login after successful password reset
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push("/auth/login"); // Redirect to login page after 3 seconds
      }, 3000);
      return () => clearTimeout(timer); // Clear timeout on component unmount
    }
  }, [success, router]);

  return (
    <CardWrapper
      subMessage={success ? "" : "Time to choose a new password. Just make sure it's not the same password again."} // Instruction message for password reset
      headerLabel={success ? "Your password has been successfully reset." : "Reset Password"} // Header label
    >
      {success ? ( // Show success message if password reset was successful
        <div className="text-center space-y-6">
          <Image
            className="mx-auto"
            priority
            alt="password"
            src={"https://res.cloudinary.com/drlyyxqh9/image/upload/v1725374175/authentication/passwrod-reset-3d_qsqm3a.webp"}
            width={200}
            height={200}
          />
          <p className="text-lg text-text mb-6">Mission Accomplished</p>
          <Button
            color="primary"
            className="w-full font-semibold py-6 mb-4 text-white md:text-xl text-lg"
            isLoading={true} // Keep the button in loading state while redirecting
          >
            Redirecting to Login
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mb-4">
            <div className="space-y-4">
              {/* Password input field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        isRequired
                        aria-label="password"
                        autoComplete="current-password"
                        classNames={{
                          label: "font-semibold text-text",
                          mainWrapper: "w-full flex-1",
                          innerWrapper: 'h-12',
                          input: ["placeholder:text-grey-2 text-xs", "w-full flex-1"],
                        }}
                        label="Password"
                        variant="underlined"
                        {...field}
                        type={showPassword ? "text" : "password"} // Conditionally show or hide password
                        disabled={isPending} // Disable input during form submission
                        labelPlacement="outside"
                        placeholder="Enter a new password"
                        endContent={ // Toggle password visibility icon
                          <span
                            className="cursor-pointer text-[#888888]"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? (
                              <EyeSlash variant="Bold" size={20} />
                            ) : (
                              <Eye variant="Bold" size={20} />
                            )}
                          </span>
                        }
                      />
                    </FormControl>
                    <FormMessage /> {/* Show validation messages */}
                  </FormItem>
                )}
              />
              {/* Password strength component */}
              <PasswordStrength 
                  password={form.watch('password')} // Watch the password value to display strength
                 
                />
            </div>
            {/* Submit button */}
            <Button
              type="submit"
              color="primary"
              aria-label="submit"
              endContent={<Key variant="Bold"/>}
              className="w-full text-white text-lg mdtext-xl font-semibold py-6"
              isLoading={isPending} // Show loading state while form is submitting
            >
              Reset Password
            </Button>
            <FormError message={error} /> {/* Display form error message if present */}
          </form>
        </Form>
      )}
    </CardWrapper>
  );
};

export default NewPasswordForm; // Export the component for use in the application
