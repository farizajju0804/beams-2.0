import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@nextui-org/react";

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  username?: string;
  beams?: number;
}

interface CelebrationMessage {
  text: string;
}

const CelebrationModal: React.FC<CelebrationModalProps> = ({ 
  isOpen, 
  onClose, 
  username = "User", 
  beams = 0 
}) => {
  const [currentMessage, setCurrentMessage] = useState<CelebrationMessage>({
    text: ""
  });
  
  const celebrationMessages: CelebrationMessage[] = [
    {
      text: "You're on fire! "
    },
    {
      text: "Amazing work!"
    },
    {
      text: "Spectacular achievement!"
    },
    {
      text: "Brilliant performance!"
    },
    {
      text: "Outstanding job!"
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
        base: "bg-white",
        header: "border-b-0",
        body: "py-6",
        closeButton: "hover:bg-gray-100",
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
                <h2 className="text-xl font-semibold text-center text-text">
                  Congratulations {username}!
                </h2>
                {/* <span className="text-2xl">🎈</span> */}
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-6 items-center justify-center">
                {/* Beams Display */}
                <span className="text-5xl text-center mx-auto">🎈</span>
                <div className="text-center">
                
                  <span className="text-lg font-medium text-grey-2">
                    You have earned
                  </span>
                  <p className="text-4xl font-bold text-grey-2 mt-2">
                    {beams} Beams
                  </p>
                </div>

                {/* Celebration Message */}
                <div className="text-center px-6">
                  <p className="text-lg text-grey-2">
                    {currentMessage.text}
                  </p>
                </div>

                {/* Action Button */}
                <div className="flex justify-center pt-2">
                  <Button
                    color="primary"
                    size="lg"
                    radius="md"
                    onClick={onClose}
                    className="font-semibold text-white px-6"
                  >
                    Continue
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