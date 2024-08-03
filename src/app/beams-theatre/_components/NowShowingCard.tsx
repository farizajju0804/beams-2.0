import React from 'react';
import { Play, VideoPlay } from 'iconsax-react'; // Import Play icon from Iconsax
import { Button, Image } from '@nextui-org/react';
import { BeamsTheatre } from '@/types/beamsTheatre';
import Link from 'next/link';
import NextImage from "next/image";


const NowShowingCard = ({ data }: { data: BeamsTheatre }) => {
  const { id, title, description, posterUrl, genre, episodes } = data;

  return (
    <div className="w-full mb-24 lg:mb-32 flex flex-col items-center justify-center gap-4 max-w-5xl">
      <div className="w-full rounded-3xl flex items-center justify-center bg-center">
        <Image  as={NextImage} src={posterUrl} alt={title} width={0} height={0} sizes='100vw' className="w-full z-[2] mx-auto aspect-video object-cover"/>
      </div>
      <div className="w-full flex items-start justify-center px-6">
        <Link href={`/beams-theatre/${id}`} passHref>
          <Button size="lg" color="primary" startContent={<VideoPlay size="24" variant="Bold" />} className="text-white text-xl">
            Beam Now
          </Button>
        </Link>
      </div>
      <div className="w-full flex flex-row items-center justify-center gap-3 text-gray-300 px-6">
        <div className="text-sm text-center leading-[150%]">
          {genre.name}
        </div>
        {episodes.some(ep => ep.season) && (
          <>
            <div className="h-[25px] w-px border-r border-solid border-white" />
            <div className="text-sm leading-[150%]">
              {new Set(episodes.map(ep => ep.season)).size} Seasons
            </div>
          </>
        )}
        {episodes.length > 1 && (
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
