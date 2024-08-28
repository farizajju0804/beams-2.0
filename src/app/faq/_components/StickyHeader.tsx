'use client';
import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import FAQTabs from './FAQTabs';
import FAQContainer from './FAQContainer';

interface StickyHeaderProps {
  categories: any;
  faqData: { question: string; answer: string; category: string }[];
}

const StickyHeader: React.FC<StickyHeaderProps> = ({ categories, faqData }) => {
  const [selectedTab, setSelectedTab] = useState('All');
  const [filteredData, setFilteredData] = useState(faqData);

  useEffect(() => {
    if (selectedTab === 'All') {
      setFilteredData(faqData);
    } else {
      setFilteredData(faqData.filter(item => item.category === selectedTab));
    }
  }, [selectedTab, faqData]);

  return (
    <div className="w-full bg-background z-20">
      <div className="mx-auto pt-2">
        <SearchBar  faqData={faqData}/>
        <FAQTabs categories={categories} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      </div>
      <FAQContainer faqData={filteredData} />
    </div>
  );
};

export default StickyHeader;
