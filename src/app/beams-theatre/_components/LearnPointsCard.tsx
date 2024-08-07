'use client';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { Verify } from 'iconsax-react';
import React from 'react';

// Array of learning points for the course on "Magical Materials"
const learnPoints = [
  "Understand the properties of magical materials.",
  "Explore the applications of aerogels.",
  "Learn about the use of graphene in technology.",
  "Discover the potential of quantum dots.",
  "Study self-healing materials and their uses.",
  "Investigate metamaterials and their unique properties.",
  "Analyze piezoelectric materials and their applications.",
  "Gain insights into the future of material science."
];

const LearnPointsCard = () => {
  return (
    <Card className='shadow-none border-1 border-text/20'>
      <CardBody className='p-4'>
        <h1 className='font-poppins text-xl md:text-2xl font-semibold text-text mb-4'>What You’ll Learn</h1>
        <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 md:gap-y-6  items-start justify-start'>
          {learnPoints.map((point, index) => (
            <div key={index} className='w-full flex items-start'>
              <Verify size={20} variant='Bold' className='text-green-500 mr-3 w-fit' />
              <p className='text-grey-2 text-sm lg:text-base w-full'>{point}</p>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}

export default LearnPointsCard;
