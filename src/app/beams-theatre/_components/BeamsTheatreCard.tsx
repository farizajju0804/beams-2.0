import React from 'react';
import { Clock, Folder } from 'iconsax-react'; // Import icons from Iconsax
import { BeamsTheatre } from '@/types/beamsTheatre';

const formatTime = (timeInSeconds: number) => {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  return `${hours}h ${minutes}min`;
};

const BeamsTheatreCard: React.FC<{ data: any }> = ({ data }) => {
  const { title, posterUrl, totalTime, episodes, structure } = data;

  return (
    <div className="flex flex-col items-center  overflow-hidden w-full">
      <div className="w-full h-60 lg:h-80 rounded-[2rem] bg-cover bg-center mb-4" style={{ backgroundImage: `url(${posterUrl})` }}></div>
      <div className="text-xl text-left font-semibold w-full mb-4">{title}</div>
      <div className='flex w-full justify-between items-start'>
      <div className="flex items-center text-gray-600 text-sm">
        <Clock size="20" className="mr-2" />
        <span>{formatTime(totalTime)}</span>
      </div>
      {structure !== 'SINGLE_VIDEO' && episodes && (
        <div className="flex items-center text-gray-600 text-xs md:text-sm mt-2">
          <Folder size="16" className="mr-2" />
          <span>{episodes.length} Episodes</span>
        </div>
      )}
      </div>
    </div>
  );
};

export default BeamsTheatreCard;
