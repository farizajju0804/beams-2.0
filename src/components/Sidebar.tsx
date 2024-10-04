'use client'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Chart, Cup, BookSquare, Rank,  ArrowLeft2, ArrowRight2, Microscope } from 'iconsax-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const menuItems = [
  { icon: Microscope, label: "Beams Today", path: "/beams-today" },
  { icon: BookSquare, label: "Beams Facts", path: "/beams-facts" },
  { icon: Chart, label: "Dashboard", path: "/dashboard" },
  { icon: Cup, label: "Achievements", path: "/achievements" },
  { icon: Rank, label: "Leaderboard", path: "/leaderboard" },
]

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();


  const transition = { type: 'circIn', stiffness: 150, damping: 5 };

  return (
    <motion.div
      className={`sidebar  ${isExpanded ? 'sidebar-expanded' : ''} h-screen bg-background shadow-defined md:block hidden`}
      layout
      initial={false}
      animate={isExpanded ? "expanded" : "collapsed"}
      transition={transition}
    >
      <div className="flex flex-col py-4 h-full">
        <div className="flex items-center justify-center mb-8">
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                // key="expanded"
                // initial={{ opacity: 0 }}
                // animate={{ opacity: 1 }}
                // exit={{ opacity: 0 }}
                // transition={{ duration: 0.2 }}
              >
                <Link href="/">
                  <Image
                    src="/images/logo.png"
                    alt="Beams Logo"
                    width={85}
                    height={30}
                  />
                </Link>
              </motion.div>
            ) : (
              <motion.div
                // key="collapsed"
                // initial={{ opacity: 0 }}
                // animate={{ opacity: 1 }}
                // exit={{ opacity: 0 }}
                // transition={{ duration: 0.2}}
              >
                <Link href="/">
                  <Image
                    src="/images/logo-2.png"
                    alt="Beams Logo"
                    width={30}
                    height={40}
                  />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <nav className="flex-grow">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.path;
            return (
              <Link href={item.path} key={index} prefetch>
                <motion.div
                  className={`flex items-center p-4 cursor-pointer 
                              ${isActive ? 'border-r-4 border-brand' : 'hover:text-brand'}
                              ${isExpanded ? 'justify-start' : 'justify-center'}`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <item.icon
                    size={24}
                    variant="Bold"
                    className='hover:text-brand'
                    color={isActive ? '#f96f2e' : '#a8a8a8'}
                  />
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span
                        className={`ml-4 ${isActive ? 'text-text font-semibold' : 'text-[#a8a8a8]'}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center justify-center">
          <motion.button
            className="w-fit p-2 flex items-center justify-center text-gray-700 hover:text-brand bg-gray-100 rounded-full"
            onClick={() => setIsExpanded(!isExpanded)}
            // whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            {isExpanded ? (
              <ArrowLeft2 size={16} />
            ) : (
              <ArrowRight2 size={16} />
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
