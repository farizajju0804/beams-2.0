"use client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ForgotUsernameEmailSchema } from "@/schema/index";
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
import { Input, Select, SelectItem } from "@nextui-org/react";
import { forgotUsernameEmail } from "@/actions/auth/forgotUsernameEmail";

const securityQuestions = [
  { key: "petName", label: "What was your first pet's name?" },
  { key: "motherMaidenName", label: "What is your mother's maiden name?" },
  { key: "firstSchool", label: "What was the name of your first school?" },
];

const ForgotUsernameEmailForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ForgotUsernameEmailSchema>>({
    resolver: zodResolver(ForgotUsernameEmailSchema),
    defaultValues: {
      securityQuestion: "",
      securityAnswer: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ForgotUsernameEmailSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      forgotUsernameEmail(values).then((data) => {
        if (data) {
          setError(data.error);
          setSuccess(data.success);
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
            <FormField
              control={form.control}
              name="securityQuestion"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select {...field} disabled={isPending} label="Security Question">
                      {securityQuestions.map((question) => (
                        <SelectItem key={question.key} value={question.key}>
                          {question.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="securityAnswer"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      isRequired
                      label="Security Answer"
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

export default ForgotUsernameEmailForm;
