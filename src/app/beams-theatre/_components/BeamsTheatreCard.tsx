import React from 'react';
import { Clock, Folder } from 'iconsax-react'; // Import icons from Iconsax
import { BeamsTheatre } from '@/types/beamsTheatre';
import Link from 'next/link';

interface BeamsTheatreWithTotalTime extends BeamsTheatre {
  totalTime: number;
}

const formatTime = (timeInSeconds: number) => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  return `${hours}h ${minutes}min`;
};

const BeamsTheatreCard: React.FC<{ data: BeamsTheatreWithTotalTime }> = ({ data }) => {
  const { id, title, posterUrl, totalTime, episodes } = data;

  return (
    <Link href={`/beams-theatre/${id}`}>
      <div className="flex flex-col items-center overflow-hidden w-full">
        <div className="w-full h-60 lg:h-80 rounded-[2rem] bg-cover bg-center mb-4" style={{ backgroundImage: `url(${posterUrl})` }}></div>
        <div className='flex w-full justify-between items-start'>
          <div className="flex items-center text-gray-600 text-sm">
            <Clock size="20" className="mr-2" />
            <span>{formatTime(totalTime)}</span>
          </div>
          {episodes && episodes.length > 0 && (
            <div className="flex items-center text-gray-600 text-xs md:text-sm">
              <Folder size="16" className="mr-2" />
              <span>{episodes.length} Episodes</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BeamsTheatreCard;
