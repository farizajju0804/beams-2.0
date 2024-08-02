'use client'
import React from 'react';
import { BeamsToday } from '@/types/beamsToday';
import BeamsTodayCard from './BeamsTodayCard'; // Make sure this path is correct
import BeamsTodaySearchCard from './BeamsTodaySearchCard';

interface RelatedSectionProps {
  topics: BeamsToday[];
  categoryName: string;
}

const RelatedSection: React.FC<RelatedSectionProps> = ({ topics, categoryName }) => {
  const maxTopicsToShow = 3; 
  const displayedTopics = topics.slice(0, maxTopicsToShow);

  return (
    <div className="p-4 mb-6">
      <div className="flex justify-between flex-col items-start mb-4">
        <h1 className="text-lg md:text-3xl font-display font-bold mb-[1px]">Recommended For You</h1>
      <div className="border-b-2 border-brand mb-6 w-full" style={{ maxWidth: '10%' }}></div>
      </div>
      <div className="items-start grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {displayedTopics.map((topic) => (
          <BeamsTodaySearchCard key={topic.id} topic={topic} />
        ))}
      </div>
    </div>
  );
};

export default RelatedSection;
