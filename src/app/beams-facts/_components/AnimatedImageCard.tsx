"use client"; // This directive indicates that the component will be rendered on the client-side

import React, { useState } from "react"; // Importing React and useState for managing component state
import { motion, AnimatePresence } from "framer-motion"; // Importing motion components for animations
import Image from "next/image"; // Importing Next.js Image component for optimized images
import { CloseCircle } from "iconsax-react";

// Defining the props type for the AnimatedImageCard component
type AnimatedImageCardProps = {
  imageUrl: string; // URL for the image to display
  name: string; // Name associated with the image
};

// Functional component definition
export default function AnimatedImageCard({ imageUrl, name }: AnimatedImageCardProps) {
  // State to track whether the image card is expanded or not
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to toggle the expanded state
  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <>
      {/* Main card for displaying the image */}
      <div className="overflow-hidden mx-auto w-full max-w-sm rounded-2xl shadow-defined bg-background">
        <motion.div
          className="relative w-full  h-72 md:h-72 cursor-pointer" // Card styling and dimensions
          whileHover={{ scale: 1.05 }} // Scale up on hover
          whileTap={{ scale: 0.95 }} // Scale down on tap/click
          onClick={toggleExpand} // Toggle expand state on click
        >
          <Image
            src={imageUrl} // Image URL
            alt={name} // Alternative text for accessibility
            layout="fill" // Fill the parent container
            className="object-cover " // Cover the area of the container
            priority
          />
        </motion.div>
        <div className="p-4"> {/* Padding around the title */}
          <h3 className="text-lg font-semibold text-center">{name}</h3> {/* Title of the image card */}
        </div>
      </div>

      {/* AnimatePresence to handle the conditional rendering of the expanded view */}
      <AnimatePresence>
        {isExpanded && ( // Render the expanded view only if isExpanded is true
          <motion.div
            initial={{ opacity: 0 }} // Initial state (invisible)
            animate={{ opacity: 1 }} // Animate to visible state
            exit={{ opacity: 0 }} // Animate back to invisible on exit
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={toggleExpand} // Close the modal on background click
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} // Initial state (smaller and invisible)
              animate={{ scale: 1, opacity: 1 }} // Animate to full size and visible
              exit={{ scale: 0.9, opacity: 0 }} // Animate back on exit
              transition={{ type: "spring", stiffness: 300, damping: 25 }} // Spring transition for a smoother effect
              className="relative bg-background pt-8 rounded-3xl shadow-defined w-full max-w-3xl max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()} // Prevent click events from bubbling up to the background
            >
              <div className="relative w-full h-[340px] md:h-[380px]"> {/* Container for the expanded image */}
                <Image
                  src={imageUrl} // Same image URL for the expanded view
                  alt={name} // Alternative text
                  layout="fill" // Fill the parent container
                  objectFit="contain" // Maintain aspect ratio in the container
                  className="rounded-lg" // Rounded top corners
                  priority
                />
              </div>
              <div className="bg-background"> {/* Background for title section */}
                <h2 className="text-lg md:text-2xl text-center font-bold my-4">{name}</h2> {/* Title of the expanded view */}
              </div>
              <motion.button
                className="absolute top-2 right-2 p-2 rounded-full text-text transition-colors"
                whileHover={{ scale: 1.1 }} // Scale up on hover
                whileTap={{ scale: 0.9 }} // Scale down on tap/click
                onClick={toggleExpand} // Close the expanded view on button click
              >
                <CloseCircle className="text-text"/>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
