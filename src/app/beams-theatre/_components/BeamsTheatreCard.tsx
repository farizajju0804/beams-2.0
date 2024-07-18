import React from 'react';
import { Clock, Folder } from 'iconsax-react';
import { BeamsTheatre } from '@/types/beamsTheatre';
import Link from 'next/link';
import BeamsTheatreFavoriteButton from './BeamsTheatreFavoriteButton';
import { Image } from '@nextui-org/react';
import NextImage from 'next/image'

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
    <Link className='flex items-center flex-col gap-4' href={`/beams-theatre/${id}`}>
      <div className="flex flex-col relative items-center justify-center overflow-hidden w-5/6">
        <Image as={NextImage} width={0} height={0} sizes="90vw" className='w-full mb-4 h-full aspect-' src={posterUrl} alt={title}/>
          <div className="absolute top-4 right-4">
            <BeamsTheatreFavoriteButton beamsTheatreId={id} />
          </div>
        </div>
        <div className='flex w-5/6 justify-between items-start'>
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
   
    </Link>
  );
};

export default BeamsTheatreCard;
