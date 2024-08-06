import React from 'react'
import VideoPlayer from './VideoPlayer'
import { Button } from '@nextui-org/react'
import { Heart, Profile2User, Share, Star, Star1, VideoPlay } from 'iconsax-react'
import PreviewPlayer from './PreviewPlayer'

const PreviewPlayerCard = () => {
  return (
    <div className='w-full flex flex-col gap-4 lg:w-4/6'>
     <PreviewPlayer id={'1234'} videoId="https://res.cloudinary.com/drlyyxqh9/video/upload/v1722598269/Beams%20today/Medical%20Miracle/medical-miracle-video_lyqh23.mp4" thumbnailUrl="https://res.cloudinary.com/drlyyxqh9/image/upload/v1722598239/Beams%20today/Medical%20Miracle/Medical_Miracle_Thumbnail_iky88e.png" />
     <div className='w-full flex justify-between'>
      <div className='font-display w-4/6 text-xl lg:text-3xl font-bold'>Magical Materials</div>
      <div className='flex gap-4 w-2/6 items-center justify-end'>
      <Button size='sm' className='bg-grey-3' isIconOnly startContent={<Heart variant='Bold' size={20} className='text-text'/>}>
      </Button>
      <Button size='sm' className='bg-grey-3' isIconOnly startContent={<Share variant='Bold' size={20} className='text-text'/>}>
      </Button>
      </div>
     
     </div>
     <div className='flex gap-4 justify-between items-center'>
      <div className='flex gap-2 items-center'>
      <Profile2User variant='Bold' className='text-text'/>
       <span className='text-grey-2 text-sm lg:text-base'>12 Beamers</span>
      </div>
      <div className='flex gap-2 items-center'>
      <Star1 variant='Bold' className='text-secondary-1'/>
       <span className='text-grey-2 text-sm lg:text-base'>4.3</span>
      </div>
      </div>
      <Button  color="primary" className="text-white mt-2 font-semibold text-lg lg:hidden" startContent={<VideoPlay variant='Bold' className="text-white" size="20" /> } >
       Start Course
      </Button>
    </div>
  )
}

export default PreviewPlayerCard