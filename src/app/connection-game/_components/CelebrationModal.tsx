import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@nextui-org/react";
import { 
  Star1, 
  Crown, 
  EmojiHappy,
  Medal,
  Like1
} from "iconsax-react";

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  username?: string;
  points?: number;
}

interface CelebrationMessage {
  text: string;
  icon: JSX.Element;
}

const CelebrationModal: React.FC<CelebrationModalProps> = ({ 
  isOpen, 
  onClose, 
  username = "User", 
  points = 0 
}) => {
  const [currentMessage, setCurrentMessage] = useState<CelebrationMessage>({
    text: "",
    icon: <Star1 variant="Bulk" className="text-yellow-500" size={32}/>
  });
  
  const celebrationMessages: CelebrationMessage[] = [
    {
      text: "You're on fire! Keep crushing those goals!",
      icon: <Medal variant="Bulk" className="text-yellow-500" size={32}/>
    },
    {
      text: "Amazing work! You're reaching new heights!",
      icon: <Star1 variant="Bulk" className="text-yellow-500" size={32}/>
    },
    {
      text: "Spectacular achievement! You're unstoppable!",
      icon: <Like1 variant="Bulk" className="text-yellow-500" size={32}/>
    },
    {
      text: "Brilliant performance! You're a superstar!",
      icon: <Crown variant="Bulk" className="text-yellow-500" size={32}/>
    },
    {
      text: "Outstanding job! You're making magic happen!",
      icon: <EmojiHappy variant="Bulk" className="text-yellow-500" size={32}/>
    }
  ];

  useEffect(() => {
    if (isOpen) {
      const randomIndex = Math.floor(Math.random() * celebrationMessages.length);
      setCurrentMessage(celebrationMessages[randomIndex]);
    }
  }, [isOpen]);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      placement="center"
      backdrop="blur"
      classNames={{
        backdrop: "bg-gradient-to-t from-zinc-900/50 to-zinc-900/50",
        base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
        header: "border-b-[1px] border-[#292f46]",
        body: "py-6",
        closeButton: "hover:bg-white/5 active:bg-white/10",
      }}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        }
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center justify-center space-x-2">
                <Medal
                  variant="Bulk"
                  className="text-yellow-500 animate-bounce"
                  size={32}
                />
                <h2 className="text-2xl font-bold text-center text-white">
                  Congratulations, {username}!
                </h2>
                <Medal
                  variant="Bulk"
                  className="text-yellow-500 animate-bounce"
                  size={32}
                />
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                {/* Points Display */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-400 opacity-25 blur-lg "></div>
                  <div className="relative bg-white/10 rounded-xl p-6 backdrop-blur-sm border border-white/20">
                    <div className="flex items-center justify-center gap-4">
                      <Star1 variant="Bold" className="text-primary" size={40}/>
                      <div className="text-center">
                        <p className="text-4xl font-bold text-white">
                          {points}
                        </p>
                        <p className="text-sm text-gray-300">
                          POINTS EARNED
                        </p>
                      </div>
                      <Star1 variant="Bold" className="text-primary" size={40}/>
                    </div>
                  </div>
                </div>

                {/* Celebration Message */}
                <div className="text-center space-y-4">
                  {/* <div className="flex justify-center">
                    {currentMessage.icon}
                  </div> */}
                  <p className="text-lg text-gray-300 italic">
                    {currentMessage.text}
                  </p>
                </div>

                {/* Action Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    className="bg-primary text-white font-semibold"
                    size="lg"
                    radius="full"
                    onClick={onClose}
                  >
                    Continue Your Journey
                  </Button>
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CelebrationModal;