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
import CardWrapper from "@/components/auth/card-wrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { Input } from "@nextui-org/react";
import { forgotEmail } from "@/actions/auth/forgotEmail";
import Link from "next/link";
import FormError from "../form-error";

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
      headerLabel={success ? "Email Recovered Successfully" : "Recover your account"}
      backButtonLabel={success ? "" : "Back to login"}
      backButtonHref={success ? "" : "/auth/login"}
    >
      {success ? (
        <div className="text-center space-y-6">
          <p className="text-lg text-gray-700">
            Your email has been successfully recovered: <strong className="text-green-500">{maskedEmail}</strong>.
          </p>
          <Link href="/auth/login" passHref>
            <Button color="primary" className="w-full font-semibold text-white text-lg">
              Go to Login
            </Button>
          </Link>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <div>
                <FormLabel className="mb-4">What was your first pet&apos;s name?</FormLabel>
                <FormField
                  control={form.control}
                  name="securityAnswer1"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          isRequired
                          label="Answer"
                          {...field}
                          type="text"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormLabel className="mb-2">What is your mother&apos;s maiden name?</FormLabel>
                <FormField
                  control={form.control}
                  name="securityAnswer2"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          isRequired
                          label="Answer"
                          {...field}
                          type="text"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {error && <FormError message={error} />}
            <Button
              type="submit"
              color="primary"
              className="w-full font-medium text-white"
              isLoading={isPending}
            >
              Submit
            </Button>
          </form>
        </Form>
      )}
    </CardWrapper>
  );
};

export default ForgotEmailForm;
