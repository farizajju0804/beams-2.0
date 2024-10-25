import React from 'react';
import FAQAccordion from './FAQAccordion';

// Props interface for FAQContainer
interface FAQContainerProps {
  faqData: { question: string; answer: string; category: string }[]; // Array of FAQ objects
}

// Container for displaying FAQs with accordion style
const FAQContainer: React.FC<FAQContainerProps> = ({ faqData }) => {
  return (
    <div className="mb-4 px-6 bg-background max-w-3xl md:rounded-b-3xl md:shadow-lg mx-auto">
      <FAQAccordion data={faqData} /> {/* Accordion for FAQ items */}
    </div>
  );
};

export default FAQContainer;
