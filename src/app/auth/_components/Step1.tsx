"use client"; // Ensures this component runs on the client side

import React, { useState, useTransition } from "react"; // Import necessary React hooks
import { useForm } from "react-hook-form"; // Import React Hook Form for form handling
import * as z from "zod"; // Import Zod for schema validation
import { zodResolver } from "@hookform/resolvers/zod"; // Integrates Zod with React Hook Form
import { RegisterSchema } from "@/schema"; // Import validation schema
import { Input, Button } from "@nextui-org/react"; // Import UI components from NextUI
import { registerAndSendVerification } from "@/actions/auth/register"; // Action to handle registration and email verification
import { Eye, EyeSlash, User } from "iconsax-react"; // Icons used in the UI
import FormError from "@/components/form-error"; // Component for displaying form errors
import FormSuccess from "@/components/form-success"; // Component for displaying success messages
import CardWrapper from "@/app/auth/_components/card-wrapper"; // Reusable card wrapper component for consistent UI
import PasswordStrength from "./PasswordStrength2"; // Component for password strength indication
import { Form, FormControl, FormField, FormItem, FormMessage } from "../../../components/ui/form"; // Custom form components
import { useRouter } from "next/navigation"; // Hook for navigation
import Link from "next/link"; // Link component for navigation
import { useSearchParams } from 'next/navigation';
// Props interface for the RegisterForm component

/**
 * Step1Form handles user registration, including form validation, submission,
 * and displaying password strength indicators.
 */
const Step1Form = () => {
  const [error, setError] = useState<string | undefined>(""); // State to track error messages
  const [success, setSuccess] = useState<string | undefined>(""); // State to track success messages
  const [isPending, startTransition] = useTransition(); // Transition hook to handle pending state
  const [showPassword, setShowPassword] = useState<boolean>(false); // State to toggle password visibility
  const router = useRouter(); // Hook for handling navigation
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('referral');
  // Set up form with Zod validation schema and default values
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });



  // Function to handle form submission
  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success messages
    startTransition(async () => {
      try {
        let result
        if(referralCode){
        result= await registerAndSendVerification(values,referralCode); 
        }
        if(!referralCode){
        result = await registerAndSendVerification(values); 
        }

        if (result?.error === "VERIFY_EMAIL") {
          router.push(`/auth/new-verify-email?email=${encodeURIComponent(values.email)}`); // Redirect to email verification page
        } else if (result?.error) {
          setError(result.error); // Set error message if registration fails
        } else if (result?.success) {
          // setSuccess(result.success); // Show success message
          router.push(`/auth/new-verify-email?email=${encodeURIComponent(values.email)}`); // Redirect to verification page
        }
      } catch (err) {
        console.error("Error:", err);
        setError("An unexpected error occurred. Please try again."); // Handle unexpected errors
      }
    });
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <CardWrapper
      headerLabel="Sign Up 🚀" // Header label for the form
      backButtonLabel="Login" // Back button label
      backButtonSubText="Have an account?" // Subtext for the back button
      backButtonHref="/auth/login" // Link for the back button
      backButtonPosition="top" // Position of the back button
      showSocial // Show social login options
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col gap-6">
            {/* Email input field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      isRequired
                      aria-label="email"
                      label="Email"
                      classNames={{
                        label: 'font-semibold text-text',
                        mainWrapper: "w-full flex-1",
                        inputWrapper: "h-12",
                        input: [
                          "placeholder:text-grey-2 ",
                          'w-full flex-1 font-medium',
                        ],
                      }}
                      {...field}
                      type="email"
                      disabled={isPending}
                      variant="underlined"
                      autoComplete="email"
                      labelPlacement="outside"
                      placeholder="Enter your email"

                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Password input field with strength indicator */}
            <div className="h-auto">
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
                          label: 'font-semibold text-text',
                          mainWrapper: "w-full flex-1",
                          inputWrapper: "h-12",
                          input: [
                            "placeholder:text-grey-2 ",
                            'w-full flex-1 font-medium',
                          ],
                        }}
                        label="Password"
                        {...field}
                        type={showPassword ? "text" : "password"}
                        disabled={isPending}
                        variant="underlined"
                        placeholder="Enter your password"
                        endContent={
                          <span
                            className="cursor-pointer text-[#888888]"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? <EyeSlash variant="Bold" /> : <Eye variant="Bold" />}
                          </span>
                        }
                       
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Password strength component */}
              <PasswordStrength
                password={form.watch('password')}
               
              />
            </div>

            {/* Terms and conditions notice */}
            <div className="w-full">
              <p className="text-xs text-gra-500">
                By continuing, you agree to the <span className="text-brand font-medium"><Link href='/terms'>Terms of Service</Link></span> and acknowledge you&apos;ve read our <span className="text-brand font-medium"><Link href='/privacy'>Privacy Policy</Link></span>.
              </p>
            </div>
          </div>

          {/* Submit button */}
          <Button
            endContent={<User size={18} variant="Bold" />}
            type="submit"
            aria-label="submit"
            color="primary"
            className="w-full py-6 text-lg md:text-xl text-white font-semibold"
            isLoading={isPending}
          >
            {isPending ? "Creating Account..." : "Create Account"}
          </Button>

          {/* Display error and success messages */}
          {error && (<FormError message={error} />)}
          {success && (<FormSuccess message={success} />)}
        </form>
      </Form>
    </CardWrapper>
  );
};

export default Step1Form; // Export the Step1Form component
