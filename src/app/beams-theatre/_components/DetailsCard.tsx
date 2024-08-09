import React from 'react';
import { Button } from '@nextui-org/react';
import { Heart, Profile2User, Share, Star1, VideoPlay } from 'iconsax-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { FaStar } from "react-icons/fa";
import CourseThumbnail from './CourseThumbnail';
import { IoShareSocial } from "react-icons/io5";
const DetailsCard = () => {
  return (
    <div className='w-full flex flex-col gap-2 lg:gap-4 lg:rounded-lg'>
      <Breadcrumbs
        pageClassName="text-text"
        linkClassName="text-grey-2"
        items={[
          { href: "/", name: "Home" },
          { href: "/beams-theatre", name: "Beams Theatre" },
          { name: "Magical Materials" }
        ]}
      />
      <div className='flex flex-col justify-center items-center'>
        <div className='w-full flex justify-center items-center flex-col mt-2 lg:mt-0'>
          <div className='w-full lg:w-[60%] flex items-center justify-center'>
        <CourseThumbnail thumbnailUrl="https://res.cloudinary.com/drlyyxqh9/image/upload/v1722598240/Beams%20today/Robot%20Transforming%20Family%20Life/Robot_Thumbnail_mg5m2j.png"  videoId='https://res.cloudinary.com/drlyyxqh9/video/upload/v1722598267/Beams%20today/Robot%20Transforming%20Family%20Life/robot_wipoix.mp4' />
          </div>
          <div className='font-poppins w-full text-2xl text-left lg:text-center mt-4 my-2 lg:text-4xl font-bold text-text'>Magical Materials</div>
          <div className='w-full lg:w-[60%] text-left lg:text-center text-sm lg:text-lg text-grey-2'>Master the Wonders of Magical Materials: Transform Your Knowledge of Aerogels, Graphene, and Quantum Dots!</div>
          <div className='w-full flex gap-2 mt-4 justify-start lg:justify-center items-center'>
          <div className='flex gap-1 mr-4 items-center'>
            <Profile2User variant="TwoTone" className='text-black'/>
            <span className='text-grey-2 text-sm '>12 Beamers</span>
          </div>
          <Button size='sm' className='bg-transparent' isIconOnly startContent={<Heart variant='Bold' size={20} className='text-[#888888]'/>}></Button>
          <Button size='sm' className='bg-transparent' isIconOnly  startContent={<IoShareSocial size={20} className='text-[#888888]'/>}></Button>
          </div>
        </div>
       
        
      </div>
    </div>
  );
};

export default DetailsCard;
