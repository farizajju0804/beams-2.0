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

// Main component definition
const ChangePasswordForm = () => {
  // State variables for form handling
  const [error, setError] = useState<string | undefined>(""); // For storing error messages
  const [success, setSuccess] = useState<string | undefined>(""); // For storing success messages
  const [isPending, startTransition] = useTransition(); // Transition for handling async submissions
  const [showPassword, setShowPassword] = useState<boolean>(false); // Toggle visibility of current password
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false); // Toggle visibility of new password
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Controls confirmation modal visibility

  // React Hook Form setup with Zod validation
  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema), // Apply Zod schema for validation
    defaultValues: {
      password: '',
      newPassword: '',
    },
  });

  // Form submission handler
  const onSubmit = (values: z.infer<typeof ChangePasswordSchema>) => {
    setIsModalOpen(true);  // Open the confirmation modal before submitting
  };

  // Handles confirmation of password change
  const handleConfirmChange = () => {
    const values = form.getValues(); // Retrieve form values
    startTransition(() => { // Begin async transition for password update
      settings(values) // Call settings API with form values
        .then((data) => {
          if (data.error) {
            setError(data.error); // Set error message if API returns an error
          } else if (data.success) {
            setSuccess(data.success); // Set success message if password update succeeds
            setError(""); // Clear any previous errors
          }
        })
        .catch(() => { setError("Something went wrong") }) // Catch any unexpected errors
        .finally(() => {
          setIsModalOpen(false);  // Close the modal after action is confirmed
        });
    });
  };

  // Toggles visibility of current password input field
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  // Toggles visibility of new password input field
  const toggleNewPasswordVisibility = () => setShowNewPassword((prev) => !prev);

  return (
    <div className="w-full max-w-lg p-4 bg-background rounded-3xl shadow-lg">
      <h2 className="text-base lg:text-2xl font-semibold mb-4 text-left">Change Password</h2>
      <Form {...form}>
        {/* Form structure with input fields for current and new passwords */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Field for current password with show/hide functionality */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        label="Current Password"
                        autoComplete="current-password"
                        aria-label="current-password"
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
            {/* Field for new password with show/hide functionality */}
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
                        aria-label="new-password"
                        autoComplete="password"
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

          {/* Submit button */}
          <Button aria-label="change" type="submit" className="w-full bg-brand text-lg font-medium text-white py-3">
            Change Password
          </Button>
          {/* Display error or success messages */}
          {error && <FormError message={error} />}
          {success && <FormSuccess message={success} />}
        </form>
      </Form>

      {/* Confirmation modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        placement="center"
        classNames={{
          wrapper: "z-[250]"
        }}
      >
        <ModalContent>
          <ModalHeader className="font-semibold text-xl lg:text-2xl">
            Confirm Password Change
          </ModalHeader>
          <ModalBody>
            <p id="modal-description">
              Are you sure you want to change your password? Please confirm to proceed.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button  aria-label="cancel"  onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button  aria-label="confirm" color="danger" onClick={handleConfirmChange}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ChangePasswordForm;
