'use client';
import React, { useState } from 'react';
import FAQAccordionItem from './FAQAccordionItem';

// Props interface for FAQAccordion component
interface FAQAccordionProps {
  data: { question: string; answer: string; category: string }[]; // Array of FAQ items
}

// Component to display FAQ items with expand/collapse functionality
const FAQAccordion: React.FC<FAQAccordionProps> = ({ data }) => {
  const [expandAll, setExpandAll] = useState(false); // State to manage expand/collapse all behavior

  // Toggle expand/collapse state for all items
  const toggleExpandAll = () => setExpandAll(!expandAll);

  return (
    <div>
      {/* Expand/collapse all button */}
      <div className="flex justify-end p-3">
        <button
          onClick={toggleExpandAll}
          className="text-gray-500 underline focus:outline-none"
        >
          {expandAll ? 'Collapse All' : 'Expand All'}
        </button>
      </div>
      {/* Map through each FAQ item and render individual accordion item */}
      {data.map((item, index) => (
        <FAQAccordionItem key={index} question={item.question} answer={item.answer} expandAll={expandAll} />
      ))}
    </div>
  );
};

export default FAQAccordion;
