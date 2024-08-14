'use client';

import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LoginSchema } from "@/schema/index";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button, Input } from "@nextui-org/react";
import { Eye, EyeSlash, Key, Sms } from "iconsax-react";
import { login } from "@/actions/auth/login";
import { useRouter } from 'next/navigation';
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import CardWrapper from "@/components/auth/card-wrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSession } from "next-auth/react";
import PasswordStrength from './PasswordStrength';

const LoginForm = ( ) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false);
  const router = useRouter();
  const { update } = useSession();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    
    startTransition(async () => {
      try {
        const data = await login(values);
        if (data?.error) {
          setError(data.error);
         
        } else if (data?.success) {
          setError("");
          setSuccess("Login successful!");

         
          await update();
          
          // Refresh the router to re-fetch any required data
          router.refresh();

          // Redirect to the /beams-today page
          router.push("/beams-today");
        }
      } catch (error) {
        setError("Something went wrong!");
      }
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      isRequired
                      label="Email"
                      classNames={{
                        label: 'w-20',
                        mainWrapper: "w-full flex-1",
                        input: ["placeholder:text-grey-2 text-xs", 'w-full flex-1']
                      }}
                      {...field}
                      type="email"
                      labelPlacement="outside-left"
                      placeholder="Enter your email"
                      disabled={isPending}
                      startContent={<Sms variant="Bold" className="text-secondary-2" size={20} />}
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
                    <Input
                      isRequired
                      classNames={{
                        label: 'w-20',
                        mainWrapper: "w-full flex-1",
                        input: ["placeholder:text-grey-2 text-xs", 'w-full flex-1']
                      }}
                      label="Password"
                      {...field}
                      type={showPassword ? "text" : "password"}
                      disabled={isPending}
                      labelPlacement="outside-left"
                      placeholder="Enter your password"
                      startContent={<Key variant="Bold" className="text-secondary-2" size={20} />}
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
                  </FormControl>
                  {passwordFocused && (
                    <PasswordStrength
                      password={form.watch('password')}
                      onClose={() => setPasswordFocused(false)}
                    />
                  )}
                  <FormMessage />
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
          <Button type="submit" color="primary" className="w-full text-white font-medium" isLoading={isPending}>
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
