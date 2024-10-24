'use client'
import React from 'react';
import { useRouter } from 'next/navigation';

import FormattedDate from './FormattedDate';

import { Chip } from "@nextui-org/react";

interface BeamsTodayCardProps {
  topic: any;
  className?: string;
}

const BeamsTodaySearchCard: React.FC<BeamsTodayCardProps> = ({ topic, className = '' }) => {
  const router = useRouter();

  const handleCardClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    router.push(`/beams-today/${topic.id}`);
  };

  return (
    <div
      className={`cursor-pointer relative aspect-square rounded-3xl flex flex-col justify-between px-4 py-6 box-border leading-[normal] tracking-[normal] ${className}`}
      style={{ 
        backgroundImage: `url(${topic.thumbnailUrl})`, 
        backgroundSize: 'cover', 
        backgroundRepeat: 'no-repeat', 
        backgroundPosition: 'center' 
      }}
      onClick={handleCardClick} // Navigate to the topic page
    >
      <div className="flex flex-row items-center justify-between py-0 px-1">
        {topic?.category && (
          <Chip size='sm' className="mb-2 bg-white text-black">
            {topic.category.name}
          </Chip>
        )}
        {/* <div className="[backdrop-filter:blur(15px)] rounded-2xl flex flex-row items-start justify-start" onClick={(event) => event.stopPropagation()}>
          <FavoriteButton beamsTodayId={topic.id} />
        </div> */}
      </div>
      <div className="absolute bottom-0 left-0 right-0 self-stretch mt-auto [backdrop-filter:blur(20px)] rounded-b-3xl [background:linear-gradient(92.11deg,_#fff5ed,_rgba(255,_255,_255,_0.2)_99.93%)] flex flex-col items-start justify-start p-4 gap-2 text-left text-base md:text-xl text-black">
        <h3 className="m-0 relative text-inherit font-semibold font-inherit">
          {topic.title}
        </h3>
        <div className="relative text-xs md:text-sm inline-block">
          <FormattedDate date={topic.date.toISOString().split('T')[0]} />
        </div>
      </div>
    </div>
  );
};

export default BeamsTodaySearchCard;
