"use client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { NewPasswordSchema } from "@/schema/index";
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
import { newPassword } from "@/actions/auth/new-password";
import { useState, useTransition, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Eye, EyeSlash, Key } from "iconsax-react";
import FormError from "../../../components/form-error";
import PasswordStrength from "./PasswordStrength2";
import Image from "next/image";

const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<boolean>(false);

  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess(false);
    startTransition(() => {
      newPassword(values, token).then((data) => {
        if (data && data.success) {
          setSuccess(true);
        } else {
          setError(data?.error || "Failed to reset password.");
        }
      });
    });
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push("/auth/login");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, router]);

  return (
    <CardWrapper subMessage={success ? "" : "Time to choose a new password. Just make sure it's not the same password again."} headerLabel={success ? "Your password has been successfully reset." : "Reset Password"}>
      {success ? (
        <div className="text-center space-y-6">
          <Image
            className="mx-auto"
            priority
            alt="password"
            src={"https://res.cloudinary.com/drlyyxqh9/image/upload/v1725374175/authentication/passwrod-reset-3d_qsqm3a.webp"}
            width={200}
            height={200}
          />
          <p className="text-lg text-text mb-6">Mission Accomplished</p>
          <Button
            color="primary"
            className="w-full font-semibold py-6 mb-4 text-white md:text-xl text-lg"
            isLoading={true} // Keep the button in loading state
          >
            Redirecting to Login
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mb-4">
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
                          label: "font-semibold text-text",
                          mainWrapper: "w-full flex-1",
                          innerWrapper: 'h-12',
                          input: ["placeholder:text-grey-2 text-xs", "w-full flex-1"],
                        }}
                        label="Password"
                        variant="underlined"
                        {...field}
                        type={showPassword ? "text" : "password"}
                        disabled={isPending}
                        labelPlacement="outside"
                        placeholder="Enter a new password"
                        endContent={
                          <span
                            className="cursor-pointer text-[#888888]"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? (
                              <EyeSlash variant="Bold" size={20} />
                            ) : (
                              <Eye variant="Bold" size={20} />
                            )}
                          </span>
                        }
                      ></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <PasswordStrength 
                  password={form.watch('password')}
                  onClose={() =>{}}
                />
            </div>
            <Button
              type="submit"
              color="primary"
              endContent={<Key variant="Bold"/>}
              className="w-full text-white text-lg mdtext-xl font-semibold py-6"
              isLoading={isPending}
            >
              Reset Password
            </Button>
            <FormError message={error} />
          </form>
        </Form>
      )}
    </CardWrapper>
  );
};

export default NewPasswordForm;
