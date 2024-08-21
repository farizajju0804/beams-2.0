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
import CardWrapper from "@/components/auth/card-wrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@nextui-org/react";
import { reset } from "@/actions/auth/reset";
import { useState, useTransition } from "react";
import { Sms } from "iconsax-react";
import FormError from "../form-error";
import Link from "next/link";

const ResetForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<boolean>(false);

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

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
    <CardWrapper headerLabel={success ? "Email Sent" : "Forgot Password"}>
      {success ? (
        <div className="text-center">
          <p className="text-lg text-gray-700 mb-6">
            Password reset instructions have been sent to your email:{" "}
            <strong className="font-bold text-purple-600">{form.getValues("email")}</strong>.
          </p>
          <Link href="/auth/login" passHref>
            <Button color="primary" className="w-full font-semibold text-white text-lg mb-4">
              Go to Login
            </Button>
          </Link>
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
                        classNames={{
                          label: "w-20",
                          mainWrapper: "w-full flex-1",
                          input: [
                            "placeholder:text-grey-2 text-xs",
                            "w-full flex-1",
                          ],
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
            <Button
              type="submit"
              color="primary"
              className="w-full text-white text-lg font-medium"
              isLoading={isPending}
            >
              Send Reset Email
            </Button>
            {error && <FormError message={error} />}
          </form>
        </Form>
      )}
    </CardWrapper>
  );
};

export default ResetForm;
