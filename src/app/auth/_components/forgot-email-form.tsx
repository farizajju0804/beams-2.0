"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@nextui-org/react";
import CardWrapper from "@/app/auth/_components/card-wrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { Input } from "@nextui-org/react";
import { forgotEmail } from "@/actions/auth/forgotEmail";
import Link from "next/link";
import FormError from "../../../components/form-error";
import { Sms } from "iconsax-react";
import Image from "next/image";
import { RiLoginCircleFill } from "react-icons/ri";

// Validation schemas remain the same
const ForgotEmailSchema = z.object({
  securityAnswer1: z.string()
  .min(1, "Answer must be at least 1 character")
  .max(20, "Answer cannot exceed 20 characters")
  .trim()
  .refine((val) => val.length > 0, "Security answer is required")
  .refine(
  (val) => /^[a-zA-Z0-9\s]+$/.test(val), 
  "Answer cannot contain special characters"
  ),
securityAnswer2: z.string()
  .min(1, "Answer must be at least 1 character")
  .max(20, "Answer cannot exceed 20 characters")
  .trim()
  .refine((val) => val.length > 0, "Security answer is required")
  .refine(
  (val) => /^[a-zA-Z0-9\s]+$/.test(val),
  "Answer cannot contain special characters"
  ),
});

const FirstNameSchema = z.object({
  firstName: z.string()
    .min(2, "First name must be at least 2 characters")
    .max(20, "First name cannot exceed 20 characters")
    .trim()
    .refine((val) => val.length > 0, "First name is required"),
});

const ForgotEmailForm = () => {
  // State declarations remain the same
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [maskedEmail, setMaskedEmail] = useState<string | undefined>("");
  const [maskedEmails, setMaskedEmails] = useState<string[]>([]);
  const [userFirstNames, setUserFirstNames] = useState<string[]>([]);
  const [firstNameFormVisible, setFirstNameFormVisible] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const securityForm = useForm<z.infer<typeof ForgotEmailSchema>>({
    resolver: zodResolver(ForgotEmailSchema),
    defaultValues: {
      securityAnswer1: "",
      securityAnswer2: "",
    },
    mode: "onBlur",
  });

  const firstNameForm = useForm<z.infer<typeof FirstNameSchema>>({
    resolver: zodResolver(FirstNameSchema),
    defaultValues: {
      firstName: "",
    },
    mode: "onBlur",
  });

  const securityQuestions = [
    {
      question: "What was your first pet's name?",
      image: "https://res.cloudinary.com/drlyyxqh9/image/upload/v1725430098/authentication/cat-3d-1_sjfydd.webp",
    },
    {
      question: "What is your mother's maiden name?",
      image: "https://res.cloudinary.com/drlyyxqh9/image/upload/v1725430100/authentication/mom-3d-1_hslv73.webp",
    },
  ];

  // Submit handlers remain the same
  const onSubmitSecurityAnswers = async (values: z.infer<typeof ForgotEmailSchema>) => {
    try {
      const validatedData = ForgotEmailSchema.parse(values);
      setError("");
      setSuccess(false);
      setMaskedEmail("");
      setUserFirstNames([]);
      setMaskedEmails([]);

      startTransition(() => {
        forgotEmail(validatedData, firstName).then((data: any) => {
          if (data?.success) {
            if (data.userFirstNames) {
              setUserFirstNames(data.userFirstNames);
              setFirstNameFormVisible(true);
            } else if (data.maskedEmails) {
              setMaskedEmails(data.maskedEmails);
              setFirstNameFormVisible(false);
              setSuccess(true); // Set success to true for consistent UI
            } else {
              setSuccess(true);
              setMaskedEmail(data.maskedEmail);
            }
          } else {
            setError(data?.error || "Failed to recover email.");
          }
        });
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const onSubmitFirstName = async (values: z.infer<typeof FirstNameSchema>) => {
    try {
      const validatedData = FirstNameSchema.parse(values);
      setError("");

      startTransition(() => {
        forgotEmail({
          securityAnswer1: securityForm.getValues('securityAnswer1'),
          securityAnswer2: securityForm.getValues('securityAnswer2')
        }, validatedData.firstName).then((data: any) => {
          if (data.success) {
            if (data.maskedEmails) {
              setMaskedEmails(data.maskedEmails);
              setFirstNameFormVisible(false);
              setSuccess(true); // Set success to true for consistent UI
            } else if (data.maskedEmail) {
              setSuccess(true);
              setMaskedEmail(data.maskedEmail);
            } else {
              setError("Failed to retrieve email.");
            }
          } else {
            setError(data.error || "An unexpected error occurred.");
            setFirstNameFormVisible(true);
          }
        }).catch((err) => {
          setError("An error occurred while processing your request.");
          console.error(err);
        });
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  // Helper function to render success UI
  const renderSuccessUI = () => (
    <div className="text-center">
      <Image
        className="mx-auto mb-6"
        priority
        alt="password"
        src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1725433680/authentication/email-found-3d_abjjme.webp"
        width={180}
        height={200}
      />
      {maskedEmails.length > 0 ? (
        <>
          <p className="text-lg font-medium text-text mb-6">
            We found multiple accounts associated with your details:
          </p>
          <ul className="list-disc text-left px-8 mb-6">
            {maskedEmails.map((email, index) => (
              <li key={index} className="font-bold text-secondary-2">{email}</li>
            ))}
          </ul>
        </>
      ) : (
        <p className="text-lg font-medium text-text mb-6">
          Great Job! We&apos;ve found your email: <strong className="font-bold text-secondary-2">{maskedEmail}</strong>
        </p>
      )}
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
  );

  return (
    <CardWrapper
      headerLabel={success || maskedEmails.length > 0 ? "Email Found 🎉" : "Forgot Email 🤔"}
      subMessage={
        !success && !firstNameFormVisible && maskedEmails.length === 0
          ? "Answer your security questions, and we'll help you find your email."
          : ""
      }
      backButtonLabel={!success && maskedEmails.length === 0 ? "Contact Us" : "Reset Password"}
      backButtonHref={!success && maskedEmails.length === 0 ? "/contact-us" : "/auth/reset"}
      backButtonPosition="bottom"
      backButtonSubText={
        !success && maskedEmails.length === 0
          ? "If you're still stuck, don't worry! You can always contact our support team for a helping hand."
          : "Forgot your password? No problem! Click below."
      }
    >
      {success || maskedEmails.length > 0 ? (
        renderSuccessUI()
      ) : (
        <>
          {firstNameFormVisible ? (
            <Form {...firstNameForm}>
              <form
                onSubmit={firstNameForm.handleSubmit(onSubmitFirstName)}
                className="space-y-8"
                noValidate
              >
                <FormField
                  control={firstNameForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <label htmlFor="firstName">
                        Multiple users found. Please enter your first name:
                      </label>
                      <FormControl>
                        <Input
                          {...field}
                          isRequired
                      autoComplete="name"
                          aria-label="first-name"
                          className="mt-4"
                          placeholder="Enter your first name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  color="primary"
                  aria-label="submit"
                  endContent={<Sms variant="Bold" />}
                  className="w-full font-semibold py-6 text-lg md:text-xl text-white"
                  isLoading={isPending}
                >
                  Confirm First Name
                </Button>
                {error && <FormError message={error} />}
              </form>
            </Form>
          ) : (
            <Form {...securityForm}>
              <form
                onSubmit={securityForm.handleSubmit(onSubmitSecurityAnswers)}
                className="space-y-8"
                noValidate
              >
                {securityQuestions.map((question, index) => (
                  <div key={index}>
                    <div className="flex w-full items-center justify-between">
                      <h1 className="text-left font-semibold text-xl">{question.question}</h1>
                      <Image priority  src={question.image} alt="question" width={100} height={100} />
                    </div>
                    <FormField
                      control={securityForm.control}
                      name={`securityAnswer${index + 1}` as "securityAnswer1" | "securityAnswer2"}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              isRequired
                              aria-label="answer"
                              autoComplete="answer"
                              placeholder="Enter your answer"
                              variant="underlined"
                              classNames={{
                                input: [
                                  "placeholder:text-grey-2",
                                  "w-full font-medium",
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
                <Button
                  type="submit"
                  color="primary"
                  aria-label="submit"
                  endContent={<Sms variant="Bold" />}
                  className="w-full font-semibold py-6 text-lg md:text-xl text-white"
                  isLoading={isPending}
                >
                  Show Me My Email
                </Button>
                {error && <FormError message={error} />}
              </form>
            </Form>
          )}
        </>
      )}
    </CardWrapper>
  );
};

export default ForgotEmailForm;