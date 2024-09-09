import React from 'react';
import FAQHeader from './_components/Header';  // Component for the header section
import StickyHeader from './_components/StickyHeader';  // Sticky navigation header for categories
import FAQFooter from './_components/FAQFooter';  // Component for the footer section
import { getAllFAQs } from '@/actions/others/faq';  // Function to fetch FAQ data
import GoToTopButton from '@/components/GoToTopButton';  // Button to scroll back to top

const FAQ = async () => {
  // Fetch all FAQ data
  const faqData: any = await getAllFAQs();

  // Extract unique categories from the FAQ data
  const categories = ['All', ...Array.from(new Set(faqData.map((item: any) => item.category)))];

  return (
    <>
      {/* Renders the header section of the FAQ page */}
      <FAQHeader />
      
      {/* Renders the sticky header with categories for navigation */}
      <StickyHeader categories={categories} faqData={faqData} />
      
      {/* FAQContainer would typically render the FAQs, but it's commented out here */}
      {/* <FAQContainer faqData={faqData} /> */}
      
      {/* Renders the footer section of the FAQ page */}
      <FAQFooter />
      
      {/* Go to top button for easy scrolling */}
      <GoToTopButton />
    </>
  );
};

export default FAQ;
