import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, Button } from "@nextui-org/react";
import confetti from 'canvas-confetti';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  username?: string;
  beams?: number;
}

interface CelebrationMessage {
  text: string;
}

const balloonConfetti = () => {
  const scalar = 2;
  const balloon = confetti.shapeFromText({ text: "🎈", scalar });
  
  const defaults = {
    spread: 360,
    ticks: 60,
    gravity: 0.5,
    decay: 0.94,
    startVelocity: 10,
    shapes: [balloon],
    scalar,
    colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
  };

  const shoot = () => {
    confetti({
      ...defaults,
      particleCount: 30,
    });
    confetti({
      ...defaults,
      particleCount: 5,
      scalar: scalar * 1.2
    });
    confetti({
      ...defaults,
      particleCount: 15,
      scalar: scalar / 2,
      shapes: ["circle"],
    });
  };

  setTimeout(shoot, 0);
  setTimeout(shoot, 100);
  setTimeout(shoot, 200);
};

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
      balloonConfetti();
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      backdrop="blur"
      classNames={{
        base: "bg-background",
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
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-6 items-center justify-center">
               
                <div className="text-center">  
                <p className="text-7xl mb-2 text-center mx-auto">🎈</p>              
                  <p className="text-lg  font-medium text-grey-2">
                    You have earned
                  </p>
                  <p className="text-4xl font-bold text-grey-2 mt-2">
                    {beams} Beams
                  </p>
                </div>
                
                <div className="text-center px-6">
                  <p className="text-lg italic text-grey-2">
                    {currentMessage.text}
                  </p>
                </div>
                
                <div className="flex justify-center pt-2">
                  <Button
                    color="primary"
                    size="lg"
                    radius="md"
                    onClick={onClose}
                    className="font-semibold text-white px-6"
                  >
                    I&apos;m Ready for More!
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