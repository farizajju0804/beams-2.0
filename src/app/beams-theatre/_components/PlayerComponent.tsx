'use client';

import React from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';
import VideoPlayer from './VideoPlayer';
import EpisodeDetails from './EpisodeDetails';
import Image from 'next/image';
import { useSidebarStore } from '@/store/sidebarStore';

const PlayerComponent: React.FC = () => {
  const { isOpen } = useSidebarStore();

  return (
    <div className='w-full flex flex-col gap-4 lg:px-[40px]'>
      <div className='px-6 lg:px-0'>
        <Breadcrumbs
          pageClassName="text-text"
          linkClassName="text-grey-2"
          items={[
            { href: "/", name: "Home" },
            { href: "/beams-theatre", name: "Beams Theatre" },
            { href: "/beams-theatre", name: "Magical Materials" },
            { name: "Current Episode Name" },
          ]}
        />
      </div>
       
      <div className={`w-full lg:w-full relative bg-[#000000] flex min-h-[300px] items-start ${isOpen ? 'lg:min-h-[360px]' : 'lg:min-h-[460px]'} justify-center`}>
        <div className='px-4 py-8 lg:p-0 lg:mt-8 w-full lg:w-4/6'>
          <VideoPlayer videoTitle='Medical Miracle' id={'1234'} videoId="https://res.cloudinary.com/drlyyxqh9/video/upload/v1722598269/Beams%20today/Medical%20Miracle/medical-miracle-video_lyqh23.mp4" thumbnailUrl="https://res.cloudinary.com/drlyyxqh9/image/upload/v1722598239/Beams%20today/Medical%20Miracle/Medical_Miracle_Thumbnail_iky88e.png" />
        </div>   
        <Image className='absolute w-full h-[60px] bottom-0 right-0 left-0' width={0} height={0} sizes='100%' src='/images/beams-theatre/theatre-seat.png' alt='row' />
      </div>
      <EpisodeDetails/>
    </div>
  )
}

export default PlayerComponent;
