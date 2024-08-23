import React from 'react';
import FAQHeader from './_components/Header';
import StickyHeader from './_components/StickyHeader';
import FAQContainer from './_components/FAQContainer';
import FAQFooter from './_components/FAQFooter';
import { getAllFAQs } from '@/actions/others/faq';
import GoToTopButton from '@/components/GoToTopButton';



const FAQ = async() => {
  const faqData:any = await getAllFAQs();
  const categories = ['All', ...Array.from(new Set(faqData.map((item:any) => item.category)))];
  return (
    <>
      <FAQHeader />
      <StickyHeader categories={categories} faqData={faqData} />
      {/* <FAQContainer faqData={faqData} /> */}
      <FAQFooter />
      <GoToTopButton />
    </>
  );
};

export default FAQ;
