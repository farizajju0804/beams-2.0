"use client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ForgotEmailSchema } from "@/schema/index";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ForgotEmailSchema>>({
    resolver: zodResolver(ForgotEmailSchema),
    defaultValues: {
      securityAnswer1: "",
      securityAnswer2: "",
    },
  });
  const securityQuestions = [
    {question : "What was your first pet's name?", image :"https://res.cloudinary.com/drlyyxqh9/image/upload/v1725430098/authentication/cat-3d-1_sjfydd.webp" },
    {question : "What is your mother's maiden name?", image : "https://res.cloudinary.com/drlyyxqh9/image/upload/v1725430100/authentication/mom-3d-1_hslv73.webp"}
  ];

  const onSubmit = (values: z.infer<typeof ForgotEmailSchema>) => {
    setError("");
    setSuccess(false);
    setMaskedEmail("");
    startTransition(() => {
      forgotEmail(values).then((data) => {
        if (data && data.success) {
          setSuccess(true);
          setMaskedEmail(data.maskedEmail);
        } else {
          setError(data?.error || "Failed to recover email.");
        }
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
      backButtonSubText={!success ? "If you're still stuck, don't worry! You can always contact our support team for a helping hand. " : "Forgot your password? No problem! Click below to reset."}
    >
      {success ? (
        <div className="text-center">
          <Image
            className="mx-auto mb-6"
            priority
            alt="password"
            src={"https://res.cloudinary.com/drlyyxqh9/image/upload/v1725433680/authentication/email-found-3d_abjjme.webp"}
            width={180}
            height={200}
          />
          <p className="text-lg font-medium text-text mb-6">
            Great Job! We&apos;have uncovered your email: <strong className="font-bold text-secondary-2">{maskedEmail}</strong>
          </p>
          <Link href="/auth/login" passHref>
            <Button color="primary" endContent={<RiLoginCircleFill/>} className="w-full font-semibold text-white text-lg py-6 md:text-xl mb-4">
              Go to Login
            </Button>
          </Link>
        </div>
      ) : (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
       
          {securityQuestions.map((question, index) => (
         
          <>
            <div className="flex w-full items-center justify-between">
              <h1 className="text-left font-semibold text-xl">{question.question}</h1>
              <Image src={question.image} alt="question" width={100} height={100} />
            </div>
            <FormField
              key={index}
              control={form.control}
              name={`securityAnswer${index + 1}` as "securityAnswer1" | "securityAnswer2"}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      isRequired
                      // label={question}
                      placeholder={'Enter your answer'}
                      variant="underlined"
                      // labelPlacement="outside"
                   
                      classNames={{
                        // label: 'font-medium',
                        // inputWrapper: "w-full flex-1",
                        // base :"mb-4",
                        input: [
                          "placeholder:text-grey-2",
                          'w-full  font-medium'
                        ]
                      }}
                   
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
               
              )}
            />
          </>
          ))}
            <Button
              type="submit"
              color="primary"
              endContent={<Sms variant="Bold"/>}
              className="w-full font-semibold py-6 text-lg md:text-xl text-white"
              isLoading={isPending}
            >
              Show Me My Email
            </Button>
            {error && <FormError message={error} />}
          </form>
        </Form>
      )}
    </CardWrapper>
  );
};

export default ForgotEmailForm;
