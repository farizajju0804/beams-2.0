'use client';
import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import FAQTabs from './FAQTabs';
import FAQContainer from './FAQContainer';

// Define props interface for StickyHeader component
interface StickyHeaderProps {
  categories: any; // List of categories for tabs (can be refined to a more specific type)
  faqData: { question: string; answer: string; category: string }[]; // Array of FAQ data objects
}

// Component to display sticky header with tabs and filtered FAQ content
const StickyHeader: React.FC<StickyHeaderProps> = ({ categories, faqData }) => {
  // State to manage the currently selected tab and filtered FAQ data
  const [selectedTab, setSelectedTab] = useState('All');
  const [filteredData, setFilteredData] = useState(faqData);

  // Update filtered FAQ data when selected tab changes
  useEffect(() => {
    if (selectedTab === 'All') {
      setFilteredData(faqData); // Show all data if "All" tab is selected
    } else {
      setFilteredData(faqData.filter(item => item.category === selectedTab)); // Filter by selected category
    }
  }, [selectedTab, faqData]);

  return (
    <div className="w-full bg-background z-20">
      <div className="mx-auto pt-2">
        <SearchBar faqData={faqData}/> {/* Search bar component */}
        <FAQTabs categories={categories} selectedTab={selectedTab} setSelectedTab={setSelectedTab} /> {/* Tab navigation */}
      </div>
      <FAQContainer faqData={filteredData} /> {/* Display filtered FAQ data */}
    </div>
  );
};

export default StickyHeader;
