import React from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader } from '@nextui-org/react';
import { ArrowRight2 } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { GoLinkExternal } from 'react-icons/go';

interface GameSolutionProps {
  firstImage: string;
  secondImage: string;
  thirdImage: string;
  referenceLink: string;
  answer: string;
  title: string;
  hint: string;
  onBackToGame?: () => void;
  answerExplanation: string;
  solutionPoints: string[];
  showBackButton?: boolean;
}

export const GameSolution = ({ 
  firstImage,
  secondImage,
  thirdImage,
  referenceLink, 
  answer, 
  title, 
  hint, 
  onBackToGame,
  answerExplanation,
  solutionPoints,
  showBackButton = true
}: GameSolutionProps) => {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
   
      

   <Card className="overflow-hidden">
  <CardHeader className="bg-default-50 border-b flex flex-col gap-3">
    <h2 className="text-xl md:text-2xl font-poppins font-medium text-center w-full">
      {title}
    </h2>
    <p className="text-xl md:text-2xl font-poppins font-medium text-center w-full text-brand">
      <span className='text-text'>Answer:</span> {answer}
    </p>
  </CardHeader>

  <CardBody className="px-6 pt-6 pb-1 space-y-8">
    {/* Points with Images */}
    <div className="space-y-6">
      <h3 className="text-base md:text-lg font-poppins font-medium">Can you spot the connection?</h3>
      
      <div className="flex flex-col gap-12">
        {/* First Point with Image */}
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <Image
              src={firstImage}
              alt={`Connection point 1`}
              width={2000}
              height={2000}
              className="object-cover w-20 md:w-32 h-auto rounded-lg shadow-lg"
              priority
            />
          </div>
          <div className="flex-1">
            <p className="text-xs md:text-sm text-grey-2">{solutionPoints[0]}</p>
          </div>
        </div>

        {/* Second Point with Image */}
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <Image
              src={secondImage}
              alt={`Connection point 2`}
              width={2000}
              height={2000}
              className="object-cover w-20 md:w-32 h-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="flex-1">
            <p className="text-xs md:text-sm text-grey-2">{solutionPoints[1]}</p>
          </div>
        </div>

        {/* Third Point with Image */}
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <Image
              src={thirdImage}
              alt={`Connection point 3`}
              width={2000}
              height={2000}
              className="object-cover w-20 md:w-32 h-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="flex-1">
            <p className="text-xs md:text-sm text-grey-2">{solutionPoints[2]}</p>
          </div>
        </div>
      </div>
    </div>

    {/* Detailed Explanation */}
    <div className="space-y-2">
      <h3 className="text-base md:text-lg font-poppins font-medium">More About This Connection</h3>
      <div className=" max-w-none">
        {answerExplanation.split('\n\n').map((paragraph, index) => (
          <div key={index} className="mb-4">
            <p className="text-xs md:text-sm text-grey-2">{paragraph}</p>
          </div>
        ))}
      </div>
      <Button
      as={Link}
      href={referenceLink}
      prefetch
      variant='ghost'
      endContent={<GoLinkExternal className="w-4 h-4 mr-1" />}
      className="flex w-fit items-center mx-auto mb-2 font-semibold text-grey-2"
    >
      Learn More
    </Button>
    </div>
  </CardBody>

  <CardFooter>
    <Button
      as={Link}
      href='/beams-connect'
      prefetch
      endContent={<ArrowRight2 className="w-4 h-4 mr-1" />}
      className="flex items-center mx-auto mb-2 font-semibold text-grey-2"
    >
      Explore Other Beams Connects
    </Button>
  </CardFooter>
</Card>
    </div>
  );
};