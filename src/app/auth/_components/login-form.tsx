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

// Interface defining the expected props for the component
interface LoginFormProps {
  ip: string; // IP address of the client
  pendingEmail?: any; // Optional pending email state
}

/**
 * LoginForm component handles the user login flow, including email, password,
 * and two-factor authentication handling.
 */
const LoginForm: FC<LoginFormProps> = ({ ip, pendingEmail }) => {
  const searchParams = useSearchParams(); // Hook to get query parameters from the URL
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Email already in use with different provider!" : ""; // Set error if OAuth account is not linked
  const [error, setError] = useState<string | undefined>(urlError); // State for error messages
  const [success, setSuccess] = useState<string | undefined>(""); // State for success messages
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state for form submission
  const [showPassword, setShowPassword] = useState<boolean>(false); // State to toggle password visibility
  const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false); // State to show two-factor authentication field
  const [isMobile, setIsMobile] = useState(false); // State to determine if the screen is mobile
  const router = useRouter(); // Hook for navigation
  const { update } = useSession(); // Session hook for user authentication
  const [isTypingEmail, setIsTypingEmail] = useState<boolean>(false); // State to check if email input is focused
  const [isTypingPassword, setIsTypingPassword] = useState<boolean>(false); // State to check if password input is focused

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

  // Hook to check if the screen is mobile
  useEffect(() => {
    const checkMobile: any = () => {
      setIsMobile(window.innerWidth < 767); // Set mobile state if screen width is less than 767px
    };

    checkMobile();
    window.addEventListener('resize', checkMobile); // Listen to window resize events

    return () => window.removeEventListener('resize', checkMobile); // Clean up event listener
  }, []);

  // Function to handle form submission
  const onSubmit: any = async (values: z.infer<typeof LoginSchema>) => {
    setError(""); // Clear previous errors
    setSuccess(""); // Clear previous success messages
    setIsLoading(true); // Set loading state

    try {
      const data = await login(values, ip); // Call login action with form values and IP address
      if (data?.error === "VERIFY_EMAIL") {
        router.push(`/auth/new-verify-email?email=${encodeURIComponent(values.email)}`); // Redirect if email verification is required
      } else if (data?.error) {
        setError(data.error); // Set error message if login fails
        setIsLoading(false);
      } else if (data?.success) {
        setSuccess("Login successful!"); // Show success message
        setIsLoading(false);
        await update(); // Update session on successful login
        router.push("/beams-today"); // Redirect to the main page
      } else if (data?.twoFactor) {
        setShowTwoFactor(true); // Show two-factor authentication field if required
        setIsLoading(false);
      }
    } catch (error) {
      setError("Something went wrong!"); // Handle unexpected errors
      setIsLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

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
              // Two-factor authentication code input
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        isRequired
                        label="Two-Factor Code"
                        classNames={{
                          label: 'w-32 font-medium',
                          mainWrapper: "w-full flex-1",
                          input: [
                            "placeholder:text-grey-2 text-xs",
                            'w-full flex-1 font-medium',
                          ],
                        }}
                        {...field}
                        type="text"
                        disabled={isLoading}
                        placeholder="Enter your code"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                          onFocus={() => setIsTypingEmail(true)}
                          onBlur={() => {
                            if (field.value.length === 0) {
                              setIsTypingEmail(false);
                            }
                          }}
                          onChange={(e) => {
                            field.onChange(e);
                            if (e.target.value.length === 0) setIsTypingEmail(false);
                          }}
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
                          onFocus={() => setIsTypingPassword(true)}
                          onBlur={() => {
                            if (field.value.length === 0) {
                              setIsTypingPassword(false);
                            }
                          }}
                          onChange={(e) => {
                            field.onChange(e);
                            if (e.target.value.length === 0) {
                              setIsTypingPassword(false);
                            }
                          }}
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
