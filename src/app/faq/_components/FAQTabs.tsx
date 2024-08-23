'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown2 } from 'iconsax-react';

interface FAQTabsProps {
  categories: string[];
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const FAQTabs: React.FC<FAQTabsProps> = ({ categories, selectedTab, setSelectedTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (tab: string) => {
    setSelectedTab(tab);
    setIsOpen(false);
  };

  return (
    <div className="md:bg-gray-100 max-w-3xl mx-auto md:p-4 md:px-6 z-[20] rounded-xl">
      {/* Dropdown for mobile view */}
      <div className="relative block lg:hidden">
        <button
          onClick={toggleDropdown}
          className="w-5/6 mx-auto p-2 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand text-left text-black flex justify-between items-center"
        >
          <span>{selectedTab}</span>
          <span
            className={`transform transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          >
            <ArrowDown2 size="20" color="currentColor" />
          </span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute w-full mt-2 text-left bg-white border border-gray-300 rounded-xl shadow-lg z-10"
            >
              {categories.map(tab => (
                <li key={tab}>
                  <motion.button
                    onClick={() => handleSelect(tab)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full text-left p-2 px-4 text-black hover:bg-gray-100 ${
                      selectedTab === tab ? 'bg-gray-200' : ''
                    }`}
                  >
                    {tab}
                  </motion.button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Buttons for larger screens */}
      <div className="hidden lg:flex justify-center gap-6 flex-wrap">
        {categories.map(tab => (
          <motion.button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            animate={{ opacity: selectedTab === tab ? 1 : 0.8 }}
            className={`py-2 px-4 rounded-xl text-sm font-medium focus:outline-none flex items-center justify-center h-10 min-w-[110px] ${
              selectedTab === tab ? 'bg-gray-800 text-white' : 'bg-white text-gray-700'
            }`}
          >
            {tab}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default FAQTabs;
