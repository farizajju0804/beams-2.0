'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal, ModalContent, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import Image from 'next/image';
import { useRouter } from "next/navigation";

interface AchievementCompletionProps {
  isOpen: boolean; // Controls the visibility of the modal
  onClose: () => void; // Function to call when closing the modal
  achievementName: string; // Name of the achievement that was completed
  badgeImageUrl: string; // URL of the badge image to display
  badgeColor: string; // Background color for the badge button
}

/**
 * AchievementCompletionPopup component displays a modal popup
 * when an achievement is completed, showcasing the achievement's badge.
 *
 * @param {AchievementCompletionProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered component.
 */
export default function AchievementCompletionPopup({
  isOpen,
  onClose,
  achievementName,
  badgeImageUrl,
  badgeColor
}: AchievementCompletionProps) {
  const router = useRouter();

  // Effect hook to log when the popup is opened or closed
  useEffect(() => {
    console.log("AchievementCompletionPopup opened: ", isOpen);
  }, [isOpen]);

  // Function to navigate to the achievements section when the button is pressed
  const handleViewBadge = () => {
    console.log("Navigating to achievements");
    router.push('/achievements/#victory');
  };

  return (
    <AnimatePresence>
      <Modal
        isOpen={isOpen} // Controls whether the modal is displayed
        onClose={onClose} // Function to call when the modal is closed
        motionProps={{
          variants: {
            enter: { opacity: 1, scale: 1 }, // Animation properties for entering
            exit: { opacity: 0, scale: 0.8 } // Animation properties for exiting
          },
          transition: { type: 'spring', damping: 15 } // Transition effects
        }}
        classNames={{
          backdrop: "bg-black bg-opacity-50", // Styles for the backdrop
          base: "max-w-md bg-background rounded-lg shadow-defined", // Base modal styles
          header: "border-b-0", // Header styles
          body: "p-6", // Body padding
          closeButton: "absolute right-2 top-2 z-50", // Close button positioning
        }}
      >
        <ModalContent>
          <ModalBody>
            <div className="flex flex-col items-center">
              {/* Badge image display with animation */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }} // Initial state for animation
                animate={{ scale: 1, rotate: 0 }} // Final state for animation
                transition={{ type: "spring", damping: 10, delay: 0.4 }} // Animation transition
                className="mb-6 rounded-full bg-background p-4"
              >
                <Image
                  src={badgeImageUrl} // Image source for the badge
                  alt="Achievement Badge" // Alt text for the image
                  width={250} // Image width
                  height={250} // Image height
                  className="rounded-full" // Rounded image style
                />
              </motion.div>

              {/* Badge unlocked message */}
              <motion.div
                initial={{ y: 20, opacity: 0 }} // Initial state for animation
                animate={{ y: 0, opacity: 1 }} // Final state for animation
                transition={{ delay: 0.6 }} // Animation transition delay
                className="mb-4 text-center text-2xl font-bold"
              >
                Badge Unlocked!
              </motion.div>

              {/* Achievement congratulations message */}
              <motion.div
                initial={{ y: 20, opacity: 0 }} // Initial state for animation
                animate={{ y: 0, opacity: 1 }} // Final state for animation
                transition={{ delay: 1 }} // Animation transition delay
                className=" text-center text-base"
              >
                Congratulations! You&apos;ve unlocked {achievementName}. Great job!
              </motion.div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              style={{
                backgroundColor: badgeColor, // Set the button background color
              }}
              variant="shadow" // Button variant
              onPress={handleViewBadge} // Function to call when the button is pressed
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
