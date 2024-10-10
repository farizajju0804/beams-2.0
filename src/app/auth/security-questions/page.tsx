"use client"; // Ensures the component runs on the client side
import React, { useState, useTransition } from "react"; // Import React, useState, and useTransition
import { useForm } from "react-hook-form"; // Import useForm hook for form management
import * as z from "zod"; // Import Zod for schema validation
import { zodResolver } from "@hookform/resolvers/zod"; // Import Zod resolver for react-hook-form
import { SecuritySchema } from "@/schema"; // Import validation schema for security questions
import { Input } from "@nextui-org/react"; // Import Input component from NextUI
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"; // Custom Form components
import { Button } from "@nextui-org/react"; // Import Button component from NextUI
import { submitSecurityAnswers } from "@/actions/auth/register"; // Action to submit security answers
import { useEmailStore } from "@/store/email"; // Zustand store for managing email
import { useRouter, useSearchParams } from "next/navigation"; // Import hooks for router and query parameters
import CardWrapper from "@/app/auth/_components/card-wrapper"; // Card wrapper for UI consistency
import RegisterSide from "../_components/RegisterSide"; // Import RegisterSide for UI
import { ShieldTick } from "iconsax-react"; // Import ShieldTick icon
import Image from "next/image"; // Import Next.js optimized image component
import FormError from "@/components/form-error";
import { useSession } from "next-auth/react";

// Array of security questions with corresponding images
const securityQuestions = [
  {question : "What was your first pet's name?", image :"https://res.cloudinary.com/drlyyxqh9/image/upload/v1725430098/authentication/cat-3d-1_sjfydd.webp" },
  {question : "What is your mother's maiden name?", image : "https://res.cloudinary.com/drlyyxqh9/image/upload/v1725430100/authentication/mom-3d-1_hslv73.webp"}
];

/**
 * Step3Form is a functional component that handles security questions
 * in the registration process. It retrieves the email from the URL,
 * and upon submitting valid answers, navigates the user to the next step.
 */
const Step3Form: React.FC = ({ }) => {
  const [isPending, startTransition] = useTransition(); // Hook to manage transitions and loading state
  const searchParams = useSearchParams(); // Get URL search params
  const emailFromUrl = searchParams.get("email"); // Extract the email from URL params
  const email:any = emailFromUrl; // Typecast email
  const router = useRouter(); // Next.js router hook
  const [error, setError] = useState("")
  const { update } = useSession();
  // Initialize form with Zod schema and react-hook-form integration
  const form = useForm<z.infer<typeof SecuritySchema>>({
    resolver: zodResolver(SecuritySchema), // Using Zod as the form validation schema
    mode: "onSubmit", // Validate only on form submission
    reValidateMode: "onSubmit", // Re-validate only on submit
  });

  // Function to handle form submission
  const onSubmit = async (values: z.infer<typeof SecuritySchema>) => {
    if (!email) {
      console.error("Email not found. Please go back and enter your email.");
      return; // Stop if email is not found
    }

    startTransition(async () => {
      try {
        const result = await submitSecurityAnswers(values, email); // Submit security answers
        if (result.success) {
        await update(); 
        router.push('/access-code'); 
        }
        if(result?.error)
        {
          setError(error)
        }
      } catch (err) {
        console.error("Error submitting security answers:", err); // Log error on failure
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 md:min-h-screen w-full ">
      {/* Left-side component */}
      <RegisterSide/>
      {/* Right-side form component */}
      <div className="w-full md:pt-6 lg:pt-0 lg:min-h-screen flex items-center justify-center">
        <CardWrapper headerLabel="Security Questions 🛡️" subMessage="Answer This And Help Us Keep Your Future Self From Saying, 'I Forgot My Credentials!' 😅">
          {/* Render form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              {/* Map through the security questions and render input fields */}
              {securityQuestions.map((question, index) => (
                <>
                  <div className="flex w-full items-center justify-between">
                    <h1 className="text-left font-semibold text-xl">{question.question}</h1>
                    <Image src={question.image} alt="question" width={100} height={100} /> {/* Display question image */}
                  </div>
                  <FormField
                    key={index}
                    control={form.control} // Connect the input to form control
                    name={`securityAnswer${index + 1}` as "securityAnswer1" | "securityAnswer2"} // Field name based on index
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field} // Spread form field props
                            isRequired
                            placeholder={'Enter your answer'}
                            variant="underlined" // Underlined input variant
                            classNames={{
                              input: [
                                "placeholder:text-grey-2", // Placeholder styling
                                'w-full  font-medium' // Input field styling
                              ]
                            }}
                          />
                        </FormControl>
                        <FormMessage /> {/* Display validation messages */}
                      </FormItem>
                    )}
                  />
                </>
              ))}
              {/* Submit button */}
              <FormError message={error} />
              <Button
                type="submit"
                color="primary"
                endContent={<ShieldTick variant="Bold"/>} // Button end icon
                className="w-full text-white font-semibold py-6 text-lg md:text-xl"
                isLoading={isPending} // Show loading state while submitting
              >
                {isPending ? "Securing..." : "Secure Me"} {/* Button text based on loading state */}
              </Button>
            </form>
          </Form>
        </CardWrapper>
      </div>
    </div>
  );
};

export default Step3Form; // Export component
