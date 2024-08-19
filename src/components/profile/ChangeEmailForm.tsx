'use client';
import React, { useState, useTransition } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { ChangeEmailSchema } from "@/schema";
import { Form } from '@/components/ui/form';
import { Button, Modal, ModalBody, ModalHeader, ModalContent, Input } from "@nextui-org/react";
import { settings } from "@/actions/auth/settings";
import { Edit } from "iconsax-react";
import { signOut } from "next-auth/react";

const ChangeEmailForm = ({ user }: { user: any }) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const form = useForm<z.infer<typeof ChangeEmailSchema>>({
    resolver: zodResolver(ChangeEmailSchema),
    defaultValues: {
      changeEmail: false,
    },
  });

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmChange = () => {
    startTransition(() => {
      settings({ changeEmail: true })
        .then((data) => {
          if (data.error) {
            setError(data.error);
          } else if (data.success) {
            setSuccess(data.success);
            setIsSuccessModalOpen(true);
          }
        })
        .catch(() => { setError("Something went wrong") })
        .finally(() => {
          setIsModalOpen(false);
        });
    });
  };

  const customSignOut = async () => {
    await signOut({ redirect: false });
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    window.location.href = "/auth/login";
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    customSignOut();
  };

  return (
    <div className="w-full max-w-lg p-4 rounded-3xl bg-background shadow-lg">
      <h2 className="text-base lg:text-2xl font-semibold mb-4 text-left">Change Email</h2>
      <Form {...form}>
        <form className="space-y-6">
          <div className="relative">
            <Input
              className=""
              value={user.email}
              disabled
            />
            <button
              type="button"
              onClick={handleEditClick}
              className="absolute right-3 top-2 text-gray-500"
            >
              <Edit size={20} />
            </button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
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
          <ModalHeader className="font-semibold text-xl lg:text-2xl">
            Confirm Email Change
          </ModalHeader>
          <ModalBody>
            <p id="modal-description">
              Are you sure you want to change your email? 
              This action is significant and will update your login credentials.
            </p>
          </ModalBody>
          <div className="flex justify-end space-x-2 p-4">
            <Button color="danger" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmChange}>
              Confirm
            </Button>
          </div>
        </ModalContent>
      </Modal>

      <Modal 
        isOpen={isSuccessModalOpen} 
        onClose={handleSuccessModalClose}
        aria-labelledby="success-modal-title"
        aria-describedby="success-modal-description"
        placement="center"
      >
        <ModalContent>
          <ModalHeader className="font-semibold text-xl lg:text-2xl text-green-600">
            Success!
          </ModalHeader>
          <ModalBody>
            <p id="success-modal-description" className="text-center">
              {success}
            </p>
            <p className="text-center mt-4">
              You will be signed out automatically.
            </p>
          </ModalBody>
          <div className="flex justify-center p-4">
            {/* <Button onClick={handleSuccessModalClose} className="bg-brand font-medium text-white py-3">
              Close
            </Button> */}
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ChangeEmailForm;