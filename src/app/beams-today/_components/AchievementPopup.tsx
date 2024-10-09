'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal, ModalContent, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import Image from 'next/image';
import { useRouter } from "next/navigation";

interface AchievementCompletionProps {
  isOpen: boolean;
  onClose: () => void;
  achievementName: string;
  badgeImageUrl: string;
  badgeColor: string;
}

export default function AchievementCompletionPopup({
  isOpen,
  onClose,
  achievementName,
  badgeImageUrl,
  badgeColor
}: AchievementCompletionProps) {
  const router = useRouter();

  useEffect(() => {
    console.log("AchievementCompletionPopup opened: ", isOpen);
  }, [isOpen]);

  const handleViewBadge = () => {
    console.log("Navigating to achievements");
    router.push('/achievements/#victory');
  };

  return (
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
                  alt="Achievement Badge"
                  width={250}
                  height={250}
                  className="rounded-full"
                />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mb-4 text-center text-2xl font-bold"
              >
                Badge Unlocked!
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                className=" text-center text-base"
              >
                Congratulations! You&apos;ve unlocked {achievementName}. Great job!
              </motion.div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              style={{
                backgroundColor: badgeColor,
              }}
              variant="shadow"
              onPress={handleViewBadge}
              className="w-full max-w-sm text-lg text-white font-semibold py-3 rounded-lg"
            >
              View my Badge
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </AnimatePresence>
  );
}