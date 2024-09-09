"use client"; // Ensure the component runs on the client side

import { useForm } from "react-hook-form"; // Import React Hook Form for form handling
import * as z from "zod"; // Import Zod for schema validation
import { ForgotEmailSchema } from "@/schema/index"; // Import schema for form validation
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"; // Import custom form components
import { Button } from "@nextui-org/react"; // Import Button component from NextUI
import CardWrapper from "@/app/auth/_components/card-wrapper"; // Import CardWrapper for consistent UI
import { zodResolver } from "@hookform/resolvers/zod"; // Integrates Zod with React Hook Form
import { useState, useTransition } from "react"; // Import necessary React hooks
import { Input } from "@nextui-org/react"; // Input component from NextUI
import { forgotEmail } from "@/actions/auth/forgotEmail"; // Action for handling email recovery
import Link from "next/link"; // Link component for navigation
import FormError from "../../../components/form-error"; // Component for displaying form errors
import { Sms } from "iconsax-react"; // Icon for form button
import Image from "next/image"; // Next.js optimized image component
import { RiLoginCircleFill } from "react-icons/ri"; // Icon for login button

/**
 * ForgotEmailForm component allows users to recover their email
 * by answering predefined security questions.
 */
const ForgotEmailForm = () => {
  const [error, setError] = useState<string | undefined>(""); // State to track error messages
  const [success, setSuccess] = useState<boolean>(false); // State to track success status
  const [maskedEmail, setMaskedEmail] = useState<string | undefined>(""); // State to hold the masked email
  const [isPending, startTransition] = useTransition(); // Hook to handle transition state

  // Setting up the form with Zod schema validation
  const form = useForm<z.infer<typeof ForgotEmailSchema>>({
    resolver: zodResolver(ForgotEmailSchema),
    defaultValues: {
      securityAnswer1: "",
      securityAnswer2: "",
    },
  });

  // Predefined security questions for the user
  const securityQuestions = [
    {
      question: "What was your first pet's name?", 
      image: "https://res.cloudinary.com/drlyyxqh9/image/upload/v1725430098/authentication/cat-3d-1_sjfydd.webp"
    },
    {
      question: "What is your mother's maiden name?", 
      image: "https://res.cloudinary.com/drlyyxqh9/image/upload/v1725430100/authentication/mom-3d-1_hslv73.webp"
    }
  ];

  // Function to handle form submission
  const onSubmit = (values: z.infer<typeof ForgotEmailSchema>) => {
    setError("");
    setSuccess(false);
    setMaskedEmail("");
    startTransition(() => {
      forgotEmail(values).then((data) => {
        if (data && data.success) {
          setSuccess(true); // Set success to true if email recovery is successful
          setMaskedEmail(data.maskedEmail); // Set the masked email returned by the server
        } else {
          setError(data?.error || "Failed to recover email."); // Set error message if recovery fails
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLabel={success ? "Email Found 🎉" : "Forgot Email 🤔"} // Conditional header based on success
      subMessage={success ? "" : "Answer your security questions, and we'll help you find your email."} // Conditional sub-message
      backButtonLabel={!success ? "Contact Us" : "Reset Password"} // Conditional back button label
      backButtonHref={!success ? "/contact-us" : "/auth/reset"} // Conditional back button href
      backButtonPosition="bottom" // Position the back button at the bottom
      backButtonSubText={
        !success
          ? "If you're still stuck, don't worry! You can always contact our support team for a helping hand."
          : "Forgot your password? No problem! Click below."
      } // Conditional back button subtext
    >
      {success ? (
        <div className="text-center">
          <Image
            className="mx-auto mb-6"
            priority
            alt="password"
            src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1725433680/authentication/email-found-3d_abjjme.webp"
            width={180}
            height={200}
          />
          <p className="text-lg font-medium text-text mb-6">
            Great Job! We&apos;ve found your email: <strong className="font-bold text-secondary-2">{maskedEmail}</strong>
          </p>
          <Link href="/auth/login" passHref>
            <Button 
              color="primary" 
              endContent={<RiLoginCircleFill />} 
              className="w-full font-semibold text-white text-lg py-6 md:text-xl mb-4"
            >
              Go to Login
            </Button>
          </Link>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Iterate over security questions */}
            {securityQuestions.map((question, index) => (
              <div key={index}>
                <div className="flex w-full items-center justify-between">
                  <h1 className="text-left font-semibold text-xl">{question.question}</h1>
                  <Image src={question.image} alt="question" width={100} height={100} />
                </div>
                <FormField
                  control={form.control}
                  name={`securityAnswer${index + 1}` as "securityAnswer1" | "securityAnswer2"}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          isRequired
                          placeholder="Enter your answer"
                          variant="underlined"
                          classNames={{
                            input: [
                              "placeholder:text-grey-2",
                              'w-full font-medium',
                            ],
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            {/* Submit button */}
            <Button
              type="submit"
              color="primary"
              endContent={<Sms variant="Bold" />}
              className="w-full font-semibold py-6 text-lg md:text-xl text-white"
              isLoading={isPending}
            >
              Show Me My Email
            </Button>
            {error && <FormError message={error} />} {/* Display error message if present */}
          </form>
        </Form>
      )}
    </CardWrapper>
  );
};

export default ForgotEmailForm; // Export the component
