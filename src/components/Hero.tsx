'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@nextui-org/react';
import Link from 'next/link';

const HeroSection: React.FC = () => {
  return (
    <section className="w-full bg-yellow flex flex-col items-center justify-center text-center py-8 px-6 ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl"
      >
        <p className="text-gray-800 font-semibold text-2xl mb-4 md:text-3xl">
          Walk through the world with
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
        transition={{ duration: 0.5, delay: 1.5 }}
        whileHover={{ scale: 1.05 }}
        className="mt-6"
      >
        <motion.div
          animate={{
            y: [0, -10, 0], // Float effect: Move up and down
          }}
          transition={{
            duration: 8, // Duration of one full float cycle
            repeat: Infinity, // Repeat the float animation infinitely
            ease: "easeInOut", // Smooth easing
          }}
        >
          <Image src="/images/hero.png" alt="Beams Hero Image" width={260} height={260} />
        </motion.div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-8 mb-4"
      >
        <Link href="/auth/register">
        <Button className="bg-brand text-white text-lg md:text-xl py-6 px-8 font-semibold shadow-md hover:bg-orange-600 transition-colors">
          Discover the Future Now
        </Button>
        </Link>
      </motion.div>
    </section>
  );
};

export default HeroSection;
