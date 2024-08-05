import Breadcrumbs from '@/components/Breadcrumbs'
import React from 'react'
import VideoPlayer from './VideoPlayer'
import EpisodeDetails from './EpisodeDetails'

const PlayerComponent = () => {
  return (
    <div className='w-full flex flex-col gap-4 px-4 lg:px-[40px]'>
        <Breadcrumbs
        pageClassName="text-text"
        linkClassName="text-grey-2"
          items={[
            { href: "/", name: "Home" },
            { href: "/beams-theatre", name: "Beams Theatre" },
            { href: "/beams-theatre", name: "Magical Materials" },
            { name: "Current Epsiode Name" },
          ]}
        />

     <VideoPlayer  id={'1234'} videoId="https://res.cloudinary.com/drlyyxqh9/video/upload/v1722598269/Beams%20today/Medical%20Miracle/medical-miracle-video_lyqh23.mp4" thumbnailUrl="https://res.cloudinary.com/drlyyxqh9/image/upload/v1722598239/Beams%20today/Medical%20Miracle/Medical_Miracle_Thumbnail_iky88e.png" />
      <EpisodeDetails/>
        
        </div>
  )
}

export default PlayerComponent