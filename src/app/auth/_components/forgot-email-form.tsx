"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { ForgotEmailSchema, FirstNameSchema } from "@/schema/index";
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

const ForgotEmailForm = () => {
  const [error, setError] = useState<string | undefined>(""); 
  const [success, setSuccess] = useState<boolean>(false);
  const [maskedEmail, setMaskedEmail] = useState<string | undefined>(""); 
  const [maskedEmails, setMaskedEmails] = useState<string[]>([]); // To store multiple emails if necessary
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
  });

  const firstNameForm = useForm<z.infer<typeof FirstNameSchema>>({
    resolver: zodResolver(FirstNameSchema),
    defaultValues: {
      firstName: "",
    },
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

  // Handle security answers submission
  const onSubmitSecurityAnswers = (values: z.infer<typeof ForgotEmailSchema>) => {
    setError("");
    setSuccess(false);
    setMaskedEmail("");
    setUserFirstNames([]);
    setMaskedEmails([]); // Reset the masked emails state

    startTransition(() => {
      forgotEmail(values, firstName).then((data: any) => {
        if (data && data.success) {
          if (data.userFirstNames) {
            setUserFirstNames(data.userFirstNames);
            setFirstNameFormVisible(true); // Show first name form
          } else if (data.maskedEmails) {
            // Handle case when multiple emails are returned after first name match
            setMaskedEmails(data.maskedEmails);
            setFirstNameFormVisible(false);
          } else {
            setSuccess(true);
            setMaskedEmail(data.maskedEmail);
          }
        } else {
          setError(data?.error || "Failed to recover email.");
        }
      });
    });
  };

  // Handle first name submission
  const onSubmitFirstName = (values: z.infer<typeof FirstNameSchema>) => {
    setError(""); // Clear any previous errors
    startTransition(() => {
      forgotEmail({ 
        securityAnswer1: securityForm.getValues('securityAnswer1'), 
        securityAnswer2: securityForm.getValues('securityAnswer2') 
      }, values.firstName).then((data: any) => {
        if (data.success) {
          if (data.maskedEmails) {
            setMaskedEmails(data.maskedEmails);
            setFirstNameFormVisible(false);
          } else if (data.maskedEmail) {
            setSuccess(true);
            setMaskedEmail(data.maskedEmail);
          } else {
            setError("Failed to retrieve email.");
          }
        } else {
          // Explicitly handle the specific error message
          setError(data.error || "An unexpected error occurred.");
          // If you want to keep the first name form visible when this error occurs:
          setFirstNameFormVisible(true);
        }
      }).catch((err) => {
        setError("An error occurred while processing your request.");
        console.error(err);
      });
    });
  };
  return (
    <CardWrapper
      headerLabel={success ? "Email Found 🎉" : "Forgot Email 🤔"}
      subMessage={success ? "" : "Answer your security questions, and we'll help you find your email."}
      backButtonLabel={!success ? "Contact Us" : "Reset Password"} 
      backButtonHref={!success ? "/contact-us" : "/auth/reset"}
      backButtonPosition="bottom"
      backButtonSubText={
        !success
          ? "If you're still stuck, don't worry! You can always contact our support team for a helping hand."
          : "Forgot your password? No problem! Click below."
      }
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
        <>
          {firstNameFormVisible ? (
            <Form {...firstNameForm}>
              <form onSubmit={firstNameForm.handleSubmit(onSubmitFirstName)} className="space-y-8">
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
                  endContent={<Sms variant="Bold" />}
                  className="w-full font-semibold py-6 text-lg md:text-xl text-white"
                  isLoading={isPending}
                >
                  Confirm First Name
                </Button>
                {error && <FormError message={error} />}
              </form>
            </Form>
          ) : maskedEmails.length > 0 ? (
            <>
              <div className="text-center">
                <p className="text-lg font-medium text-text mb-6">
                  We have found multiple accounts associated with the data you provided. Yours would be one of the following:
                </p>
                <ul className="list-disc text-left px-8">
                  {maskedEmails.map((email, index) => (
                    <li key={index}>{email}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <Form {...securityForm}>
              <form onSubmit={securityForm.handleSubmit(onSubmitSecurityAnswers)} className="space-y-8">
                {securityQuestions.map((question, index) => (
                  <div key={index}>
                    <div className="flex w-full items-center justify-between">
                      <h1 className="text-left font-semibold text-xl">{question.question}</h1>
                      <Image src={question.image} alt="question" width={100} height={100} />
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
