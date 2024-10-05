import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { IoTrendingUp } from 'react-icons/io5';
import { Award, CloseCircle } from 'iconsax-react';
import { FaTimes } from 'react-icons/fa';
import IconFillingEffect from './IconFillingEffect';
import LevelName from './LevelName';
import { DynamicIcon } from './DynamicComponent';
import { Level } from '@prisma/client';

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  levelUp: boolean;
  currentLevel: Level;
  pointsAdded: number;
  beams: number;
}

const motivationalMessages: string[] = [
  "You're on fire! 🔥 Keep blazing through those lessons!",
  "Wow! You're learning faster than a cheetah on a caffeine rush! ☕️🐆",
  // ... (rest of the messages)
];

export default function RewardsModal({
  isOpen,
  onClose,
  levelUp,
  currentLevel,
  pointsAdded,
  beams
}: RewardsModalProps) {
  const [count, setCount] = useState(0);
  const [motivationalMessage, setMotivationalMessage] = useState("");
  const { isOpen: modalIsOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (isOpen) {
      const pickedMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
      setMotivationalMessage(pickedMessage);
      if (levelUp) {
        confetti({
          spread: 70,
          startVelocity: 30,
          particleCount: 100,
          origin: { y: 0.6 },
        });
      }

      const timer = setInterval(() => {
        setCount((prevCount) => {
          if (prevCount < pointsAdded) {
            return prevCount + Math.ceil((pointsAdded - prevCount) / 10);
          }
          clearInterval(timer);
          return prevCount;
        });
      }, 100);

      return () => clearInterval(timer);
    }
  }, [isOpen, pointsAdded, levelUp]);

  return (
    <AnimatePresence>
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement='center'
        onClose={onClose}
        motionProps={{
          variants: {
            enter: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.8 }
          },
          transition: { type: 'spring', damping: 15 }
        }}
      >
        <ModalContent className="bg-background max-w-md overflow-hidden rounded-lg text-text shadow-xl">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {levelUp && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold"
                  >
                    Level Up!
                  </motion.div>
                )}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 10, delay: 0.4 }}
                    className="mb-4 rounded-full bg-background shadow-defined p-4"
                  >
                    <DynamicIcon icon={currentLevel.icon} size={80} style={{ color: currentLevel.bgColor }} />
                  </motion.div>

                  <div className='flex flex-col gap-4 items-center justify-center'>
                    <IconFillingEffect
                      icon={currentLevel.icon}
                      minPoints={currentLevel.minPoints}
                      maxPoints={currentLevel.maxPoints}
                      filledColor={currentLevel.bgColor}
                      beams={beams}
                    />

                    <span className="text-base font-semibold">
                      Level {currentLevel.levelNumber} - {currentLevel.name}
                    </span>
                    {levelUp && 
                      <span className="text-sm font-medium italic">
                        {currentLevel.caption}
                      </span>
                    }
                  </div>

                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    style={{ color: currentLevel.bgColor }} 
                    className="text-6xl font-bold mt-6"
                  >
                    +{count}
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="my-2 text-xl font-semibold"
                  >
                    Beams Earned
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="mt-4 mb-4 text-center text-sm"
                  >
                    {motivationalMessage}
                  </motion.div>
                </div>
              </ModalBody>
           
            </>
          )}
        </ModalContent>
      </Modal>
    </AnimatePresence>
  );
}