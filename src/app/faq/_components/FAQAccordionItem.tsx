// Importing necessary libraries and components
'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // Animation library for smooth transitions
import { Add, Minus } from 'iconsax-react'; // Importing Add and Minus icons from iconsax-react

// Props definition for the FAQAccordionItem component
interface FAQAccordionItemProps {
  question: string;
  answer: string;
  expandAll: boolean; // Determines if all items should be expanded/collapsed
}

// Main functional component
const FAQAccordionItem: React.FC<FAQAccordionItemProps> = ({ question, answer, expandAll }) => {
  const [isOpen, setIsOpen] = useState(false); // State to track if this item is open or closed

  // Effect hook to expand or collapse all items based on `expandAll` prop
  useEffect(() => {
    setIsOpen(expandAll);
  }, [expandAll]);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)} // Toggle the open/close state when clicked
        className="w-full flex justify-between items-center focus:outline-none"
      >
        {/* Display the question */}
        <span className={`text-lg text-left text-text ${isOpen ? 'font-medium' : 'font-medium'}`}>
          {question}
        </span>

        {/* Toggle between Add and Minus icons based on open/close state */}
        <span>
          {isOpen 
            ? <Minus size="20" color="currentColor" className="text-secondary-2" /> 
            : <Add size="20" color="currentColor" className="text-gray-500" />
          }
        </span>
      </button>

      {/* Smooth transition for expanding/collapsing the answer */}
      <motion.div
        initial={{ height: 0 }} // Initially collapsed
        animate={{ height: isOpen ? 'auto' : 0 }} // Expand or collapse based on `isOpen`
        transition={{ duration: 0.5, ease: "anticipate" }} // Adding a bouncy animation for smoothness
        className="overflow-hidden mt-2 text-text"
      >
        <div className="p-2">
          {/* Render the answer as HTML content */}
          <p dangerouslySetInnerHTML={{ __html: answer }}></p>
        </div>
      </motion.div>
    </div>
  );
};

export default FAQAccordionItem;
