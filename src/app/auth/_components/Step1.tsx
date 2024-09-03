"use client";

import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schema";
import { Input, Button } from "@nextui-org/react";
import { registerAndSendVerification } from "@/actions/auth/register";
import { Eye, EyeSlash, Key, Sms, User } from "iconsax-react";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import CardWrapper from "@/app/auth/_components/card-wrapper";
import PasswordStrength from "./PasswordStrength2";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../../../components/ui/form";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface RegisterFormProps {
  ip: string;
  pendingEmail?: any; 
}

const Step1Form: React.FC<RegisterFormProps> = ({ ip, pendingEmail }) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false);
  const [isTypingEmail, setIsTypingEmail] = useState<boolean>(false);
  const [isTypingPassword, setIsTypingPassword] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);
  
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 767);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");
    startTransition(async () => {
      try {
        const result: any = await registerAndSendVerification(values, ip);

        if (result?.error === "VERIFY_EMAIL") {
          router.push(`/auth/new-verify-email?email=${encodeURIComponent(values.email)}`);
        } else if (result?.error) {
          setError(result.error);
        } else if (result?.success) {
          setSuccess(result.success);

          // Redirect to the verification page
          router.push(`/auth/new-verify-email?email=${encodeURIComponent(values.email)}`);
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
      headerLabel="Sign Up 🚀"
      backButtonLabel="Login"
      backButtonSubText="Have an account?"
      backButtonHref="/auth/login"
      backButtonPosition="top"
      showSocial
    >
      {/* <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col gap-8">
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
                      labelPlacement={isMobile ? "outside" : "outside-left"}
                      classNames={{
                        label: "w-20 font-medium",
                        mainWrapper: "w-full flex-1",
                        input: ["placeholder:text-grey-2 text-xs", "w-full flex-1 font-medium"],
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
                        labelPlacement={isMobile ? "outside" : "outside-left"}
                        classNames={{
                          label: "w-20 font-medium",
                          mainWrapper: "w-full flex-1",
                          input: ["placeholder:text-grey-2 text-xs", "w-full flex-1 font-medium"],
                        }}
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter a password"
                        startContent={
                          !isTypingPassword && <Key variant="Bold" className="text-secondary-2" size={20} />
                        }
                        endContent={
                          <span className="cursor-pointer text-[#888888]" onClick={togglePasswordVisibility}>
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
                      password={form.watch("password")}
                      onClose={() => setPasswordFocused(false)}
                      showCrackTime={true}
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            color="primary"
            className="w-full font-semibold text-lg text-white"
            isLoading={isPending}
          >
            {isPending ? "Creating Account..." : "Create Account"}
          </Button>
          {error && <FormError message={error} />}
          {!isPending && success && <FormSuccess message={success} />}
        </form>
      </Form> */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className={`flex flex-col gap-6  `}>
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
                            label: 'font-semibold text-text',
                            mainWrapper: "w-full flex-1",
                          inputWrapper : "h-12",
                            input: [
                              "placeholder:text-grey-2 ",
                              'w-full flex-1 font-medium'
                            ]
                          }}
                          {...field}
                          type="email"
                         disabled={isPending}
                          variant="underlined"
                          labelPlacement={"outside"}
                          placeholder="Enter your email"
                          color="primary"
                          // startContent={!isTypingEmail && <Sms variant="Bold" className="text-secondary-2" size={16} />}
                          onFocus={() => setIsTypingEmail(true)}
                         
                          onBlur={() => {
                            if (field.value.length === 0) {
                              setIsTypingEmail(false)
                            }
                          }}
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
              <div className="relative h-auto transition-all duration-500 ease-soft-spring">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        isRequired
                        classNames={{
                          label: 'font-semibold text-text',
                          mainWrapper: "w-full flex-1",
                          inputWrapper : "h-12",
                          input: [
                            "placeholder:text-grey-2 ",
                            'w-full flex-1 font-medium'
                          ]
                        }}
                        label="Password"
                        {...field}
                        type={showPassword ? "text" : "password"}
                         disabled={isPending}
                         variant="underlined"
                         color="primary"
                         labelPlacement={"outside"}
                        placeholder="Enter your password"
                        // startContent={!isTypingPassword && <Key variant="Bold" className="text-secondary-2" size={16} />}
                        endContent={
                          <span
                            className="cursor-pointer text-[#888888]"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? <EyeSlash variant="Bold" /> : <Eye variant="Bold"  />}
                          </span>
                        }
                        onFocus={() => 
                        {
                          setIsTypingPassword(true);
                          setShowPasswordStrength(true)
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
                  showCrackTime={true}
                />
              )}
              </div>
              <div className="w-ful">
              <p className="text-xs text-gra-500">By continuing, you agree to the <span className="text-brand font-medium"><Link href='/terms'>Terms of Service</Link></span> and acknowledge you&apos;ve read our <span className="text-brand font-medium"><Link href='/privacy'>Privacy Policy</Link></span>. </p>
            </div>
            </div>
          
          <Button endContent={<User size={18} variant="Bold"/>} type="submit" color="primary" className="w-full py-6 text-lg md:text-xl text-white font-semibold" isLoading={isPending}>
          {isPending ? "Creating Account..." : "Create Account"}
          </Button>
            {error && (<FormError message={error} />)}
            {success && (<FormSuccess message={success} />)}
        </form>
      </Form>
    </CardWrapper>
  );
};

export default Step1Form;
