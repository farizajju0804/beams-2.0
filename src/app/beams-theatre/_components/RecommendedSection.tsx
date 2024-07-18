import React from 'react';
import BeamsTheatreCard from './BeamsTheatreCard';
import { BeamsTheatreWithTotalTime } from '@/types/beamsTheatre';
import { SectionTitle } from './SectionTitle';

interface RecommendedSectionProps {
  relatedBeamsTheatre: BeamsTheatreWithTotalTime[];

}

const RecommendedSection: React.FC<RecommendedSectionProps> = ({ relatedBeamsTheatre}) => {

  const filteredData = relatedBeamsTheatre;

  return (
    <div className="flex items-center flex-col justify-center w-full  gap-8 relative mx-2 lg:mx-4 border-2 border-gray-100 px-6 py-4 pb-8 rounded-3xl">
    <div className="flex items-center w-full">
      <SectionTitle text="Recommended For You" />
    </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {filteredData.length > 0 ? (
          filteredData.map((theatre) => (
            <BeamsTheatreCard key={theatre.id} data={theatre} />
          ))
        ) : (
          <div className="text-center text-gray-500 mt-8">No related content found</div>
        )}
      </div>
    </div>
  );
};

export default RecommendedSection;
