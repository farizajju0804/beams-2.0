"use client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ResetSchema } from "@/schema/index";
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
import { Input } from "@nextui-org/react";
import { resendPasswordResetEmail, reset } from "@/actions/auth/reset";
import { useState, useTransition } from "react";
import { Send2 } from "iconsax-react";
import FormError from "../../../components/form-error";
import Link from "next/link";

const ResetForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [hasResent, setHasResent] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleResend = () => {
    setError("");
    setIsResending(true); 
    startTransition(() => {
      const values = form.getValues(); 
      resendPasswordResetEmail(values.email).then((data) => {
        setIsResending(false); // Reset resending state
        if (data?.success) {
          setHasResent(true);
          setSuccess(true);
        } else {
          setError(data?.error || "Failed to resend reset instructions.");
        }
      });
    });
  };

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess(false);
    startTransition(() => {
      reset(values).then((data) => {
        if (data?.success) {
          setSuccess(true);
        } else {
          setError(data?.error || "Failed to send reset instructions.");
        }
      });
    });
  };

  return (
    <CardWrapper
      subMessage={success ? "" : "Don't worry, we've got your back."}
      headerLabel={success ? (isResending ? "Resending Email..." : "Check Your Inbox 📧") : "Forgot Password 🔑"}
      backButtonPosition="bottom"
      backButtonSubText="Remember Password?"
      backButtonHref="/auth/login"
      backButtonLabel="Login"
    >
      {success && !isResending ? (
        <div className="text-left">
          <p className="text-sm text-text mb-4">
            {hasResent
              ? `We've resent the password reset instructions to your email at `
              : `We've emailed the password reset instructions to you at `} 
            <strong className="font-bold text-secondary-2">{form.getValues("email")}</strong>.
          </p>
          <p className="text-sm text-text mb-4">
            If you don&apos;t see our email, check your spam or junk folder—sometimes our messages like to play hide and seek. Be sure to mark it as safe!
          </p>
          <p className="text-sm text-text mb-6">
            {hasResent
              ? `If you still don't see it after a few minutes, please check your email again or try resending.`
              : `If you still can't find it, no worries—click below to resend it.`}
          </p>
          <Button
            onClick={handleResend}
            endContent={<Send2 variant="Bold" />}
            color="primary"
            className="w-full font-semibold text-white text-lg md:text-xl py-6 mb-4"
            isLoading={isResending} // Show loading state on the button
          >
            Resend Email
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mb-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        isRequired
                        variant="underlined"
                        classNames={{
                          label: "font-semibold text-text",
                          mainWrapper: "w-full flex-1",
                          input: [
                            "placeholder:text-grey-2 text-xs",
                            "w-full flex-1",
                          ],
                        }}
                        label="Email Address"
                        labelPlacement="outside"
                        placeholder="Enter your email"
                        {...field}
                        type="email"
                        disabled={isPending || isResending} // Disable during loading
                      ></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              color="primary"
              endContent={<Send2 variant="Bold" />}
              className="w-full text-white text-lg py-6 md:text-xl font-semibold"
              isLoading={isPending || isResending} // Show loading state on the button
            >
              {isPending ? "Sending..." : "Send Reset Instructions"}
            </Button>
            {error && <FormError message={error} />}
          </form>
        </Form>
      )}
    </CardWrapper>
  );
};

export default ResetForm;
