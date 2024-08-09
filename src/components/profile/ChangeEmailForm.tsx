'use client';
import React, { useState, useTransition } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { ChangeEmailSchema } from "@/schema";
import { Form, FormField, FormControl, FormItem, FormMessage } from '@/components/ui/form';
import { Input, Button, Modal, ModalFooter, ModalBody, ModalHeader, ModalContent } from "@nextui-org/react";
import { FiEdit } from 'react-icons/fi';
import { settings } from "@/actions/auth/settings";
import { Edit } from "iconsax-react";

const ChangeEmailForm = ({ user }: { user: any }) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<z.infer<typeof ChangeEmailSchema>>({
    resolver: zodResolver(ChangeEmailSchema),
    defaultValues: {
      newEmail: user?.email || '',
    },
  });

  const onSubmit = () => {
    const newEmail = form.getValues('newEmail');

    if (newEmail === user.email) {
      setError("The new email cannot be the same as the old email.");
    } else {
      setIsModalOpen(true);  // Open the confirmation modal when form is submitted
    }
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
            setIsEditing(false);
            setError(""); // Clear error if successful
          }
        })
        .catch(() => { setError("Something went wrong") })
        .finally(() => {
          setIsModalOpen(false);  // Close the modal after action is confirmed
        });
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
    form.setValue('newEmail', '');  // Reset the email input
    setError('');  // Clear any previous error messages
  };

  return (
    <div className="w-full max-w-md p-4 rounded-3xl bg-background shadow-lg">
      <h2 className="text-base lg:text-2xl font-semibold mb-4 text-left">Change Email</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative">
            <FormField
              control={form.control}
              name="newEmail"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      label={isEditing ? "Enter New Email" : "Your Email"}
                      {...field}
                      disabled={!isEditing || isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isEditing && (
              <button
                type="button"
                onClick={handleEditClick}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                <Edit size={20} />
              </button>
            )}
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {isEditing && (
            <Button type="submit" className="w-full bg-brand font-medium text-white py-3">
              Change Email
            </Button>
          )}
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
            Confirm Email Change
          </ModalHeader>
          <ModalBody>
            <p id="modal-description">
              You are about to change your email to <strong>{form.getValues('newEmail')}</strong>. 
              This action is significant and will update your login credentials.
              Are you sure you want to proceed?
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

export default ChangeEmailForm;
