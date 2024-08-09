'use client';
import React, { useState } from 'react';
import PreviewPlayer from './PreviewPlayer';
import { FaPlay } from "react-icons/fa6";

interface ThumbnailProps {
  thumbnailUrl: string;
  videoId: string;
}

const CourseThumbnail: React.FC<ThumbnailProps> = ({ thumbnailUrl, videoId }) => {
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  return (
    <div className='relative w-full h-0 pb-56 overflow-hidden rounded-lg cursor-pointer' style={{ paddingBottom: '56.25%' }} onClick={() => setIsPreviewVisible(true)}>
      {isPreviewVisible ? (
        <PreviewPlayer videoId={videoId} thumbnailUrl={thumbnailUrl} id='1' />
      ) : (
        <>
          <img
            src={thumbnailUrl}
            alt='Course Thumbnail'
            className='absolute top-0 left-0 w-full h-full object-cover'
          />
          <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center'>
            <div className='bg-background rounded-full p-3 flex items-center justify-center shadow-lg'>
              <FaPlay size={20} className='text-primary' />
            </div>
          </div>
          <div className='absolute bottom-0 left-0 w-full h-full flex items-end'>
            <div className='w-full text-center bg-gradient-to-t from-text to-transparent py-2 font-poppins font-medium text-background text-base lg:text-lg'>
              Preview this course
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CourseThumbnail;
