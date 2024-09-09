'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Microscope } from 'iconsax-react';
import { CoolMode } from './ui/cool-mode';
import { useRouter } from 'next/navigation';

const HeroSection: React.FC = () => {
  const router = useRouter();

  // Handler for the button click to delay the navigation
  const handleClick = () => {
    setTimeout(() => {
      router.push('/auth/register');
    }, 2000); // 2-second delay
  };

  return (
    <section className="w-full bg-yellow flex flex-col items-center justify-center text-center py-8 px-6 ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl"
      >
        <p className="text-gray-800 font-semibold text-2xl mb-4 md:text-3xl">
          Power through the world with
        </p>
        <h1 className="text-brand font-poppins text-2xl mb-4  md:text-3xl font-bold mt-2">
          Beams
        </h1>
        <p className="text-black font-medium text-sm sm:text-base md:text-lg">
          Bringing the Future to Your Fingertips
        </p>
      </motion.div>
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ scale: 1.05 }}
        className="mt-6"
      >
        <motion.div
          animate={{
            y: [0, -10, 0], // Float effect: Move up and down
          }}
          transition={{
            duration: 4, // Duration of one full float cycle
            repeat: Infinity, // Repeat the float animation infinitely
            ease: "easeInOut", // Smooth easing
          }}
        >
          <Image priority src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1724913498/email%20images/hero_qeunij.webp" alt="Beams Hero Image" width={260} height={260} />
        </motion.div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 mb-4"
      >
        <CoolMode
          // options={{
          //   particle:
          //     "https://res.cloudinary.com/drlyyxqh9/image/upload/v1724914561/email%20images/futuristic-particle_hw4pmx.webp",
          // }}
        >
          <Button
            onClick={handleClick} // Add click handler with delay
            className="bg-brand text-white text-lg gap-3 lg:text-xl py-6 px-8 font-semibold shadow-md"
          >
            Discover the Future Now  <Microscope variant='Bold'/>
          </Button>
        </CoolMode>
      </motion.div>
    </section>
  );
};

export default HeroSection;
