'use client';

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LoginSchema } from "@/schema/index";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button, Input } from "@nextui-org/react";
import { Eye, EyeSlash, Key, Sms } from "iconsax-react";
import { login } from "@/actions/auth/login";
import { useRouter } from 'next/navigation';
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import CardWrapper from "@/components/auth/card-wrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import PasswordStrength from './PasswordStrength';

const LoginForm = ({ onError }: { onError: (error: string | undefined) => void }) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    mode: "onSubmit", // This ensures validation messages appear only on form submission
    reValidateMode: "onSubmit", // Prevents validation on re-validate until form is resubmitted
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      login(values).then((data) => {
        if (data?.error) {
          setError(data.error);
          onError(data.error);
        } else if (data?.success) {
          setError("");
          setSuccess("Login successful!");
          document.querySelector(".door")?.classList.add("doorOpen");
          setTimeout(() => {
            router.push("/beams-today");
          }, 2000); // Redirect after the success message is shown
        }
      })
      .catch(() => setError("Something went wrong!"));
    });
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <CardWrapper
      headerLabel="Login"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                  <div className="relative w-full no-scrollbar">
                    <Input
                      isRequired
                      label="Email"
                      classNames={{
                        label: 'w-20',
                        // innerWrapper: "w-[4/6]",
                        mainWrapper: "w-full flex-1",
                        input: [
                          "placeholder:text-grey-2 text-xs",
                          'w-full flex-1'
                        ]
                      }}
                      {...field}
                      type="email"
                      labelPlacement="outside-left"
                      placeholder="Enter your email"
                      disabled={isPending}
                      startContent={
                        <Sms variant="Bold" className="text-secondary-2" size={20} />
                      }
                    />
                    </div>
                  </FormControl>
                  <FormMessage /> {/* Validation message will appear here after form submission */}
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
                        classNames={{
                          label: 'w-20',
                          // innerWrapper: "w-[4/6]",
                          mainWrapper: "w-full flex-1",
                          input: [
                            "placeholder:text-grey-2 text-xs",
                            'w-full flex-1'
                          ]
                        }}
                        label="Password"
                        {...field}
                        type={showPassword ? "text" : "password"}
                        disabled={isPending}
                        labelPlacement="outside-left"
                        placeholder="Enter a password"
                        startContent={
                          <Key variant="Bold" className="text-secondary-2" size={20} />
                        }
                        endContent={
                          <span
                            className="cursor-pointer text-[#888888]"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? <EyeSlash variant="Bold" size={20} /> : <Eye variant="Bold" size={20} />}
                          </span>
                        }
                        onFocus={() => setPasswordFocused(true)}
                        onBlur={() => {
                          if (!field.value) setPasswordFocused(false);
                        }}
                      />
                    </div>
                  </FormControl>
                  {passwordFocused && (
                    <PasswordStrength
                      password={form.watch('password')}
                      onClose={() => setPasswordFocused(false)}
                    />
                  )}
                  <FormMessage /> {/* Validation message will appear here after form submission */}
                </FormItem>
              )}
            />
            <div className="w-full flex justify-between lg:px-0 mb-8">
              <Link className="font-normal text-xs" href="/auth/reset">Forgot password?</Link>
              <Link className="font-normal text-xs" href="/auth/forgot-identifiers">Forgot email?</Link>
            </div>
            {error && (<FormError message={error} />)}
            {success && (<FormSuccess message={success} />)}
           
          </div>
           <Button type="submit" color="primary" className="w-full text-white font-medium">
              Login
            </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
