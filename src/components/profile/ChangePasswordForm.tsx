'use client';
import React, { useState, useTransition } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { ChangePasswordSchema } from "@/schema";
import { Form, FormField, FormControl, FormItem, FormMessage } from '@/components/ui/form';
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import { Button, Input, Card, CardHeader, CardBody } from "@nextui-org/react";
import { settings } from "@/actions/auth/settings";

const ChangePasswordForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      password: '',
      newPassword: '',
    },
  });

  const onSubmit = (values: z.infer<typeof ChangePasswordSchema>) => {
    startTransition(() => {
      settings(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else if (data.success) {
            setSuccess(data.success);
            setError(""); // Clear error if successful
          }
        })
        .catch(() => { setError("Something went wrong") });
    });
  };

  return (
    <Card className="w-full max-w-md shadow-lg mb-6">
      <CardHeader className="bg-primary-500 text-white">
        <p className="text-2xl font-semibold text-center">Change Password</p>
      </CardHeader>
      <CardBody>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        label="Current Password"
                        type="password"
                        {...field}
                        disabled={isPending}
                        className="bg-gray-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        label="New Password"
                        type="password"
                        {...field}
                        disabled={isPending}
                        className="bg-gray-100"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button type="submit" color="primary" className="w-full">
              Change Password
            </Button>
          </form>
        </Form>
      </CardBody>
    </Card>
  );
};

export default ChangePasswordForm;
