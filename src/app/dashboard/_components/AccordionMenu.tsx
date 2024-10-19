'use client';
import React, { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown2 } from 'iconsax-react';

// Define the type for each menu item
type MenuItem = {
  title: string;
  icon: ReactNode; // JSX element for the icon
  content: ReactNode; // JSX element or text for the content
};

// Define the props for the AccordionMenu component
interface AccordionMenuProps {
  menuItems: MenuItem[];
}

const AccordionMenu: React.FC<AccordionMenuProps> = ({ menuItems }) => {
  const [expandedIndices, setExpandedIndices] = useState<number[]>([]); // Track multiple expanded items

  const toggleExpand = (index: number) => {
    if (expandedIndices.includes(index)) {
      // If already expanded, close it by removing from the array
      setExpandedIndices(expandedIndices.filter((i) => i !== index));
    } else {
      // Otherwise, expand it by adding the index to the array
      setExpandedIndices([...expandedIndices, index]);
    }
  };

  return (
    <div className="w-full max-w-lg lg:mx-0 mx-auto bg-background shadow-defined rounded-3xl overflow-hidden">
      <div className="divide-y divide-grey-1">
        {menuItems.map((item, index) => (
          <div key={index}>
            <div
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => toggleExpand(index)}
            >
              <div className="flex items-center space-x-3">
                {item.icon} {/* Render the icon directly */}
                <span className="font-medium">{item.title}</span>
              </div>
              <motion.div
                animate={{ rotate: expandedIndices.includes(index) ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ArrowDown2 className="h-5 w-5 text-grey-2" />
              </motion.div>
            </div>
            <AnimatePresence initial={false}>
              {expandedIndices.includes(index) && (
                <motion.div
                  key={index} // Add key to help React track animations
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: 0.3, ease: 'easeInOut' },
                    opacity: { duration: 0.2 },
                  }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-grey-3">{item.content}</div> {/* Render content */}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccordionMenu;
