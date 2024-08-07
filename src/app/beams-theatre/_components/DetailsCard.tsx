import React from 'react';
import { Button } from '@nextui-org/react';
import { Heart, Profile2User, Share, Star1, VideoPlay } from 'iconsax-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { FaStar } from "react-icons/fa";
import CourseThumbnail from './CourseThumbnail';
import { IoShareSocial } from "react-icons/io5";
const DetailsCard = () => {
  return (
    <div className='w-full flex flex-col gap-4 lg:p-6 lg:rounded-lg lg:shadow-md'>
      <Breadcrumbs
        pageClassName="text-text"
        linkClassName="text-grey-2"
        items={[
          { href: "/", name: "Home" },
          { href: "/beams-theatre", name: "Beams Theatre" },
          { name: "Magical Materials" }
        ]}
      />
      <div className='flex flex-col-reverse  lg:flex-row justify-between items-center'>
        <div className='w-full flex  flex-col  mt-4 lg:mt-0 lg:w-4/6'>
          <div className='font-poppins text-2xl my-2 lg:text-4xl font-bold text-text'>Magical Materials</div>
          <div className='text-sm lg:text-lg text-grey-2'>Master the Wonders of Magical Materials: Transform Your Knowledge of Aerogels, Graphene, and Quantum Dots!</div>
          <div className='w-full flex gap-4 my-4 items-center'>
          <div className='flex gap-1 items-center'>
            <FaStar className='text-yellow-500'/>
            <span className='text-grey-2 text-sm'>4.7</span>
          </div>
          <div className='flex gap-1 items-center'>
            <Profile2User variant='Bold' className='text-text'/>
            <span className='text-grey-2 text-sm '>12 Beamers</span>
          </div>
          </div>
          <div className='flex gap-4 w-full lg:w-2/6 items-start mt-2 lg:mt-6'>
          <Button size='sm' className='bg-grey-3' isIconOnly startContent={<Heart variant='Bold' size={20} className='text-text'/>}></Button>
          <Button size='sm' className='bg-grey-3'  startContent={<IoShareSocial size={20} className='text-text'/>}>Share</Button>
        </div> 
         
        </div>
        <div className='hidden w-2/6 lg:flex flex-col p-4 gap-4'>
        <CourseThumbnail thumbnailUrl="https://res.cloudinary.com/drlyyxqh9/image/upload/v1722598240/Beams%20today/Robot%20Transforming%20Family%20Life/Robot_Thumbnail_mg5m2j.png"  videoId='https://res.cloudinary.com/drlyyxqh9/video/upload/v1722598267/Beams%20today/Robot%20Transforming%20Family%20Life/robot_wipoix.mp4' />
      {/* <PreviewPlayer videoId='https://res.cloudinary.com/drlyyxqh9/video/upload/v1722598267/Beams%20today/Robot%20Transforming%20Family%20Life/robot_wipoix.mp4' thumbnailUrl='https://res.cloudinary.com/drlyyxqh9/image/upload/v1722598240/Beams%20today/Robot%20Transforming%20Family%20Life/Robot_Thumbnail_mg5m2j.png' id='1' /> */}
      <Button  color="primary" className="text-white w-full mt-2 font-semibold text-lg " startContent={<VideoPlay variant='Bold' className="text-white" size="20" /> } >
       Start Course
      </Button>
        </div>
        <div className='w-full flex lg:hidden'>
        <CourseThumbnail thumbnailUrl="https://res.cloudinary.com/drlyyxqh9/image/upload/v1722598240/Beams%20today/Robot%20Transforming%20Family%20Life/Robot_Thumbnail_mg5m2j.png"  videoId='https://res.cloudinary.com/drlyyxqh9/video/upload/v1722598267/Beams%20today/Robot%20Transforming%20Family%20Life/robot_wipoix.mp4' />
        </div>
      </div>
    </div>
  );
};

export default DetailsCard;
