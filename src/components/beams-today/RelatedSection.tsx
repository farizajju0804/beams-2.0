import React from 'react';
import { BeamsToday } from '@/types/beamsToday';
import BeamsTodayCard from './BeamsTodayCard'; // Make sure this path is correct

interface RelatedSectionProps {
  topics: BeamsToday[];
  categoryName: string;
}

const RelatedSection: React.FC<RelatedSectionProps> = ({ topics, categoryName }) => (
  <div className="p-4 mb-6">
    <h1 className="text-xl md:text-3xl font-display font-bold mb-1">Recommended For You</h1>
    <div className="border-b-2 border-brand-950 mb-6 w-full" style={{ maxWidth: '10%' }}></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {topics.slice(0, 9).map((topic) => (
        <BeamsTodayCard key={topic.id} topic={topic} />
      ))}
    </div>
  </div>
);

export default RelatedSection;
