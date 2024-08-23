'use client';
import React, { useState } from 'react';
import FAQAccordionItem from './FAQAccordionItem';

interface FAQAccordionProps {
  data: { question: string; answer: string; category: string }[];
}

const FAQAccordion: React.FC<FAQAccordionProps> = ({ data }) => {
  const [expandAll, setExpandAll] = useState(false);

  const toggleExpandAll = () => setExpandAll(!expandAll);

  return (
    <div className="mt-4">
      <div className="flex justify-end mb-2">
        <button
          onClick={toggleExpandAll}
          className="text-purple underline hover:text-purple-700 focus:outline-none"
        >
          {expandAll ? 'Collapse All' : 'Expand All'}
        </button>
      </div>
      {data.map((item, index) => (
        <FAQAccordionItem key={index} question={item.question} answer={item.answer} expandAll={expandAll} />
      ))}
    </div>
  );
};

export default FAQAccordion;
