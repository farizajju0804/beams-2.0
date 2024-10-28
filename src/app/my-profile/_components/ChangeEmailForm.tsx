'use client';

import React, { useState, useTransition } from "react";
import { useForm } from 'react-hook-form'; // Import form handling hook
import { zodResolver } from "@hookform/resolvers/zod"; // Import Zod resolver for form validation
import * as z from 'zod';
import { ChangeEmailSchema } from "@/schema"; // Schema for validating form inputs
import { Form } from '@/components/ui/form'; // Custom form component
import { Button, Modal, ModalBody, ModalHeader, ModalContent, Input } from "@nextui-org/react"; // Import UI components
import { settings } from "@/actions/auth/settings"; // Import action to update email setting
import { Edit } from "iconsax-react"; // Icon component for the edit button
import { signOut } from "next-auth/react"; // Import sign-out function from next-auth

import { useRouter } from "next/navigation"; // Import for routing and redirects
import RedirectMessage from "../../../components/Redirection"; // Custom component to show redirect message

// Component for changing the user's email address
const ChangeEmailForm = ({ user }: { user: any }) => {
  // State to track errors and success messages
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  
  // Transition state for async actions
  const [isPending, startTransition] = useTransition();
  
  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const router = useRouter(); // Router instance for navigation

  // Initialize form handling with validation schema and default values
  const form = useForm<z.infer<typeof ChangeEmailSchema>>({
    resolver: zodResolver(ChangeEmailSchema),
    defaultValues: {
      changeEmail: false,
    },
  });

  // Open the edit email modal
  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  // Handle email change confirmation
  const handleConfirmChange = () => {
    startTransition(() => {
      settings({ changeEmail: true }) // Send request to change email
        .then((data) => {
          if (data.error) {
            setError(data.error); // Show error message if there's an error
          } else if (data.success) {
            setSuccess(data.success); // Show success message on success
            setIsSuccessModalOpen(true);
          }
        })
        .catch(() => { setError("Something went wrong") }) // Handle any unexpected errors
        .finally(() => {
          setIsModalOpen(false); // Close the confirmation modal after completion
        });
    });
  };

  // Standard sign-out function
  const handleSignOut = async () => {
    const result = await signOut(); 
  };

  // Custom sign-out function to clear cookies
  const customSignOut = async () => {
    await signOut({ redirect: false });
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    window.location.href = "/auth/login"; // Redirect to login page
  };

  // Handle success modal close and start sign-out redirect
  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    setIsRedirecting(true); // Start redirecting
    handleSignOut();
  };

  return (
    <>
      {/* Show redirect message when redirecting */}
      {isRedirecting ? (
        <RedirectMessage/>
      ) : (
        <div className="w-full max-w-lg p-4 rounded-3xl bg-background shadow-lg">
          <h2 className="text-base lg:text-2xl font-semibold mb-4 text-left">Change Email</h2>
          
          {/* Form for displaying email and edit button */}
          <Form {...form}>
            <form className="space-y-6">
              <div className="relative">
                <Input
                  className=""
                  value={user.email}
                  disabled
                  aria-label="email"
                  autoComplete="email"
                />
                {/* Button to open the email change modal */}
                <button
                  type="button"
                  aria-label="change-email"
                  onClick={handleEditClick}
                  className="absolute right-3 top-2 text-gray-500"
                >
                  <Edit size={20} />
                </button>
              </div>
              {error && <p className="text-red-500">{error}</p>} {/* Show error message */}
            </form>
          </Form>

          {/* Confirmation modal for changing email */}
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
                Confirm Email Change
              </ModalHeader>
              <ModalBody>
                <p id="modal-description">
                  Are you sure you want to change your email? 
                  This action is significant and will update your login credentials.
                </p>
              </ModalBody>
              {/* Buttons to confirm or cancel email change */}
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

          {/* Success modal that displays after email change */}
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
            </ModalContent>
          </Modal>
        </div>
      )}
    </>
  );
};

export default ChangeEmailForm;
