"use client";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SecuritySchema } from "@/schema";
import { Input } from "@nextui-org/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@nextui-org/react";
import { submitSecurityAnswers } from "@/actions/auth/register";
import { useEmailStore } from "@/store/email";
import { useRouter, useSearchParams } from "next/navigation"; 
import CardWrapper from "@/app/auth/_components/card-wrapper";
import RegisterSide from "../_components/RegisterSide";
import { ShieldTick } from "iconsax-react";
import Image from "next/image";



const securityQuestions = [
  {question : "What was your first pet's name?", image :"https://res.cloudinary.com/drlyyxqh9/image/upload/v1725430098/authentication/cat-3d-1_sjfydd.webp" },
  {question : "What is your mother's maiden name?", image : "https://res.cloudinary.com/drlyyxqh9/image/upload/v1725430100/authentication/mom-3d-1_hslv73.webp"}
];

const Step3Form: React.FC = ({ }) => {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email");
  const email:any = emailFromUrl;
  const router = useRouter();

  const form = useForm<z.infer<typeof SecuritySchema>>({
    resolver: zodResolver(SecuritySchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onSubmit = async (values: z.infer<typeof SecuritySchema>) => {
    if (!email) {
      console.error("Email not found. Please go back and enter your email.");
      return;
    }

    startTransition(async () => {
      try {
        
        const result = await submitSecurityAnswers(values, email);
        if (result) {
          router.push('/user-info')
          
        
        }
      } catch (err) {
        console.error("Error submitting security answers:", err);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 md:min-h-screen w-full ">
    <RegisterSide/>
    <div className="w-full md:pt-6 lg:pt-0 lg:min-h-screen flex items-center justify-center">
    <CardWrapper headerLabel="Security Questions 🛡️" subMessage="Answer This And Help Us Keep Your Future Self From Saying, 'I Forgot My Credentials!' 😅">
     
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
       
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
            endContent={<ShieldTick variant="Bold"/>}
            className="w-full text-white font-semibold py-6 text-lg md:text-xl"
            isLoading={isPending}
          >
            {isPending ? "Securing..." : "Secure Me"}
          </Button>
         
        </form>
      </Form>
    </CardWrapper>
    </div>
    </div>
  );
};

export default Step3Form;
