"use client";

import * as z from "zod";
import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { register,submitSecurityAnswers } from "@/actions/auth/register";

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

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const securityForm = useForm<z.infer<typeof SecuritySchema>>({
    resolver: zodResolver(SecuritySchema),
    mode: "onChange",
    reValidateMode: "onChange",
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

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "password") {
        // Password validation logic can be added here
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

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
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} disabled={isPending} label="Name" />
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
                      <Input {...field} disabled={isPending} type="email" label="Email" />
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
                      <Input {...field} disabled={isPending} label="Password" type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button disabled={isPending} color="primary" type="submit" className="w-full">
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
                    <FormItem>
                      <FormControl>
                        <Input {...field} disabled={isPending} label={question} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button disabled={isPending} color="primary" type="submit" className="w-full">
              Submit Answers
            </Button>
          </form>
        </Form>
      )}
    </CardWrapper>
  );
};
