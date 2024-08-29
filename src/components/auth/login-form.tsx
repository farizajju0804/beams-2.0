"use client";

import React, { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { LoginSchema } from "@/schema/index";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button, Input } from "@nextui-org/react";
import { Eye, EyeSlash, Key, Sms } from "iconsax-react";
import { login } from "@/actions/auth/login";
import { useRouter, useSearchParams } from 'next/navigation';
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import CardWrapper from "@/components/auth/card-wrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSession } from "next-auth/react";
import PasswordStrength from './PasswordStrength';
import { useEmailStore } from "@/store/email";
interface LoginFormProps{
  ip :string,
  pendingEmail?: any;
}
const LoginForm: FC<LoginFormProps>= ({ip,pendingEmail}) => {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Email already in use with different provider!" : "";
  const [error, setError] = useState<string | undefined>(urlError);
  const [success, setSuccess] = useState<string | undefined>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false);
  const [isTypingEmail, setIsTypingEmail] = useState<boolean>(false);
  const [isTypingPassword, setIsTypingPassword] = useState<boolean>(false);
  const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const { update } = useSession();
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
      code: "",  // For two-factor authentication
    },
  });
  
  useEffect(() => {
    const checkMobile:any = () => {
      setIsMobile(window.innerWidth < 767);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  useEffect(() => {
    if (pendingEmail) {
      router.push(`/auth/new-verify-email?email=${encodeURIComponent(pendingEmail.email)}`);
    }
  }, [pendingEmail, router]);

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    setIsLoading(true);
    
    try {
      const data = await login(values,ip);
      if (data?.error === "VERIFY_EMAIL") {
        router.push(`/auth/new-verify-email?email=${encodeURIComponent(values.email)}`);
      }
      else if (data?.error) {
        setError(data.error);
        setIsLoading(false);
      } else if (data?.success) {
        setSuccess("Login successful!");
        setIsLoading(false);
        await update();
        router.push("/beams-today");
      } else if (data?.twoFactor) {
        console.log("Two-factor authentication required");
        setShowTwoFactor(true);  
        setIsLoading(false);
      }
    } catch (error) {
      setError("Something went wrong!");
      setIsLoading(false);
    }
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
          <div className="flex flex-col gap-6">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        isRequired
                        label="Two-Factor Code"
                        classNames={{
                          label: 'w-32 font-medium',
                          mainWrapper: "w-full flex-1",
                          input: [
                            "placeholder:text-grey-2 text-xs",
                            'w-full flex-1 font-medium'
                          ]
                        }}
                        {...field}
                        type="text"
                        disabled={isLoading}
                        placeholder="Enter your code"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
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
                            label: 'w-20 font-medium',
                            mainWrapper: "w-full flex-1",
                            input: [
                              "placeholder:text-grey-2 ",
                              'w-full flex-1 font-medium'
                            ]
                          }}
                          {...field}
                          type="email"
                          labelPlacement={isMobile ? "outside" :"outside-left"}
                          placeholder="Enter your email"
                          disabled={isLoading}
                          startContent={!isTypingEmail && <Sms variant="Bold" className="text-secondary-2" size={16} />}
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
                  <div className="relative">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        isRequired
                        classNames={{
                          label: 'w-20 font-medium',
                          mainWrapper: "w-full flex-1",
                          input: [
                            "placeholder:text-grey-2 ",
                            'w-full flex-1 font-medium'
                          ]
                        }}
                        label="Password"
                        {...field}
                        type={showPassword ? "text" : "password"}
                        disabled={isLoading}
                        labelPlacement={isMobile ? "outside" :"outside-left"}
                        placeholder="Enter your password"
                        startContent={!isTypingPassword && <Key variant="Bold" className="text-secondary-2" size={16} />}
                        endContent={
                          <span
                            className="cursor-pointer text-[#888888]"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? <EyeSlash variant="Bold" size={16} /> : <Eye variant="Bold" size={16} />}
                          </span>
                        }
                        onFocus={() => 
                          {setShowPasswordStrength(true)
                            setIsTypingPassword(true)
                          }}
                        onBlur={() => {
                          if (field.value.length === 0) {
                            setIsTypingPassword(false);
                            setShowPasswordStrength(false);
                          }
                        }}
                        onChange={(e) => {
                          field.onChange(e);
                          setIsTypingPassword(true);
                          if (e.target.value.length === 0) {
                            setIsTypingPassword(false);
                            setShowPasswordStrength(false);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {showPasswordStrength && (
                <PasswordStrength
                  password={form.watch('password')}
                  onClose={() => setShowPasswordStrength(false)}
                />
              )}
            </div>
              </>
            )}
            <div className="w-full flex justify-between lg:px-0">
              <Link className="font-normal text-xs" href="/auth/reset">Forgot password?</Link>
              <Link className="font-normal text-xs" href="/auth/forgot-identifiers">Forgot email?</Link>
            </div>
          
          </div>
          <Button type="submit" color="primary" className="w-full text-lg text-white font-medium" isLoading={isLoading}>
            {showTwoFactor ? "Confirm" : "Login"}
          </Button>
            {error && (<FormError message={error} />)}
            {success && (<FormSuccess message={success} />)}
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
