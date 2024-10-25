'use client'
// Imports required libraries and components
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Microscope } from 'iconsax-react';

import { useRouter } from 'next/navigation';
import { CoolMode } from './ui/cool-mode';

// HeroSection component definition with animations and button action
const HeroSection: React.FC = () => {
  const router = useRouter();

  // Function to handle button click, adds a delay before navigation
  const handleClick = () => {
    setTimeout(() => {
      router.push('/auth/register'); // Navigates to registration page after delay
    }, 1000); // 1-second delay
  };

  return (
    <section className="w-full bg-yellow flex flex-col items-center justify-center text-center py-8 px-6 ">
      {/* Animated introductory text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl"
      >
        <p className="text-gray-800 font-semibold text-2xl mb-4 md:text-3xl">
          Power through the world with
        </p>
        <h1 className="text-brand font-poppins text-2xl mb-4 md:text-3xl font-bold mt-2">
          Beams
        </h1>
        <p className="text-black font-medium text-sm sm:text-base md:text-lg">
          Bringing the Future to Your Fingertips
        </p>
      </motion.div>
      
      {/* Animated floating image */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ scale: 1.05 }}
        className="mt-6"
      >
        <motion.div
          animate={{
            y: [0, -10, 0], // Float effect: moves image up and down
          }}
          transition={{
            duration: 4, // One full float cycle duration
            repeat: Infinity, // Repeats the animation indefinitely
            ease: "easeInOut", // Smooth animation easing
          }}
        >
          {/* Display Hero image with Cloudinary URL */}
          <Image 
            priority 
            src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1724913498/email%20images/hero_qeunij.webp" 
            alt="Beams Hero Image" 
            className="w-48 h-48 md:w-64 md:h-64" 
            width={260} 
            height={260} 
          />
        </motion.div>
      </motion.div>
      
      {/* Button with animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 mb-4"
      >
        <CoolMode> 
          <Button
            onClick={handleClick} // Triggers handleClick on click
            className="bg-brand text-white text-lg gap-3 lg:text-xl py-6 px-8 font-semibold shadow-md"
          >
            Discover the Future Now <Microscope variant='Bold'/> {/* Button text with icon */}
          </Button>
        </CoolMode>
      </motion.div>
    </section>
  );
};

export default HeroSection;
