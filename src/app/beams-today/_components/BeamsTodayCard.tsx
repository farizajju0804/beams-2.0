// 'use client'
import React from 'react';
// import { useRouter } from 'next/navigation'; // Next.js router for navigation

import FormattedDate from './FormattedDate'; // Component to format the date
import { BeamsToday } from '@/types/beamsToday'; // Type definition for BeamsToday data
import { Chip } from "@nextui-org/react"; // UI library component for category chips
import Image from 'next/image';
import Link from 'next/link';

interface BeamsTodayCardProps {
  topic: BeamsToday; // The topic data for each BeamsToday card
  className?: string; // Optional className prop for styling
}

/**
 * BeamsTodayCard component renders a clickable card for each topic.
 * It includes a category chip, favorite button, title, and formatted date.
 */
const BeamsTodayCard: React.FC<BeamsTodayCardProps> = ({ topic, className = '' }) => {
  // const router = useRouter();

  /**
   * Handles the click event on the card to navigate to the detailed view of the topic.
   * @param event - Mouse event to prevent default behavior.
   */
  const handleCardClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    // router.push(`/beams-today/${topic.id}`); // Navigate to the topic page
  };

  return (
    <Link href={`/beams-today/${topic.id}`} prefetch onClick={handleCardClick}>
    <div
      className={`cursor-pointer relative h-[260px] md:h-[320px] aspect-square rounded-3xl flex flex-col justify-between px-4 py-6 box-border leading-[normal] tracking-[normal] ${className}`}
      // style={{ 
      //   backgroundImage: `url(${topic?.thumbnailUrl})`, // Set background image from topic thumbnail
      //   backgroundSize: 'cover', 
      //   backgroundRepeat: 'no-repeat', 
      //   backgroundPosition: 'center' 
      // }}
      // onClick={handleCardClick} 
    >
         <Image
      src={topic?.thumbnailUrl || ""} // Image source based on theme
      alt="Background Image" // Alt text for accessibility
      layout="fill" // Makes the image fill the parent container
      priority
      className="absolute rounded-3xl object-cover inset-0 z-0" // Positions the image absolutely and fills the section
    />
      <div className="flex flex-row items-center justify-between py-0 px-1">
        {topic?.category && (
          <Chip size='sm' className="mb-2 bg-white text-black">
            {topic?.category.name} {/* Category name displayed in a chip */}
          </Chip>
        )}
        <div className="[backdrop-filter:blur(5px)] rounded-2xl bg-text flex flex-row items-start justify-start" onClick={(event) => event.stopPropagation()}>
          {/* <FavoriteButton beamsTodayId={topic?.id} /> */}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 mt-auto [backdrop-filter:blur(5px)] rounded-b-3xl [background:linear-gradient(90deg,_#fff5ed,_rgba(255,_255,_255,_0.2)_100%)] flex flex-col items-start justify-start p-4 gap-2 text-left text-base md:text-xl text-black">
        <h3 className="m-0 relative text-inherit font-semibold font-inherit">
          {topic?.title} {/* Topic title */}
        </h3>
        <div className="relative text-xs md:text-sm inline-block">
          <FormattedDate date={topic?.date.toISOString().split('T')[0]} /> {/* Formatted date */}
        </div>
      </div>
    </div>
    </Link>
  );
};

export default BeamsTodayCard;
