"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CloseCircle } from "iconsax-react";
import { useRouter } from "next/navigation";

interface AchievementCompletionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  achievementName: string;
  completedTasks: number;
  totalTasks: number;
  badgeImageUrl: string;
  progressColor: string;
}

export default function AchievementCompletionPopup({
  isOpen,
  onClose,
  achievementName,
  completedTasks,
  totalTasks,
  badgeImageUrl,
  progressColor,
}: AchievementCompletionPopupProps) {
  const [animatedCount, setAnimatedCount] = useState(0);
  const router = useRouter();
  const { isOpen: modalIsOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (isOpen) {
      const timer = setInterval(() => {
        setAnimatedCount((prevCount) => {
          if (prevCount < completedTasks) {
            return prevCount + 1;
          }
          clearInterval(timer);
          return prevCount;
        });
      }, 200);

      return () => clearInterval(timer);
    }
  }, [isOpen, completedTasks]);

  const motivationalMessage = useMemo(() => {
    const progressPercentage = (completedTasks / totalTasks) * 100;

    if (progressPercentage === 0) {
      return "You're just getting started! The journey begins now!";
    } else if (progressPercentage > 0 && progressPercentage <= 10) {
      return "Great start! You're making the first strides—keep moving!";
    } else if (progressPercentage > 10 && progressPercentage <= 20) {
      return "You're getting into the groove! Keep that momentum!";
    } else if (progressPercentage > 20 && progressPercentage <= 30) {
      return "You've hit a stride! Every step counts—keep going!";
    } else if (progressPercentage > 30 && progressPercentage <= 40) {
      return "You're nearly halfway! You're really building momentum now!";
    } else if (progressPercentage > 40 && progressPercentage <= 50) {
      return "Halfway there! The finish line is in sight!";
    } else if (progressPercentage > 50 && progressPercentage <= 60) {
      return "You're past the halfway mark—keep pushing forward!";
    } else if (progressPercentage > 60 && progressPercentage <= 80) {
      return "You're making serious progress now—just a little more!";
    } else if (progressPercentage > 80 && progressPercentage < 100) {
      return "Almost there! Just a few more steps to complete it!";
    } else if (progressPercentage === 100) {
      return `Congratulations! You've completed "${achievementName}"! Celebrate your success!`;
    }

    return "Keep up the great work! You're doing something wonderful.";
  }, [completedTasks, totalTasks, achievementName]);

  const handleStreakCTA = () => {
    if (animatedCount >= totalTasks) {
      router.push('/achievements/#victory');
    } else {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        onClose={onClose}
        motionProps={{
          variants: {
            enter: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.8 }
          },
          transition: { type: 'spring', damping: 15 }
        }}
        classNames={{
          backdrop: "bg-black bg-opacity-50",
          base: "max-w-md bg-background rounded-lg shadow-defined",
          header: "border-b-0",
          body: "p-6",
          closeButton: "absolute right-2 top-2 z-50",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
             
              <ModalBody>
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 10, delay: 0.4 }}
                    className="mb-6 rounded-full bg-background p-4"
                  >
                    <Image
                      src={badgeImageUrl}
                      alt="Badge"
                      width={250}
                      height={250}
                      className="rounded-full"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mb-4 text-center text-base font-medium"
                  >
                    {motivationalMessage}
                  </motion.div>

                  <div className="w-full flex items-center justify-center gap-1">
                    {[...Array(totalTasks)].map((_, index) => (
                      <motion.div
                        key={index}
                        initial={{ backgroundColor: "#E5E7EB" }}
                        animate={{
                          backgroundColor: index < animatedCount ? progressColor : "#E5E7EB",
                        }}
                        className={`h-6 w-6 rounded-md`}
                      />
                    ))}
                  </div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-4 text-center text-lg font-medium"
                  >
                    {completedTasks} of {totalTasks} done
                  </motion.div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  style={{
                    backgroundColor: progressColor,
                  }}
                  variant="shadow"
                  onPress={handleStreakCTA}
                  className="w-full max-w-sm text-lg text-white font-semibold py-3 rounded-lg"
                >
                  {completedTasks >= totalTasks ? 'View my Badge' : "I'm committed"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </AnimatePresence>
  );
}