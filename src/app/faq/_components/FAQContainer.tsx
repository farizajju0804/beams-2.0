import React from 'react';
import FAQAccordion from './FAQAccordion';

interface FAQContainerProps {
  faqData: { question: string; answer: string; category: string }[];
}

const FAQContainer: React.FC<FAQContainerProps> = ({ faqData }) => {
  return (
    <div className="mb-4 px-6 bg-white max-w-3xl md:rounded-b-3xl md:shadow-lg mx-auto">
      <FAQAccordion data={faqData} />
    </div>
  );
};

export default FAQContainer;
