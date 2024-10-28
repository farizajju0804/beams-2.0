'use client';

import React, { useState, useTransition, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast"; // Import toast notifications
import { Button, Modal, ModalBody, ModalHeader, ModalContent, Switch } from "@nextui-org/react"; // Import UI components
import { settings } from "@/actions/auth/settings"; // Import the settings action for updating the 2FA setting

// Define props structure for the TwoFactorAuthForm component
interface TwoFactorAuthFormProps {
  user: {
    id: string;
    isTwoFactorEnabled: boolean;
  };
}

// Component to handle enabling or disabling two-factor authentication (2FA)
const TwoFactorAuthForm: React.FC<TwoFactorAuthFormProps> = ({ user }) => {
  const [error, setError] = useState<string | undefined>(""); // State for error messages
  const [isPending, startTransition] = useTransition(); // Manages the transition state of async updates
  const [isModalOpen, setModalOpen] = useState(false); // State to control modal visibility
  const [is2FAEnabled, set2FAEnabled] = useState(user.isTwoFactorEnabled); // Tracks 2FA status based on user data

  // Sync `is2FAEnabled` state with user prop whenever it changes
  useEffect(() => {
    set2FAEnabled(user.isTwoFactorEnabled);
  }, [user.isTwoFactorEnabled]);

  // Opens the modal when the user toggles the 2FA switch
  const handleToggle = () => {
    setModalOpen(true);
  };

  // Confirms the toggle change and calls the settings function to update the server
  const handleConfirmChange = () => {
    startTransition(() => {
      settings({ isTwoFactorEnabled: !is2FAEnabled }) // Toggle the 2FA setting
        .then((data) => {
          if (data.error) { // If there's an error, show error message
            setError(data.error);
            toast.error(data.error);
          } else if (data.success) { // On success, update local state and show success message
            set2FAEnabled(!is2FAEnabled);
            toast.success(data.success);
          }
        })
        .catch(() => { // Handle any errors during the request
          setError("Something went wrong");
          toast.error("Something went wrong");
        })
        .finally(() => setModalOpen(false)); // Close modal after completion
    });
  };

  // Conditional message for modal content based on 2FA status
  const modalContent = is2FAEnabled
    ? "Disable 2FA? You'll no longer need an email code to log in."
    : "Enable 2FA? You'll need an email code for extra security when logging in.";

  return (
    <div className="w-full max-w-lg p-4 rounded-3xl bg-background shadow-lg">
      {/* Displays toast notifications in the center */}
      <Toaster position="top-center" />
      <h2 className="text-base lg:text-2xl font-semibold mb-4 text-left">
        Two-Factor Authentication
      </h2>

      {/* Form section for enabling/disabling 2FA */}
      <form className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-grey-2 font-medium">
            {is2FAEnabled ? "Disable Two-Factor Authentication" : "Enable Two-Factor Authentication"}
          </p>
          {/* Switch component to toggle 2FA status */}
          <Switch aria-label="2FA" isSelected={is2FAEnabled} onChange={handleToggle} />
        </div>
        {/* Display error message if there's an error */}
        {error && <p className="text-red-500">{error}</p>}
      </form>

      {/* Confirmation modal for toggling 2FA */}
      <Modal
        aria-label="2FA Modal"
        classNames={{
          wrapper: "z-[250]"
        }}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      >
        <ModalContent>
          <ModalHeader>
            <h2 className="text-lg font-semibold">Confirm Action</h2>
          </ModalHeader>
          <ModalBody>
            <p>{modalContent}</p>
          </ModalBody>
          {/* Buttons for confirming or canceling the 2FA toggle */}
          <div className="flex justify-end p-4">
            <Button onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmChange} color="primary" className="ml-2 text-white font-medium">
              Confirm
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default TwoFactorAuthForm;
