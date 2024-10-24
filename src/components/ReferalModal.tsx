'use client'
import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button, Input, Spinner } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, TickCircle, Gift, Coin, People, PercentageSquare } from "iconsax-react";
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
import { NETWORK_POINTS_PERCENTAGE } from "@/constants/pointsConstants";

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
   
        setShowSuccessMessage(true);

     
    }
  };

  const shareTitle = "Join me on Beams and let's earn rewards together!";
  const emailSubject = "Check out this awesome platform!";
  const emailBody = `Hey there! I thought you might be interested in Beams.\n\n ${shareTitle}\n\n Here's my referral link:`;

  const benefitRows = [
    {
      icon: <Gift variant="Bold" className="w-6 h-6 text-primary" />,
      title: "Get 20 Beams Each",
      description: "You and your friend both receive 20 Beams when your friend signs up."
    },
    {
      icon: <PercentageSquare variant="Bold" className="w-6 h-6 text-primary" />,
      title: `Earn ${NETWORK_POINTS_PERCENTAGE*100}% Bonus`,
      description: `Get ${NETWORK_POINTS_PERCENTAGE*100}%  of all Beams your friends earn.`
    },
    // {
    //   icon: <People variant="Bold" className="w-6 h-6 text-primary" />,
    //   title: "Referral Chain",
    //   description: "Bonus doesn't apply to points from your friend's referrals"
    // }
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={closeModal}
      className="py-4 z-[250] shadow-defined"
      placement="auto"
      size="2xl"
      classNames={{
        wrapper: "z-[250]"
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col bg-background text-text p-2">
              <motion.h1 
                className="font-poppins text-2xl md:text-3xl px-4 font-bold"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Share the Love! 🎉
              </motion.h1>
            </ModalHeader>
            <ModalBody className="px-6">
              <motion.div
                className="flex flex-col items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-full max-w-sm">
                  <Image
                    src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1728543913/authentication/gift-3d_yvf0u5.webp"
                    alt="Referral illustration"
                    width={125}
                    height={125}
                    className="mx-auto"
                  />
                </div>

                <div className="w-full space-y-3">
                  {benefitRows.map((row, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="w-full bg-default-50 rounded-lg p-2 flex items-center gap-4"
                    >
                      <div className="bg-primary/10 p-2 rounded-full">
                        {row.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 text-sm">{row.title}</h3>
                        <p className="text-xs">{row.description}</p>
                      </div>
                    </motion.div>
                  ))}
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
                      size="md"
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
                      className="text-secondary-2 mb-2 font-medium text-base text-center"
                    >
                      {successMessage}
                    </motion.div>
                  )}
                </AnimatePresence>

                {referralUrl && (
                  <motion.div 
                    className="grid grid-cols-5 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
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
                  </motion.div>
                )}
              </motion.div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};