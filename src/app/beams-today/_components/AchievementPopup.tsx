'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal, ModalContent, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import Image from 'next/image';
import { CloseCircle } from 'iconsax-react';

import { useRouter } from "next/navigation";
import TasksAlert from './TasksAlert';

interface AchievementCompletionProps {
  isOpen: boolean;
  onClose: () => void;
  achievementName: string;
  completedTasks: number;
  totalTasks: number;
  badgeImageUrl: string;
  progressColor: string;
}

export default function AchievementCompletion({
  isOpen,
  onClose,
  achievementName,
  completedTasks,
  totalTasks,
  badgeImageUrl,
  progressColor
}: AchievementCompletionProps) {
  const [animatedCount, setAnimatedCount] = useState(0);
  const [showTasksAlert, setShowTasksAlert] = useState(false);  // New state to control alert visibility
  const router = useRouter();

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

  // Delay showing the TasksAlert to prevent it from showing immediately on page load
  useEffect(() => {
    if (completedTasks < totalTasks) {
      // Set a delay to show the alert (e.g., 1 second delay)
      const alertTimer = setTimeout(() => {
        setShowTasksAlert(true);
      }, 1000);

      return () => clearTimeout(alertTimer);
    }
  }, [completedTasks, totalTasks]);

  // Calculate the motivational message based on progress
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
    <>
      {completedTasks >= totalTasks ? (
        <AnimatePresence>
          <Modal
            isOpen={isOpen}
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
                  View my Badge
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </AnimatePresence>
      ) : (
        showTasksAlert && (  // Only show the alert if it's toggled after the delay
          <TasksAlert
            message={motivationalMessage}
            completedTasks={completedTasks}
            totalTasks={totalTasks}
            badgeName={achievementName}
            color={progressColor}    // Pass progress color
          />
        )
      )}
    </>
  );
}