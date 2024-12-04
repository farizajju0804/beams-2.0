'use client'
import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, Button, Input, Spinner } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, TickCircle, Gift, PercentageSquare } from "iconsax-react";
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
import { shareMetadataConfig } from "@/constants/shareMetadata";

export function ReferFriendModal() {
  const { isOpen, closeModal } = useReferralModalStore();
  const { referralUrl, isLoading, error } = useReferralUrl();
  const [copied, setCopied] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { title, description, imageUrl } = shareMetadataConfig.referral;

  const successMessages = [
    "Boom! Link copied! Time to spread the love! 💌",
    "Your friends are going to be delighted! 🎉",
    "Yippee, sharing is caring! 🎈",
    "Let the good times roll with your friends! 🚀",
    "That link is ready for action! Let's go! 🌟",
    "Link copied! Feel the good vibes coming your way! 💫"
  ];

  // Platform-specific share content
  const shareContent = {
    whatsapp: {
      // Add extra line breaks and remove any extra spaces to ensure clean formatting
      text: `Hey! Check this out!

✨ I'm learning on Beams and thought you'd love it too!

🎁 Join using my link to get:
- 20 free Beams instantly
- Access to exclusive content
- Amazing learning experiences

Let's learn together! 🚀

Join here:`
    },
    facebook: {
      quote: `Join me on Beams and get 20 free Beams! 🎓
  
✨ Access exclusive content
📚 Learn emerging topics
💫 Earn while you learn
  
Join me in shaping the future of learning!`,
      hashtag: "#BeamsLearning"
    },
    twitter: {
      text: `🚀 Join me on @BeamsWorld and get 20 free Beams!
  
💡 Access exclusive content
📚 Learn emerging topics
✨ Earn while you learn
  
Start your journey here:`,
      hashtags: ['BeamsLearning', 'FutureOfLearning']
    },
    linkedin: {
      title: title,
      summary: `Join me on Beams and get 20 free Beams! 🎓
  
✨ Access exclusive content
📚 Learn emerging topics
💫 Earn while you learn
  
Join me in shaping the future of learning!`
    },
    email: {
      subject: "🎁 Join me on Beams - Get 20 Free Beams!",
      body: `Hey!
  
I'm excited to invite you to join Beams - an incredible learning platform I'm using to explore emerging topics and earn rewards.
  
🎁 When you join using my link:
• You'll get 20 Beams instantly
• Access exclusive content
• Learn cutting-edge topics
• Earn while you learn!
  
I'd love to have you join me on this learning adventure!`
    }
  };

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

      // Reset copy state after 3 seconds
      setTimeout(() => {
        setCopied(false);
        setShowSuccessMessage(false);
      }, 3000);
    }
  };

  const benefitRows = [
    {
      icon: <Gift variant="Bold" className="w-6 h-6 text-primary" />,
      title: "Get 20 Beams Each",
      description: "You and your friend both receive 20 Beams when your friend signs up."
    },
    {
      icon: <PercentageSquare variant="Bold" className="w-6 h-6 text-primary" />,
      title: `Earn ${NETWORK_POINTS_PERCENTAGE*100}% Bonus`,
      description: `Get ${NETWORK_POINTS_PERCENTAGE*100}% of all Beams your friends earn.`
    }
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
                    width={200}
                    height={200}
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
                    <FacebookShareButton 
                      url={referralUrl}
                      title={shareContent.facebook.quote}
                      hashtag={shareContent.facebook.hashtag}
                    >
                      <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    
                    <TwitterShareButton 
                      url={referralUrl}
                      title={shareContent.twitter.text}
                      hashtags={shareContent.twitter.hashtags}
                    >
                      <TwitterIcon size={32} round />
                    </TwitterShareButton>
                    
                    <LinkedinShareButton 
                      url={referralUrl}
                      title={shareContent.linkedin.title}
                      summary={shareContent.linkedin.summary}
                    >
                      <LinkedinIcon size={32} round />
                    </LinkedinShareButton>
                    
                    <WhatsappShareButton 
                      url={referralUrl}
                      title={shareContent.whatsapp.text}
                       
                    >
                      <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                    
                    <EmailShareButton 
                      url={referralUrl}
                      subject={shareContent.email.subject}
                      body={shareContent.email.body}
                      separator="\n\n"
                    >
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
}