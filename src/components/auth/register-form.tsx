"use client";

import * as z from "zod";
import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

import { RegisterSchema } from "@/schema";
import { Input, Select, SelectItem } from "@nextui-org/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CardWrapper from "@/components/auth/card-wrapper";
import { Button } from "@nextui-org/react";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import { register, validateUsername } from "@/actions/auth/register";

const securityQuestions = [
  { key: "petName", label: "What was your first pet's name?" },
  { key: "motherMaidenName", label: "What is your mother's maiden name?" },
  { key: "firstSchool", label: "What was the name of your first school?" },
];

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [usernameValid, setUsernameValid] = useState(true);
  const [securityQuestionSelected, setSecurityQuestionSelected] = useState(false);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      username: "",
      securityQuestion: "",
      securityAnswer: "",
    },
  });

  const validateUsernameFromDb = async (username: string) => {
    const isValid = await validateUsername(username);
    setUsernameValid(isValid);
    if (!isValid) {
      form.setError("username", {
        type: "manual",
        message: "Username is already taken",
      });
    } else {
      form.clearErrors("username");
    }
  };

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      register(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "username") {
        validateUsernameFromDb(value.username as string); 
      }
      if (name === "securityQuestion") {
        setSecurityQuestionSelected(!!value.securityQuestion);
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      label="Username"
                      isInvalid={!usernameValid}
                    />
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
            {securityQuestionSelected && (
              <FormField
                control={form.control}
                name="securityAnswer"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} disabled={isPending} label="Security Answer" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} color="primary" type="submit" className="w-full">
            Create an account
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
