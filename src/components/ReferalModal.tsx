import React, { useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button, Input } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Copy, TickCircle } from "iconsax-react";
import Image from "next/image";

export const ReferFriendModal = ({ isOpen, onOpenChange, referralUrl }: any) => {
  const [copied, setCopied] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Array of creative success messages
  const successMessages = [
    "Boom! Link copied! Time to spread the love! 💌",
    "Your friends are going to thank you! 🎉",
    "Sharing is caring, and you’ve just aced it! 👏",
    "Let the good times roll with your friends! 🚀",
    "That link is ready for action! Let’s go! 🌟",
    "Good things are coming your way. Link copied! 💫",
    "Now it’s your friends’ turn to shine! ✨",
    "Link locked and loaded. Fire away! 🔥"
  ];

  // Function to randomly select a success message
  const getRandomSuccessMessage = () => {
    const randomIndex = Math.floor(Math.random() * successMessages.length);
    return successMessages[randomIndex];
  };

  const copyToClipboard = () => {
    if (referralUrl) {
      navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setSuccessMessage(getRandomSuccessMessage()); // Set a random success message
      setTimeout(() => {
        setCopied(false);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 5000);
      }, 1000);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={onOpenChange}
      className="py-4 z-[250]"
      placement="center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-3">
              <h1 className="font-poppins text-2xl">Share the love!</h1>
              <p className="text-sm text-text">
                Invite your friends and earn rewards together.
              </p>
            </ModalHeader>
            <ModalBody>
              <motion.div
                className="flex flex-col items-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1728300180/authentication/referal_zh5k3s.webp"
                  alt="Referral illustration"
                  width={200}
                  height={200}
                />
                
                <p className="text-center text-sm text-grey-2">
                  Share this unique link with your friends:
                </p>
                <div className="relative w-full">
                  <Input
                    type="text"
                    value={referralUrl || ""}
                    readOnly
                    endContent={
                      <Button
                        isIconOnly
                        variant="light"
                        onClick={copyToClipboard}
                        disabled={!referralUrl}
                      >
                        {copied ? (
                          <TickCircle variant="Bold" className="text-success" />
                        ) : (
                          <Copy />
                        )}
                      </Button>
                    }
                  />
                </div>
                <AnimatePresence>
                  {showSuccessMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-text font-semibold text-center"
                    >
                      {successMessage} {/* Show random success message */}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
