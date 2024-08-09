'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AddCircle, MinusCirlce, ArrowDown2, TickCircle } from 'iconsax-react';
import { FaCircleCheck, FaPlay } from 'react-icons/fa6';
import { useSidebarStore } from '@/store/sidebarStore';

const sections = [
  {
    title: 'Introduction to Magical Materials',
    lectures: '3 lectures • 15min',
    subitems: [
      { title: 'Intro to materials', duration: '05:00', completed: true },
      { title: 'History of materials', duration: '05:00', completed: true },
      { title: 'Overview of magical properties', duration: '05:00', completed: true }
    ],
  },
  {
    title: 'Properties of Magical Materials',
    lectures: '4 lectures • 20min',
    subitems: [
      { title: 'Material properties overview', duration: '05:00', completed: true },
      { title: 'Physical properties', duration: '05:00', completed: true },
      { title: 'Chemical properties', duration: '05:00', completed: true },
      { title: 'Mechanical properties', duration: '05:00', completed: true }
    ],
  },
  {
    title: 'Applications of Aerogels',
    lectures: '2 lectures • 10min',
    subitems: [
      { title: 'Aerogel in construction', duration: '05:00', completed: true },
      { title: 'Aerogel in technology', duration: '05:00', completed: true }
    ],
  },
  {
    title: 'Graphene and its Uses',
    lectures: '2 lectures • 10min',
    subitems: [
      { title: 'Graphene in electronics', duration: '05:00', completed: true },
      { title: 'Graphene in medicine', duration: '05:00', completed: true }
    ],
  },
  {
    title: 'Quantum Dots Applications',
    lectures: '3 lectures • 15min',
    subitems: [
      { title: 'Quantum dots in displays', duration: '05:00', completed: true },
      { title: 'Quantum dots in medical imaging', duration: '05:00', completed: false },
      { title: 'Future prospects of quantum dots', duration: '05:00', completed: false }
    ],
  },
  {
    title: 'Future of Material Science',
    lectures: '3 lectures • 15min',
    subitems: [
      { title: 'Self-healing materials', duration: '05:00', completed: false },
      { title: 'Metamaterials', duration: '05:00', completed: false },
      { title: 'Piezoelectric materials', duration: '05:00', completed: false }
    ],
  },
];

const ProgressTab: React.FC = () => {
  const { isOpen, toggleSidebar } = useSidebarStore();
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());

  const toggleSection = (index: number) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const toggleAllSections = () => {
    if (expandedSections.size === sections.length) {
      setExpandedSections(new Set());
    } else {
      setExpandedSections(new Set(sections.map((_, index) => index)));
    }
  };

  const renderIcon = (completed: boolean) => {
    return completed ? <FaCircleCheck size={22} className="text-brand shrink-0" /> : <FaPlay size={20} className="text-text shrink-0" />;
  };

  const renderSubIcon = (completed: boolean) => {
    return completed ? <FaCircleCheck size={18} className="text-text shrink-0" /> : <FaPlay size={16} className="text-text shrink-0" />;
  };

  return (
    <div className={`bg-grey-3 shadow-none rounded-3xl p-4 ${isOpen ? 'w-auto' : 'w-fit'} transition-width duration-300`}>
      <div className={`flex mb-4 justify-between items-center ${isOpen ? 'w-auto' : 'w-fit'} transition-width duration-300`}>
        <h1 className="font-poppins text-xl md:text-2xl font-semibold text-text">Progress</h1>
        <button className="text-primary text-sm" onClick={toggleAllSections}>
          {expandedSections.size === sections.length ? 'Collapse all' : 'Expand all'}
        </button>
      </div>
      
      {sections.map((section, index) => {
        const allSubitemsCompleted = section.subitems.every(subitem => subitem.completed);

        return (
          <div key={index.toString()} className="border-t border-grey-200">
            <div
              onClick={() => toggleSection(index)}
              className="flex justify-between items-center py-4 cursor-pointer"
            >
              <div className="flex items-center">
                <motion.div
                  initial={false}
                  animate={{ rotate: allSubitemsCompleted ? 0 : expandedSections.has(index) ? 180 : 0 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="mr-2"
                >
                  {allSubitemsCompleted ? (
                    <FaCircleCheck size={20} className="text-brand" />
                  ) : (
                    <ArrowDown2 size={16} className="text-text" />
                  )}
                </motion.div>
                <h2 className="font-poppins text-base lg:text-lg font-medium text-text">
                  {section.title}
                </h2>
              </div>
              <p className="hidden lg:block lg:text-base font-normal text-grey-2">{section.lectures}</p>
            </div>
            <AnimatePresence initial={false}>
              {expandedSections.has(index) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: 0.5, ease: 'easeInOut' },
                    opacity: { duration: 0.5, ease: 'easeInOut' },
                    type: 'spring'
                  }}
                  className=""
                >
                  {section.subitems.map((subitem, subindex) => (
                    <div key={subindex} className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center rounded-full p-2">
                          {renderSubIcon(subitem.completed)}
                        </div>
                        <p className="text-sm lg:text-base font-normal text-grey-2">{subitem.title}</p>
                      </div>
                     
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressTab;
