'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import SearchBar from './SearchBar';

// Header component for FAQ page with animated heading and optional image
const FAQHeader: React.FC = () => {
  return (
    <header className="relative w-full bg-background flex flex-col items-center justify-center text-center pt-6 pb-3 md:pt-12 md:pb-4 md:mb-4 px-6">
      {/* Animated title section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl z-10"
      >
        <h1 className="text-text font-poppins font-semibold text-2xl md:text-3xl">
          Got Questions?
        </h1>
        <h2 className="text-secondary-2 font-poppins font-semibold text-2xl md:text-3xl mt-4">
          We have got the Answers
        </h2>
      </motion.div>

      {/* FAQ illustration, visible on larger screens only */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="hidden lg:block absolute right-[15%] top-12"
      >
        <Image src="/images/faq.png" alt="FAQ Illustration" width={100} height={100} />
      </motion.div>
    </header>
  );
};

export default FAQHeader;
