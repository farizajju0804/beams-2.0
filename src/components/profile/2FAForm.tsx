'use client';

import React, { useState, useTransition, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Button, Modal, ModalBody, ModalHeader, ModalContent, Switch } from "@nextui-org/react";
import { settings } from "@/actions/auth/settings";

interface TwoFactorAuthFormProps {
  user: {
    id: string;
    isTwoFactorEnabled: boolean;
  };
}

const TwoFactorAuthForm: React.FC<TwoFactorAuthFormProps> = ({ user }) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setModalOpen] = useState(false);
  const [is2FAEnabled, set2FAEnabled] = useState(user.isTwoFactorEnabled);

  useEffect(() => {
    set2FAEnabled(user.isTwoFactorEnabled);
  }, [user.isTwoFactorEnabled]);

  const handleToggle = () => {
    setModalOpen(true);
  };

  const handleConfirmChange = () => {
    startTransition(() => {
      settings({ isTwoFactorEnabled: !is2FAEnabled })
        .then((data) => {
          if (data.error) {
            setError(data.error);
            toast.error(data.error);
          } else if (data.success) {
            setSuccess(data.success);
            set2FAEnabled(!is2FAEnabled);
            toast.success(data.success);
          }
        })
        .catch(() => {
          setError("Something went wrong");
          toast.error("Something went wrong");
        })
        .finally(() => setModalOpen(false));
    });
  };

  const modalContent = is2FAEnabled
    ? "Are you sure you want to disable Two-Factor Authentication? You will no longer receive a 2FA code to your email for login."
    : "Are you sure you want to enable Two-Factor Authentication? You will receive a 2FA code to your email for login.";

  return (
    <div className="w-full max-w-lg p-4 rounded-3xl bg-background shadow-lg">
      <Toaster position="top-center" />
      <h2 className="text-base lg:text-2xl font-semibold mb-4 text-left">
        Two-Factor Authentication
      </h2>

      <form className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-grey-2 font-medium">
            {is2FAEnabled ? "Disable Two-Factor Authentication" : "Enable Two-Factor Authentication"}
          </p>
          <Switch isSelected={is2FAEnabled} onChange={handleToggle} />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {/* {success && <p className="text-green-500">{success}</p>} */}
      </form>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <ModalContent>
          <ModalHeader>
            <h2 className="text-lg font-semibold">Confirm Action</h2>
          </ModalHeader>
          <ModalBody>
            <p>{modalContent}</p>
          </ModalBody>
          <div className="flex justify-end p-4">
            <Button  onClick={() => setModalOpen(false)}>
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
