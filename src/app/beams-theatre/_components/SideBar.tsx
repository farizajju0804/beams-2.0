'use client';

import React, { useState } from 'react';
import { AddCircle, MinusCirlce } from 'iconsax-react';
import { FaPlay } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { RiMenuFoldLine, RiMenuUnfoldLine } from 'react-icons/ri';
import { FaCircleCheck } from "react-icons/fa6";
import { useSidebarStore } from '@/store/sidebarStore';

interface SubItem {
  title: string;
  duration: string;
  completed: boolean;
}

interface Item {
  title: string;
  duration?: string;
  completed?: boolean;
  progress?: number;
  subitems?: SubItem[];
}

interface Section {
  items: Item[];
}

const SideBar: React.FC = () => {
  const { isOpen, toggleSidebar } = useSidebarStore();
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const sections: Section[] = [
    {
      items: [
        {
          title: "Introduction",
          completed: true,
          subitems: [
            { title: "Intro to materials", duration: "04:45", completed: true },
            { title: "Intro to materials", duration: "04:45", completed: true },
            { title: "Intro to materials", duration: "04:45", completed: true }
          ]
        },
        {
          title: "Properties",
          completed: true,
          subitems: [
            { title: "Material properties overview", duration: "04:45", completed: true },
            { title: "Material properties overview", duration: "04:45", completed: true },
            { title: "Material properties overview", duration: "04:45", completed: true }
          ]
        },
        {
          title: "Applications Of Magical Materials",
          progress: 20,
          subitems: [
            { title: "Aerogel Applications", duration: "04:45", completed: true },
            { title: "Quantum Dots Applications", duration: "04:45", completed: false },
            { title: "Graphene Applications", duration: "04:45", completed: false },
            { title: "PiezoElectric Applications", duration: "04:45", completed: false }
          ],
        },
        {
          title: "Real Life Techniques",
          completed: false,
          subitems: [
            { title: "Techniques in practice", duration: "04:45", completed: false },
            { title: "Techniques in practice", duration: "04:45", completed: false },
            { title: "Techniques in practice", duration: "04:45", completed: false }
          ]
        },
        {
          title: "Future Research",
          completed: false,
          subitems: [
            { title: "Upcoming research topics", duration: "04:45", completed: false },
            { title: "Upcoming research topics", duration: "04:45", completed: false },
            { title: "Upcoming research topics", duration: "04:45", completed: false }
          ]
        },
      ],
    },
  ];

  const renderIcon = (completed: boolean) => {
    if (completed) {
      return <FaCircleCheck size={22} className='text-orange-500 shrink-0' />;
    } else {
      return <FaPlay size={20} className='text-text shrink-0' />;
    }
  };

  const renderSubIcon = (completed: boolean) => {
    if (completed) {
      return <FaCircleCheck size={18} className='text-text shrink-0' />;
    } else {
      return <FaPlay size={16} className='text-text shrink-0' />;
    }
  };

  const toggleItem = (index: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className={`hidden lg:block transition-width duration-300`}>
      <div className={`flex mb-4 justify-between items-center ${isOpen ? 'w-auto' : 'w-fit'} transition-width duration-300`}>
        {isOpen && <h2 className='text-xl font-semibold'>Progress</h2>}
        <button className='p-2 rounded-full bg-grey-1' onClick={toggleSidebar}>
          {isOpen ? <RiMenuFoldLine size={24} /> : <RiMenuUnfoldLine size={24} />}
        </button>
      </div>
      <div className={`mt-2 ${isOpen ? 'block' : 'hidden'}`}>
        {sections.map((section, idx) => (
          <div key={idx} className='my-4'>
            {section.items.map((item, index) => (
              <div key={index} className='bg-grey-1 p-2 my-2 rounded-lg border'>
                <div className='flex justify-between items-center cursor-pointer' onClick={() => toggleItem(index)}>
                  <div className='flex items-center gap-2'>
                    <div className='flex items-center justify-center rounded-full p-2'>
                      {renderIcon(item.completed || false)}
                    </div>
                    <h1 className='font-poppins text-base font-medium'>{item.title}</h1>
                  </div>
                  <div className='flex items-center justify-center rounded-full p-2'>
                    {expandedItems.has(index) ? <MinusCirlce size={24} /> : <AddCircle size={24} />}
                  </div>
                </div>
                <AnimatePresence>
                  {expandedItems.has(index) && item.subitems && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.5, ease: 'easeInOut' },
                        opacity: { duration: 0.5, ease: 'easeInOut' },
                      }}
                      className='mt-2'
                    >
                      {item.subitems.map((subitem, subindex) => (
                        <div key={subindex} className='flex items-center justify-between my-1'>
                          <div className='flex items-center gap-2'>
                            <div className='flex items-center justify-center rounded-full p-2'>
                              {renderSubIcon(subitem.completed)}
                            </div>
                            <h1 className='font-normal w-[90%] text-sm'>{subitem.title}</h1>
                          </div>
                          <p className='text-grey-2 font-normal text-sm'>{subitem.duration}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SideBar;
