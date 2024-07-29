'use client'
import React, { useRef, useState, useEffect } from 'react';
import { BeamsToday } from '@/types/beamsToday';
import BeamsTodayCard from './BeamsTodayCard'; // Make sure this path is correct
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react';
import { Button } from '@nextui-org/react';


interface RelatedSectionProps {
  topics: BeamsToday[];
  categoryName: string;
}

const RelatedSection: React.FC<RelatedSectionProps> = ({ topics, categoryName }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayedTopics, setDisplayedTopics] = useState<BeamsToday[]>(topics.slice(0, 9));
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
      }
    };

    const containerElement = containerRef.current;
    if (containerElement) {
      containerElement.addEventListener('scroll', handleScroll);
      return () => {
        containerElement.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -330, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 330, behavior: 'smooth' });
    }
  };

  return (
    <div className="p-4 mb-6">
      <div className="flex justify-between items-center">
        <h1 className="text-lg md:text-3xl font-display font-bold mb-1">Recommended For You</h1>
        <div className="flex space-x-4">
          <Button size="sm" isIconOnly onClick={scrollLeft} isDisabled={!canScrollLeft} className={`bg-gray-100 rounded-full p-2 ${!canScrollLeft ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <ArrowLeft2 size={16} />
          </Button>
          <Button size="sm" isIconOnly onClick={scrollRight} isDisabled={!canScrollRight} className={`bg-gray-100 rounded-full p-2 ${!canScrollRight ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <ArrowRight2 size={16} />
          </Button>
        </div>
      </div>
      <div className="border-b-2 border-brand-950 mb-6 w-full" style={{ maxWidth: '10%' }}></div>
      <div
        ref={containerRef}
        className="flex gap-8 md:gap-16 overflow-x-auto no-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        {displayedTopics.map((topic) => (
          <BeamsTodayCard key={topic.id} topic={topic} />
        ))}
      </div>
    </div>
  );
};

export default RelatedSection;
