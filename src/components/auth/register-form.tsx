'use client';

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, SecuritySchema } from "@/schema";
import { Input } from "@nextui-org/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import CardWrapper from "@/components/auth/card-wrapper";
import { Button } from "@nextui-org/react";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import { register, submitSecurityAnswers } from "@/actions/auth/register";
import PasswordStrength from "./PasswordStrength2";
import { Eye, EyeSlash, Key, Sms, User } from "iconsax-react";

const securityQuestions = [
  'What was your first pet\'s name?',
  'What is your mother\'s maiden name?',
];

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [showSecurityQuestions, setShowSecurityQuestions] = useState(false);
  const [email, setEmail] = useState<string | undefined>("");
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    mode: "onSubmit", // Validation messages appear only on form submission
    reValidateMode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const securityForm = useForm<z.infer<typeof SecuritySchema>>({
    resolver: zodResolver(SecuritySchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      securityAnswer1: "",
      securityAnswer2: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");
    setEmail(values.email);

    startTransition(() => {
      register(values).then((data) => {
        if (data?.error) {
          setError(data.error);
        } else {
          setShowSecurityQuestions(true);
        }
      });
    });
  };

  const onSubmitSecurity = (values: z.infer<typeof SecuritySchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      submitSecurityAnswers(values, email as string).then((data) => {
        if (data?.error) {
          setError(data.error);
        } else {
          setSuccess(data.success);
        }
      });
    });
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
      showSocial
    >
      {!showSecurityQuestions ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        isRequired
                        labelPlacement="outside-left"
                        classNames={{
                          label: 'w-20',
                          mainWrapper: "w-full flex-1",
                          input: [
                            "placeholder:text-grey-2 text-xs",
                            'w-full flex-1'
                          ]
                        }}
                        {...field}
                        disabled={isPending}
                        label="Name"
                        placeholder="Enter your name"
                        startContent={
                          <User variant="Bold" className="text-secondary-2" size={20} />
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        isRequired
                        labelPlacement="outside-left"
                        classNames={{
                          label: 'w-20',
                          mainWrapper: "w-full flex-1",
                          input: [
                            "placeholder:text-grey-2 text-xs",
                            'w-full flex-1'
                          ]
                        }}
                        {...field}
                        type="email"
                        disabled={isPending}
                        label="Email"
                        placeholder="Enter your email"
                        startContent={
                          <Sms variant="Bold" className="text-secondary-2" size={20} />
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative w-full no-scrollbar">
                        <Input
                          isRequired
                          labelPlacement="outside-left"
                          classNames={{
                            label: 'w-20',
                            mainWrapper: "w-full flex-1",
                            input: [
                              "placeholder:text-grey-2 text-xs",
                              'w-full flex-1'
                            ]
                          }}
                          {...field}
                          type={showPassword ? "text" : "password"}
                          disabled={isPending}
                          label="Password"
                          placeholder="Enter a password"
                          startContent={
                            <Key variant="Bold" className="text-secondary-2" size={20} />
                          }
                          endContent={
                            <span
                              className="cursor-pointer text-[#888888]"
                              onClick={togglePasswordVisibility}
                            >
                              {showPassword ? (
                                <EyeSlash variant="Bold" size={20} />
                              ) : (
                                <Eye variant="Bold" size={20} />
                              )}
                            </span>
                          }
                          onFocus={() => setPasswordFocused(true)}
                          onBlur={() => setPasswordFocused(false)}
                        />
                      </div>
                    </FormControl>
                    {passwordFocused && (
                      <PasswordStrength
                        password={form.watch('password')}
                        onClose={() => setPasswordFocused(false)}
                        showCrackTime={true} // Pass true if you want to show cracking time
                      />
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {error && (<FormError message={error} />)}
            {success && (<FormSuccess message={success} />)}
            <Button disabled={isPending} color="primary" type="submit" className="w-full text-white font-medium" >
              Create an account
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...securityForm}>
          <form onSubmit={securityForm.handleSubmit(onSubmitSecurity)} className="space-y-6">
            <div className="space-y-4">
              {securityQuestions.map((question, index) => (
                <FormField
                  key={index}
                  control={securityForm.control}
                  name={`securityAnswer${index + 1}` as "securityAnswer1" | "securityAnswer2"}
                  render={({ field }) => (
                    <FormItem className="">
                      <FormControl>
                        <Input
                          isRequired
                          labelPlacement="outside"
                          classNames={{
                            // label: 'w-20',
                            mainWrapper: "w-full my-3",
                            input: [
                              "placeholder:text-grey-2 text-xs",
                              'w-full flex-1'
                            ]
                          }}
                          {...field}
                          disabled={isPending}
                          label={question}
                          placeholder={`Answer ${index + 1}`}
                        
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            {error && (<FormError message={error} />)}
            {success && (<FormSuccess message={success} />)}
          
            <Button disabled={isPending} color="primary" type="submit" className="w-full text-white font-medium">
              Submit Answers
            </Button>
          </form>
        </Form>
      )}
    </CardWrapper>
  );
};
