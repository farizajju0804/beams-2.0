"use client"; // Ensures this component runs on the client side

import React, { FC, useEffect, useState } from "react"; // Import React hooks for state and lifecycle management
import { useForm } from "react-hook-form"; // Import React Hook Form for form handling
import * as z from "zod"; // Import Zod for schema validation
import { LoginSchema } from "@/schema/index"; // Import the Login schema for validation
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"; // Import custom form components
import { Button, Input } from "@nextui-org/react"; // Import Input and Button components from NextUI
import { Eye, EyeSlash, Sms } from "iconsax-react"; // Icons for UI
import { login } from "@/actions/auth/login"; // Action to handle login logic
import { useRouter, useSearchParams } from "next/navigation"; // Hooks for routing and query parameters
import FormError from "@/components/form-error"; // Component to display form errors
import FormSuccess from "@/components/form-success"; // Component to display success messages
import CardWrapper from "@/app/auth/_components/card-wrapper"; // Card wrapper for consistent UI
import { zodResolver } from "@hookform/resolvers/zod"; // Resolver to integrate Zod with React Hook Form
import Link from "next/link"; // Link component for navigation
import { useSession } from "next-auth/react"; // Hook to manage authentication session
import { RiLoginCircleFill } from "react-icons/ri"; // Icon for login button
import RedirectMessage from "@/components/Redirection";

// Interface defining the expected props for the component
interface LoginFormProps {
  ip: string; // IP address of the client
}

/**
 * LoginForm component handles the user login flow, including email, password,
 * and two-factor authentication handling.
 */
const LoginForm: FC<LoginFormProps> = ({ ip }) => {
  const searchParams = useSearchParams(); // Hook to get query parameters from the URL

  const [error, setError] = useState<string | undefined>(''); // State for error messages
  const [success, setSuccess] = useState<string | undefined>(""); // State for success messages
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state for form submission
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false); // Loading state for form submission
  const [showPassword, setShowPassword] = useState<boolean>(false); // State to toggle password visibility
  const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false); // State to show two-factor authentication field

  const router = useRouter(); // Hook for navigation

  const [userEmail, setUserEmail] = useState<string>("");
  // Set up the form using React Hook Form with Zod schema for validation
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema), // Zod schema for form validation
    mode: "onSubmit", // Validate only on form submission
    reValidateMode: "onSubmit", // Re-validate on form submission
    defaultValues: {
      email: "", // Initial value for email
      password: "", // Initial value for password
      code: "", // Field for two-factor authentication code
    },
  });

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      let errorMessage = "";
      if (errorParam === "OAuthAccountNotLinked") {
        errorMessage = "Email already in use with a different provider!";
      } else if (errorParam === "AccessDenied") {
        errorMessage = "Your account is banned or access was denied!";
      }
      setError(errorMessage);

      // Remove the error parameter from the URL
      router.replace('/auth/login');
    }
  }, [searchParams, router]);
  // Hook to check if the screen is mobile


  // Function to handle form submission
  const onSubmit: any = async (values: z.infer<typeof LoginSchema>) => {
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success messages
    setIsLoading(true); // Set loading state
    if (showTwoFactor && (!values.code || values.code.length !== 6)) {
      setError("Please enter a valid 6-digit code");
      setIsLoading(false);
      return;
    }
    try {
      const data = await login(values, ip); // Call login action with form values and IP address
     
      if (data?.error === "VERIFY_EMAIL") {
        router.push(`/auth/new-verify-email?email=${encodeURIComponent(values.email)}`); // Redirect if email verification is required
      } 
      else if (data?.error === "SET_SECURITY_ANSWERS") {
        router.push(`/auth/security-questions?email=${encodeURIComponent(values.email)}`);
      }
      else if (data?.error) {
        setError(data.error); // Set error message if login fails
        setIsLoading(false);
      } else if (data?.success) {
        setSuccess("Login successful!"); // Show success message
       
        setIsLoading(false);
        setIsRedirecting(true)
        router.push("/beams-today"); // Redirect to the main page
      } else if (data?.twoFactor) {
        setShowTwoFactor(true); // Show two-factor authentication field if required
        setUserEmail(values.email);
        setIsLoading(false);
      }
    } catch (error) {
      setError("Something went wrong!"); // Handle unexpected errors
      setIsLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);


  if(isRedirecting){
    return <RedirectMessage/>
  }

  
  return (
    <CardWrapper
      headerLabel="Login 🔓"
      backButtonLabel="Sign Up"
      backButtonHref="/auth/register"
      backButtonSubText="No account?"
      showSocial // Show social login options
      backButtonPosition="top" // Position back button at the top
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col gap-6">
          {showTwoFactor && (
              <>
                <div className="text-center mb-4">
                  <p className="text-lg font-semibold mb-2">Just One More Step! 🚀</p>
                  <p className="text-md text-grey-2 mb-2">
                    We&apos;ve sent a code to:
                  </p>
                  <p className="font-bold text-primary text-lg mb-4">{userEmail}</p>
                  <p className="text-sm text-grey-4">
                    Check your inbox and enter the code below to unlock your account.
                  </p>
                </div>
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          isRequired
                          variant="underlined"
                          label="Verification Code"
                          classNames={{
                            label: 'font-semibold text-text',
                            mainWrapper: "w-full flex-1",
                            inputWrapper: "h-12",
                            input: [
                              "placeholder:text-grey-2",
                              'w-full flex-1 font-medium',
                            ],
                          }}
                          {...field}
                          type="text"
                          disabled={isLoading}
                          labelPlacement="outside"
                          placeholder="Enter the 6-digit code"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {!showTwoFactor && (
              <>
                {/* Email input field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          isRequired
                          label="Email Address"
                          classNames={{
                            label: 'font-semibold  text-text',
                            mainWrapper: "w-full flex-1",
                            inputWrapper: "h-12",
                            input: [
                              "placeholder:text-grey-2",
                              'w-full flex-1 font-medium',
                            ],
                          }}
                          {...field}
                          type="email"
                          variant="underlined"
                          labelPlacement="outside"
                          placeholder="Enter your email"
                          disabled={isLoading}
        
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Password input field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          isRequired
                          autoComplete="current-password"
                          variant="underlined"
                          classNames={{
                            label: 'font-semibold text-text',
                            mainWrapper: "w-full flex-1",
                            inputWrapper: "h-12",
                            input: [
                              "placeholder:text-grey-2",
                              'w-full flex-1 font-medium',
                            ],
                          }}
                          label="Password"
                          {...field}
                          type={showPassword ? "text" : "password"}
                          disabled={isLoading}
                          labelPlacement="outside"
                          placeholder="Enter your password"
                          endContent={
                            <span
                              className="cursor-pointer text-[#888888]"
                              onClick={togglePasswordVisibility}
                            >
                              {showPassword ? <EyeSlash variant="Bold" size={18} /> : <Eye variant="Bold" size={18} />}
                            </span>
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {/* Links for "Forgot password" and "Forgot email" */}
            
            <div className="w-full flex justify-between lg:px-0">
              <Link className="font-medium text-gray-400 text-sm" href="/auth/reset">Forgot password?</Link>
              <Link className="font-medium text-gray-400 text-sm" href="/auth/forgot-identifiers">Forgot email?</Link>
            </div>
          </div>
          {/* Submit button */}
          <Button
            endContent={<RiLoginCircleFill />}
            type="submit"
            color="primary"
            className="w-full text-lg lg:text-xl text-white py-6 font-semibold"
            isLoading={isLoading}
          >
            {showTwoFactor ? "Confirm" : "Login"}
          </Button>
          {error && <FormError message={error} />} {/* Show error message if present */}
          {success && <FormSuccess message={success} />} {/* Show success message if present */}
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm; // Export the LoginForm component as default
