"use client";

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schema";
import { Input, Button } from "@nextui-org/react";
import { registerAndSendVerification } from "@/actions/auth/register";
import { Eye, EyeSlash, Key, Sms } from "iconsax-react";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import CardWrapper from "@/components/auth/card-wrapper";
import PasswordStrength from "./PasswordStrength2";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { useEmailStore } from "@/store/email";

const Step1Form: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false);
  const [isTypingEmail, setIsTypingEmail] = useState<boolean>(false);
  const [isTypingPassword, setIsTypingPassword] = useState<boolean>(false);

  const setEmailStore = useEmailStore((state: any) => state.setEmail);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    mode: "onSubmit",
    defaultValues: {
      email: typeof window !== "undefined" ? localStorage.getItem("email") || "" : "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    setEmailStore(values.email);
    localStorage.setItem("email", values.email);

    setError("");
    setSuccess("");
    startTransition(async () => {
      try {
        const result = await registerAndSendVerification(values);
        if (result?.error) {
          setError(result.error);
        } else if (result?.success) {
          setSuccess(result.success);
          setTimeout(onNext, 2000);
        }
      } catch (err) {
        console.error("Error:", err);
        setError("An unexpected error occurred.");
      }
    });
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <CardWrapper
      headerLabel="Join Beams"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      isRequired
                      label="Email"
                      labelPlacement="outside-left"
                      classNames={{
                        label: 'w-20 font-medium',
                        mainWrapper: "w-full flex-1",
                        input: [
                          "placeholder:text-grey-2 text-xs",
                          'w-full flex-1 font-medium'
                        ]
                      }}
                      type="email"
                      placeholder="Enter your email"
                      startContent={
                        !isTypingEmail && <Sms variant="Bold" className="text-secondary-2" size={20} />
                      }
                      onFocus={() => setIsTypingEmail(true)}
                      onBlur={() => setIsTypingEmail(false)}
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        {...field}
                        isRequired
                        labelPlacement="outside-left"
                        classNames={{
                          label: 'w-20 font-medium',
                          mainWrapper: "w-full flex-1",
                          input: [
                            "placeholder:text-grey-2 text-xs",
                            'w-full flex-1 font-medium'
                          ]
                        }}
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter a password"
                        startContent={
                          !isTypingPassword && <Key variant="Bold" className="text-secondary-2" size={20} />
                        }
                        endContent={
                          <span
                            className="cursor-pointer text-[#888888]"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? <EyeSlash variant="Bold" size={20} /> : <Eye variant="Bold" size={20} />}
                          </span>
                        }
                        onFocus={() => {
                          setIsTypingPassword(true);
                          setPasswordFocused(true);
                        }}
                        onBlur={() => {
                          setIsTypingPassword(false);
                          if (!field.value) setPasswordFocused(false);
                        }}
                        onChange={(e) => {
                          field.onChange(e);
                          if (e.target.value.length === 0) setIsTypingPassword(false);
                        }}
                      />
                    </div>
                  </FormControl>
                  {passwordFocused && (
                    <PasswordStrength
                      password={form.watch('password')}
                      onClose={() => setPasswordFocused(false)}
                      showCrackTime={true}
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {error && <FormError message={error} />}
          {success && <FormSuccess message={success} />}
          <Button
            type="submit"
            color="primary"
            className="w-full font-semibold text-lg text-white"
            isLoading={isPending}
          >
            {isPending ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default Step1Form;
