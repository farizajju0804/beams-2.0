'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface FAQTabsProps {
  categories: string[];
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
}

const FAQTabs: React.FC<FAQTabsProps> = ({ categories, selectedTab, setSelectedTab }) => {
  const handleSelect = (tab: string) => {
    setSelectedTab(tab);
  };

  return (
    <div className="md:bg-grey-3 max-w-3xl mx-auto md:p-4 px-4 md:px-6 z-[20] rounded-t-3xl">
      {/* Horizontal scrolling for mobile view */}
      <div className="block lg:hidden">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-wrap gap-y-4 justify-center space-x-4 p-4 "
        >
          {categories.map((tab) => (
            <motion.button
              key={tab}
              onClick={() => handleSelect(tab)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`flex-shrink-0 py-2 px-4 rounded-xl text-sm md:text-base text-center whitespace-nowrap ${
                selectedTab === tab ? 'bg-text text-background' : 'bg-grey-1 border-grey-2 border-1 text-grey-2'
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Buttons for larger screens */}
      <div className="hidden lg:flex justify-center gap-6 flex-wrap">
        {categories.map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            animate={{ opacity: selectedTab === tab ? 1 : 0.8 }}
            className={`py-2 px-4 rounded-xl text-sm font-medium focus:outline-none flex items-center justify-center h-10 min-w-[110px] ${
              selectedTab === tab ? 'bg-text text-background' : 'border-grey-2 border-1 bg-grey-1 text-grey-2'
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
