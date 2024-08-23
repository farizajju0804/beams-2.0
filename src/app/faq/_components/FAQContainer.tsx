import React from 'react';
import FAQAccordion from './FAQAccordion';

interface FAQContainerProps {
  faqData: { question: string; answer: string; category: string }[];
}

const FAQContainer: React.FC<FAQContainerProps> = ({ faqData }) => {
  return (
    <div className="md:mt-4 mb-4 px-6 max-w-3xl mx-auto">
      <FAQAccordion data={faqData} />
    </div>
  );
};

export default FAQContainer;
