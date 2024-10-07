import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { DynamicIcon } from './DynamicComponent';
import { Level } from '@prisma/client';
import PointsAlert from './PointsAlert';
import AchievementPopup from '@/app/beams-today/_components/AchievementPopup';

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  levelUp: boolean;
  currentLevel: Level;
  pointsAdded: number;
  beams: number;
  achievement?: {
    isAlreadyCompleted: boolean;
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
  "You're on fire! 🔥 Keep blazing through those lessons!",
  "Wow! You're learning faster than a cheetah on a caffeine rush! ☕️🐆",
  "You're not just smart, you're brilliant! 🌟 Einstein would be jealous!",
  "You're collecting points like a squirrel hoarding nuts for winter! 🐿️",
  "Your brain must be huge! 🧠 How do you even fit it in your head?",
  "You're not just climbing the learning ladder, you're taking the express elevator! 🚀",
  "If knowledge was a currency, you'd be Jeff Bezos rich! 💰",
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
  "Your learning curve is so steep, it's practically vertical! 📈",
  "You're not just breaking records, you're setting new standards! 🏆",
  "If enthusiasm was electricity, you could power a small city! ⚡️🏙️"
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
  const [showAchievementPopup, setShowAchievementPopup] = useState(false);
  const [pointsAlertClosed, setPointsAlertClosed] = useState(false);
  const [showModal, setShowModal] = useState(isOpen);
  const defaultIcon = 'fa/FaStar';
  const defaultColor = '#FFD700';

  useEffect(() => {
    if (isOpen) {
      setCount(0);
      setShowModal(true);
      setPointsAlertClosed(false);
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

      if (!levelUp) {
        setShowModal(false);
        setShowPointsAlert(true);
      }

      return () => clearInterval(timer);
    }
  }, [isOpen, pointsAdded, levelUp]);

  const handleClose = () => {
    setShowModal(false);
    if (!levelUp) {
      setShowPointsAlert(true);
    } else {
      if (achievement && !achievement.isAlreadyCompleted) {
        setShowAchievementPopup(true);
      } else {
        onClose();
      }
    }
  };

  const handlePointsAlertClose = () => {
    setShowPointsAlert(false);
    setPointsAlertClosed(true);
  };

  const handleAchievementPopupClose = () => {
    setShowAchievementPopup(false);
    onClose();
  };

  useEffect(() => {
    if (pointsAlertClosed && achievement && !achievement.isAlreadyCompleted) {
      const timer = setTimeout(() => {
        setShowAchievementPopup(true);
      }, 300); // Small delay to prevent abrupt appearance
      return () => clearTimeout(timer);
    } else if (pointsAlertClosed) {
      onClose();
    }
  }, [pointsAlertClosed, achievement, onClose]);
  return (
    <>
      <AnimatePresence>
        {showModal && levelUp && (
          <Modal 
            isOpen={showModal} 
            onClose={handleClose}
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
                  onPress={handleClose}
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
        {showPointsAlert && (
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

      <AnimatePresence>
        {showAchievementPopup && achievement && (
          <AchievementPopup
            isOpen={showAchievementPopup}
            onClose={handleAchievementPopupClose}
            achievementName={achievement.achievement.achievementName}
            completedTasks={achievement.progress}
            totalTasks={achievement.achievement.totalCount}
            badgeImageUrl={achievement.achievement.badgeImageUrl}
            progressColor={achievement.achievement.color}
          />
        )}
      </AnimatePresence>
    </>
  );
}