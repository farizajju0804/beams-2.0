import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { DynamicIcon } from './DynamicComponent';
import { Level } from '@prisma/client';
import PointsAlert from './PointsAlert';


interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  levelUp: boolean;
  currentLevel: Level;
  pointsAdded: number;
  beams: number;
  achievement?: {
    isFirstTimeCompletion: boolean;
    achievement: {
      achievementName: string;
      totalCount: number;
      badgeImageUrl: string;
      color: string;
    };
    progress: number;
  };
}

const motivationalMessages: string[] = [
 "You're on fire! 🔥 Keep blazing through! ",
"Wow! You're learning faster than a cheetah on a caffeine rush! ☕️🐆",
"You're not just smart, you're brilliant! 🌟 ",
"You're collecting points like a squirrel hoarding nuts for winter! 🐿️",
"You're not just climbing the learning ladder, you're taking the express elevator! ",
"If knowledge was a currency, you'd be Jeff Bezos rich by now! 💰",
"Your dedication is so bright, I need sunglasses! 😎",
"You're not just reaching for the stars, you're becoming one! ⭐️",
"Your progress is more impressive than a cat learning to bark! 🐱🐶",
"You're absorbing knowledge like a sponge in an ocean of wisdom! 🌊🧽",
"If learning was an Olympic sport, you'd be taking home the gold! 🥇",
"You're not just thinking outside the box, you've built a rocket ship! 🚀📦",
"Your brain must be doing push-ups because it's getting stronger every day! 💪🧠",
"You're leveling up faster than a video game character with cheat codes! 🎮",
"Your curiosity is more infectious than a yawn in a boring meeting! 🥱😃",
"You're not just connecting dots, you're creating constellations! ✨",
"You're not just breaking records, you're setting new standards! 🏆💫",
"If enthusiasm was electricity, you could power a small city by now!⚡️🏙️"
];

export default function RewardsModal({
  isOpen,
  onClose,
  levelUp,
  currentLevel,
  pointsAdded,
  beams,
  achievement
}: RewardsModalProps) {
  const [count, setCount] = useState(0);
  const [motivationalMessage, setMotivationalMessage] = useState("");
  const [showPointsAlert, setShowPointsAlert] = useState(false);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const defaultIcon = 'fa/FaStar';
  const defaultColor = '#FFD700';

  useEffect(() => {
    if (isOpen) {
      setCount(0);
      setMotivationalMessage(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]);

      if (levelUp) {
        console.log("Level up detected, showing level up modal");
        setShowLevelUpModal(true);
      } else {
        console.log("No level up, showing points alert");
        setShowPointsAlert(true);
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

  const handleLevelUpModalClose = () => {
    console.log("LevelUpModal closed");
    setShowLevelUpModal(false);
    onClose()
   
  };

  const handlePointsAlertClose = () => {
    console.log("PointsAlert closed");
    setShowPointsAlert(false);
    onClose()
   
  };




  useEffect(() => {
    if (showLevelUpModal) {
      confetti({
        spread: 70,
        startVelocity: 30,
        particleCount: 100,
        origin: { y: 0.6 },
      });
    }
  }, [showLevelUpModal]);

  return (
    <>
      <AnimatePresence>
        {isOpen && levelUp && (
          <Modal 
            isOpen={isOpen} 
            onClose={handleLevelUpModalClose}
            placement="center"
            motionProps={{
              variants: {
                enter: { opacity: 1, scale: 1 },
                exit: { opacity: 0, scale: 0.8 }
              },
              transition: { type: 'spring', damping: 15 }
            }}
          >
            <ModalContent className="bg-background max-w-md overflow-hidden rounded-lg text-text shadow-xl">
              <ModalHeader className="flex flex-col gap-1">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold"
                >
                  Level Up!
                </motion.div>
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
                    <span className="text-base font-semibold">
                      Level {currentLevel.levelNumber} - {currentLevel.name}
                    </span>

                    <span className="text-sm font-medium italic">
                      {currentLevel.caption}
                    </span>
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
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  style={{
                    backgroundColor: currentLevel.bgColor,
                  }}
                  variant="shadow"
                  onPress={handleLevelUpModalClose}
                  className="w-full max-w-sm text-lg text-white font-semibold py-3 rounded-lg"
                >
                  Continue
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPointsAlert && !levelUp && (
          <PointsAlert
            message={motivationalMessage}
            points={pointsAdded}
            icon={currentLevel?.icon || defaultIcon}
            color={currentLevel?.bgColor || defaultColor}
            duration={6000}
            onClose={handlePointsAlertClose}
          />
        )}
      </AnimatePresence>
    
    </>
  );
}