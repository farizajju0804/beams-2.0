"use client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { NewPasswordSchema} from "@/schema/index";
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
import { newPassword } from "@/actions/auth/new-password";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Eye, EyeSlash, Key } from "iconsax-react";
const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: ""
    },
  });
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      newPassword(values,token).then((data) => {
        if (data) {
          setError(data.error);
          setSuccess(data.success);
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Reset Password"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
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
                        label="Password"
                        {...field}
                        type={showPassword ? "text" : "password"}
                        disabled={isPending}
                        labelPlacement="outside-left"
                        placeholder="Enter a new password"
                        startContent={
                          <Key variant="Bold" className="text-secondary-2" size={20} />
                        }
                      
                      endContent={
                        <span
                          className="cursor-pointer text-[#888888]"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <EyeSlash variant="Bold" size={20} /> : <Eye variant="Bold" size={20} />}
                        </span>
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
            Reset Password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default NewPasswordForm;
