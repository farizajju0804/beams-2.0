import React from 'react';
import { Play, VideoPlay } from 'iconsax-react'; // Import Play icon from Iconsax
import { Button, Image } from '@nextui-org/react';
import { BeamsTheatre } from '@/types/beamsTheatre';

const NowShowingCard = ({ data }: { data: BeamsTheatre }) => {
  const { title, description, posterUrl, genre, seasons, episodes } = data;

  return (
    <div className="w-full lg:w-4/6 mb-24 lg:mb-32 flex flex-col items-center justify-center gap-8 max-w-5xl">
      <div className="w-full rounded-3xl flex items-center justify-center bg-center">
        <Image src={posterUrl} alt={title} width={0} height={0} className="w-full md:w-[70%] z-[2] mx-auto h-auto object-cover"/>
      </div>
      <div className="w-full flex items-start justify-center px-6">
        <Button size="lg" color="primary" startContent={<VideoPlay size="24" variant="Bold" />} className="text-white text-xl">
          Beam Now
        </Button>
      </div>
      <div className="w-full flex flex-row items-center justify-center gap-3 text-white px-6">
        <div className="text-sm text-center leading-[150%]">
          {genre.name}
        </div>
        {seasons.length > 0 && (
          <>
            <div className="h-[25px] w-px border-r border-solid border-white" />
            <div className="text-sm leading-[150%]">
              {seasons.length} Seasons
            </div>
          </>
        )}
        {episodes.length > 0 && (
          <>
            <div className="h-[25px] w-px border-r border-solid border-white" />
            <div className="text-sm leading-[150%]">
              {episodes.length} Episodes
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default NowShowingCard;
