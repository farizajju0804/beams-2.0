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
import { useRouter } from "next/navigation"; // Import Next.js router
import CardWrapper from "./card-wrapper";
import Stepper from "./Stepper";

interface Step3Props {
  onNext: () => void;
}

const securityQuestions = [
  "What was your first pet's name?",
  "What is your mother's maiden name?",
];

const Step3Form: React.FC<Step3Props> = ({ onNext }) => {
  const [isPending, startTransition] = useTransition();
  const emailFromStore = useEmailStore((state: any) => state.email);
  const email = emailFromStore || (typeof window !== "undefined" ? localStorage.getItem("email") : "");
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
        onNext(); 
        const result = await submitSecurityAnswers(values, email);
        if (result.success) {
          onNext(); 
        
        }
      } catch (err) {
        console.error("Error submitting security answers:", err);
      }
    });
  };

  return (
    <CardWrapper headerLabel="Security Questions">
      {/* <Stepper currentStep={4} totalSteps={4} stepLabels={ ["Account Info", "Email Verification", "User Info", "Security Questions"]} /> */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
       
          {securityQuestions.map((question, index) => (
          // <div className="space-y-8">
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
                      label={question}
                      placeholder={`Security Question ${index + 1}`}
                      labelPlacement="outside"
                   
                      classNames={{
                        label: 'font-medium',
                        // inputWrapper: "w-full flex-1",
                        // base :"mb-4",
                        input: [
                          "placeholder:text-grey-2 text-xs",
                          'w-full  font-medium'
                        ]
                      }}
                   
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
               
              )}
            />
            // </div>
          ))}
          <Button
            type="submit"
            color="primary"
            className="w-full text-white font-medium"
            isLoading={isPending}
          >
            {isPending ? "Submitting..." : "Submit"}
          </Button>
         
        </form>
      </Form>
    </CardWrapper>
  );
};

export default Step3Form;
