'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Add, Minus } from 'iconsax-react'; // Importing Add and Minus icons from iconsax-react

interface FAQAccordionItemProps {
  question: string;
  answer: string;
  expandAll: boolean;
}

const FAQAccordionItem: React.FC<FAQAccordionItemProps> = ({ question, answer, expandAll }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(expandAll);
  }, [expandAll]);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center focus:outline-none"
      >
        <span className={`text-lg text-left text-text ${isOpen ? 'font-medium' : 'font-medium'}`}>
          {question}
        </span>
        <span>
          {isOpen ? <Minus size="20" color="currentColor" className="text-secondary-2" /> : <Add size="20" color="currentColor" className="text-gray-500" />}
        </span>
      </button>
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: isOpen ? 'auto' : 0 }}
        transition={{ duration: 0.5, ease: "anticipate"} }// Bouncy animation
        className="overflow-hidden mt-2 text-text"
      >
        <div className="p-2"> <p dangerouslySetInnerHTML={{ __html: answer }}></p></div>
      </motion.div>
    </div>
  );
};

export default FAQAccordionItem;
