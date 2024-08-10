"use client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ResetSchema } from "@/schema/index";
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
import { Input } from "@nextui-org/react";
import { reset } from "@/actions/auth/reset";
import { useState, useTransition } from "react";
import { Sms } from "iconsax-react";

const ResetForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: ""
    },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      reset(values).then((data) => {
        if (data) {
          setError(data.error);
          setSuccess(data.success);
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Forgot Password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      isRequired
                      classNames={{
                        label: 'w-20',
                        // innerWrapper: "w-[4/6]",
                        mainWrapper: "w-full flex-1",
                        input: [
                          "placeholder:text-grey-2 text-xs",
                          'w-full flex-1'
                        ]
                      }}
                      label="Email"
                      labelPlacement="outside-left"
                      placeholder="Enter your email"
                      {...field}
                      type="email"
                      disabled={isPending}
                      startContent={
                        <Sms variant="Bold" className="text-secondary-2" size={20} />
                      }
                    ></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" color="primary" className="w-full text-white font-medium">
            Send Reset Email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ResetForm;
