'use client'
import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button, Input, Spinner } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, TickCircle } from "iconsax-react";
import Image from "next/image";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  EmailIcon,
} from 'react-share';
import { useReferralModalStore } from "@/store/referralStore";
import { useReferralUrl } from "@/hooks/useReferralUrl";


export const ReferFriendModal = () => {
  const { isOpen, closeModal } = useReferralModalStore();
  const { referralUrl, isLoading, error } = useReferralUrl();
  const [copied, setCopied] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const successMessages = [
    "Boom! Link copied! Time to spread the love! 💌",
    "Your friends are going to thank you! 🎉",
    "Sharing is caring, and you've just aced it! 👏",
    "Let the good times roll with your friends! 🚀",
    "That link is ready for action! Let's go! 🌟",
    "Good things are coming your way. Link copied! 💫",
    "Now it's your friends' turn to shine! ✨",
    "Link locked and loaded. Fire away! 🔥"
  ];

  const getRandomSuccessMessage = () => {
    const randomIndex = Math.floor(Math.random() * successMessages.length);
    return successMessages[randomIndex];
  };

  const copyToClipboard = () => {
    if (referralUrl) {
      navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setSuccessMessage(getRandomSuccessMessage());
      setTimeout(() => {
        setCopied(false);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 5000);
      }, 1000);
    }
  };

  const shareTitle = "Join me on Beams and let's earn rewards together!";
  const emailSubject = "Check out this awesome platform!";
  const emailBody = `Hey there! I thought you might be interested in Beams.\n\n ${shareTitle}\n\n Here's my referral link:`;

  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={closeModal}
      className="py-4 z-[250] shadow-defined"
      placement="center"
      size="2xl"
      classNames={
        {
          wrapper: "z-[250]"
        }
      }
      
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-3 bg-background text-text p-6">
              <h1 className="font-poppins text-3xl font-bold">Share the Love! 🎉</h1>
              <p className="text-sm text-text opacity-80">
                Invite your friends and earn 20 Beams together.
              </p>
            </ModalHeader>
            <ModalBody className="">
              <motion.div
                className="flex flex-col items-center gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-full">
                  <Image
                    src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1728543913/authentication/gift-3d_yvf0u5.webp"
                    alt="Referral illustration"
                    width={200}
                    height={200}
                    className="mx-auto"
                  />
                </div>
              
                <div className="relative w-full">
                  {isLoading ? (
                    <div className="flex justify-center">
                      <Spinner size="lg" />
                    </div>
                  ) : error ? (
                    <p className="text-danger text-center">{error}</p>
                  ) : (
                    <Input
                      type="text"
                      value={referralUrl || ""}
                      readOnly
                      size="lg"
                      className="bg-background rounded-lg"
                      endContent={
                        <Button
                          isIconOnly
                          variant="flat"
                          size="sm"
                          onClick={copyToClipboard}
                          disabled={!referralUrl}
                          className="bg-brand text-white"
                        >
                          {copied ? (
                            <TickCircle className="h-5 w-5" />
                          ) : (
                            <Copy className="h-5 w-5" />
                          )}
                        </Button>
                      }
                    />
                  )}
                </div>
                <AnimatePresence>
                  {showSuccessMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-secondary-2 font-semibold text-center"
                    >
                      {successMessage}
                    </motion.div>
                  )}
                </AnimatePresence>
                {referralUrl && (
                  <div className="grid grid-cols-5 gap-4">
                    <FacebookShareButton url={referralUrl} title={emailBody}>
                      <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <TwitterShareButton url={referralUrl} title={shareTitle}>
                      <TwitterIcon size={32} round />
                    </TwitterShareButton>
                    <LinkedinShareButton url={referralUrl} title={shareTitle}>
                      <LinkedinIcon size={32} round />
                    </LinkedinShareButton>
                    <WhatsappShareButton url={referralUrl} title={shareTitle}>
                      <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                    <EmailShareButton url={referralUrl} subject={emailSubject} body={emailBody}>
                      <EmailIcon size={32} round />
                    </EmailShareButton>
                  </div>
                )}
              </motion.div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};