import React from 'react';
import { Play, VideoPlay } from 'iconsax-react'; // Import Play icon from Iconsax
import { Button } from '@nextui-org/react';

const NowShowingCard = ({ data }:any) => {
  const { title, description, imageUrl, category, seasons, episodes } = data;

  return (
    <div
      className={`w-full aspect-auto lg:w-4/6 mb-24 lg:mb-32 rounded-3xl overflow-hidden flex flex-col items-start justify-start px-6 py-12 lg:py-24 lg:px-14 box-border object-cover gap-8 bg-cover bg-no-repeat bg-center max-w-5xl leading-normal tracking-normal text-left text-base text-white`}
      style={{ 
        background: `linear-gradient(270deg, rgba(24, 24, 24, 0.00) 0.22%, rgba(24, 24, 24, 0.60) 97.24%), url(${imageUrl}) lightgray 0px -256.883px / 100% 189.425% no-repeat`, 
      }}
    >
      <section className=" flex flex-col items-start justify-start gap-4 text-left text-2xl lg:text-4xl ">
        <h1 className="m-0 relative font-display leading-tight font-semibold">
          {title}
        </h1>
        <div className="hidden lg:block relative text-sm font-normal leading-normal ">
          {description}
        </div>
      </section>
      <div className='w-full flex items-start justify-start'>
      <Button size="lg" color="primary" startContent={ <VideoPlay size="24" variant="Bold" />} className="text-white rounded-2xl">
    
    Start Watching   
   </Button>
   </div>
      <div className="h-6  flex flex-row items-start justify-start gap-3">
        <div className="relative leading-[150%] inline-block">
          {category}
        </div>
        <div className="h-[25px] w-px relative box-border border-r border-solid border-colors-base-primary-foreground" />
        <div className="relative leading-[150%] inline-block ">
          {seasons} Seasons
        </div>
        <div className="h-[25px] w-px relative box-border border-r border-solid border-colors-base-primary-foreground" />
        <div className="relative leading-[150%] inline-block ">
          {episodes} Episodes
        </div>
      </div>
    </div>
  );
}

export default NowShowingCard;
