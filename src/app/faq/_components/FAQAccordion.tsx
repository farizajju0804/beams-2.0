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
    <div className="">
      <div className="flex justify-end p-3">
        <button
          onClick={toggleExpandAll}
          className="text-gray-500 underline focus:outline-none"
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
