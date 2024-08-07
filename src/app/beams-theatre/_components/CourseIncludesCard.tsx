'use client';
import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import { VideoSquare, Cup, MonitorMobbile, DocumentDownload, Unlimited } from 'iconsax-react'; // Custom icons
import React from 'react';

// Mapping of outcomes to their corresponding icons
const outcomes = [
  { text: "2 hours on demand video", icon: VideoSquare },
  { text: "4 downloadable resources", icon: DocumentDownload },
  { text: "Certificate Of Completion", icon: Cup },
  { text: "Full lifetime access", icon: Unlimited },
  { text: "Access on mobile and desktop", icon: MonitorMobbile }
];

const CourseIncludesCard = () => {
  return (
    <div className='w-full'>
      <Card className='w-full border-none outline-none shadow-none'>
        <CardHeader className='flex py-4 items-center'>
          <h2 className='text-xl md:text-2xl font-semibold font-poppins text-text'>This course includes:</h2>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            {outcomes.map((outcome, id) => (
              <div key={id} className='flex gap-2 my-2 items-center'>
                <outcome.icon size={20} variant='Bold' className='text-text' />
                <p className='text-grey-2 text-sm md:text-base'>{outcome.text}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CourseIncludesCard;
