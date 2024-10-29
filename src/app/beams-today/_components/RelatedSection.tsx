'use client'; // Ensures the component is rendered on the client side in a Next.js app.

import React from 'react';
import { BeamsToday } from '@/types/beamsToday'; // Import the BeamsToday type to type-check the topics.
import BeamsTodaySearchCard from './BeamsTodaySearchCard'; // Component that displays search-related topic information (ensure correct path).

// Define the props for the RelatedSection component.
interface RelatedSectionProps {
  topics: BeamsToday[]; // Array of BeamsToday topics to display.
  categoryName: string; // Category name for additional context (unused but could be useful for filtering or display).
}

// React functional component for rendering the related section.
const RelatedSection: React.FC<RelatedSectionProps> = ({ topics, categoryName }) => {
  const maxTopicsToShow = 3; // Maximum number of topics to display in this section.
  const displayedTopics = topics.slice(0, maxTopicsToShow); // Select up to 3 topics from the provided list.

  return (
    <div className="p-4 mb-6"> {/* Padding and margin styling for the section container */}
      {/* Section heading with a bottom border */}
      <div className="flex justify-between flex-col items-start mb-4">
        <h1 className="text-lg md:text-3xl font-display font-bold mb-[1px]">Recommended For You</h1>
        <div className="border-b-2 border-brand mb-6 w-full" style={{ maxWidth: '10%' }}></div>
      </div>

      {/* Display the topics in a responsive grid */}
      <div className="items-start grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {/* Loop through the displayed topics and render a BeamsTodaySearchCard for each */}
        {displayedTopics.map((topic) => (
          <BeamsTodaySearchCard key={topic.id} topic={topic} /> 
        ))}
      </div>
    </div>
  );
};

// Export the RelatedSection component for use in other parts of the application.
export default RelatedSection;
