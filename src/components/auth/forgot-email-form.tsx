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
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import CardWrapper from "@/components/auth/card-wrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { Input } from "@nextui-org/react";
import { forgotEmail } from "@/actions/auth/forgotEmail";

const ForgotEmailForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
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
    setSuccess("");
    setMaskedEmail("");
    startTransition(() => {
      forgotEmail(values).then((data) => {
        if (data) {
          setError(data.error);
          setSuccess(data.success);
          setMaskedEmail(data.maskedEmail);
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Recover your account"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <div>
              <FormLabel>What was your first pet&apos;s name?</FormLabel>
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
                      ></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormLabel>What is your mother&apos;s maiden name?</FormLabel>
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
                      ></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {maskedEmail && (
            <div className="text-center text-green-500">
              Your Email: {maskedEmail}
            </div>
          )}
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" color="secondary" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ForgotEmailForm;
