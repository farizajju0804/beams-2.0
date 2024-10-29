'use client'; // Indicating this component is a client component in Next.js
import React from 'react';
import { useRouter } from 'next/navigation'; // Importing the Next.js router for navigation

import FormattedDate from './FormattedDate'; // Importing the FormattedDate component

import { Chip } from "@nextui-org/react"; // Importing the Chip component from NextUI

// Define the props for the BeamsTodayCard component
interface BeamsTodayCardProps {
  topic: any; // The topic object with necessary properties
  className?: string; // Optional className for additional styling
}

// Functional component for displaying a search card for today's beam
const BeamsTodaySearchCard: React.FC<BeamsTodayCardProps> = ({ topic, className = '' }) => {
  const router = useRouter(); // Initializing the router for navigation

  // Handler for card click event to navigate to the topic's detail page
  const handleCardClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevents the click event from bubbling up
    event.preventDefault(); // Prevents the default action of the event
    router.push(`/beams-today/${topic.id}`); // Navigates to the topic detail page
  };

  return (
    <div
      className={`cursor-pointer relative aspect-square rounded-3xl flex flex-col justify-between px-4 py-6 box-border leading-[normal] tracking-[normal] ${className}`}
      style={{ 
        backgroundImage: `url(${topic.thumbnailUrl})`, // Sets the background image to the topic thumbnail
        backgroundSize: 'cover', // Covers the entire div with the background image
        backgroundRepeat: 'no-repeat', // Prevents the background image from repeating
        backgroundPosition: 'center' // Centers the background image
      }}
      onClick={handleCardClick} // Attaches the click handler to the card
    >
      <div className="flex flex-row items-center justify-between py-0 px-1">
        {/* Renders a Chip component if the topic has a category */}
        {topic?.category && (
          <Chip size='sm' className="mb-2 bg-white text-black">
            {topic.category.name} {/* Displays the category name */}
          </Chip>
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 self-stretch mt-auto [backdrop-filter:blur(20px)] rounded-b-3xl [background:linear-gradient(92.11deg,_#fff5ed,_rgba(255,_255,_255,_0.2)_99.93%)] flex flex-col items-start justify-start p-4 gap-2 text-left text-base md:text-xl text-black">
        <h3 className="m-0 relative text-inherit font-semibold font-inherit">
          {topic.title} {/* Displays the title of the topic */}
        </h3>
        <div className="relative text-xs md:text-sm inline-block">
          <FormattedDate date={topic.date.toISOString().split('T')[0]} /> {/* Formats and displays the date */}
        </div>
      </div>
    </div>
  );
};

export default BeamsTodaySearchCard; // Exports the component for use in other parts of the application
