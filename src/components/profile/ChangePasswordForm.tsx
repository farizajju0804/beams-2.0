'use client';
import React, { useState, useTransition } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { ChangePasswordSchema } from "@/schema";
import { Form, FormField, FormControl, FormItem, FormMessage } from '@/components/ui/form';
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import { Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { Eye, EyeSlash } from "iconsax-react";
import { settings } from "@/actions/auth/settings";

const ChangePasswordForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      password: '',
      newPassword: '',
    },
  });

  const onSubmit = (values: z.infer<typeof ChangePasswordSchema>) => {
    setIsModalOpen(true);  // Open the confirmation modal before submitting
  };

  const handleConfirmChange = () => {
    const values = form.getValues();
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
        .catch(() => { setError("Something went wrong") })
        .finally(() => {
          setIsModalOpen(false);  // Close the modal after action is confirmed
        });
    });
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleNewPasswordVisibility = () => setShowNewPassword((prev) => !prev);

  return (
    <div className="w-full max-w-md p-4 bg-background rounded-3xl shadow-lg">
      <h2 className="text-base lg:text-2xl font-semibold mb-4 text-left">Change Password</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        label="Current Password"
                        type={showPassword ? "text" : "password"}
                        variant="underlined"
                        {...field}
                        disabled={isPending}
                      />
                      <span
                        className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-gray-700"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                      </span>
                    </div>
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
                    <div className="relative">
                      <Input
                       variant="underlined"
                        label="New Password"
                        type={showNewPassword ? "text" : "password"}
                        {...field}
                        disabled={isPending}
                      />
                      <span
                        className="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-gray-700"
                        onClick={toggleNewPasswordVisibility}
                      >
                        {showNewPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" className="w-full bg-brand font-medium text-white py-3">
            Change Password
          </Button>
        </form>
      </Form>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        placement="center"
      >
        <ModalContent>
          <ModalHeader className="font-semibold text-2xl">
            Confirm Password Change
          </ModalHeader>
          <ModalBody>
            <p id="modal-description">
              Are you sure you want to change your password? Please confirm to proceed.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmChange}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ChangePasswordForm;
