import { Button, Card, CardBody, CardFooter, CardHeader, Divider } from '@nextui-org/react';
import { Verify, VideoPlay, VideoSquare,  Cup,  MonitorMobbile, DocumentDownload, Unlimited} from 'iconsax-react'; // Assume these are the custom icons you want to use
import React from 'react';

// Mapping of outcomes to their corresponding icons
const outcomes = [
  { text: "2 hours on demand video", icon: VideoSquare },
  { text: "4 downloadable resources", icon: DocumentDownload },
  { text: "Certificate Of Completion", icon: Cup },
  { text: "Full lifetime access", icon: Unlimited },
  { text: "Access on mobile and desktop", icon: MonitorMobbile }
];

const CourseStartCard = () => {
  return (
    <div className='hidden lg:block w-2/6'>
      <Card className='w-full bg-grey-3 border-none outline-none shadow-none'>
        <CardHeader className='flex py-4 items-center'>
          <h1 className='text-4xl font-semibold font-poppins text-text'>$20</h1>
          <p className='text-base text-default-500 line-through ml-2'>$30</p>
        </CardHeader>
        <Divider />
        <CardBody>
          {outcomes.map((outcome, id) => (
            <div key={id} className='flex gap-2 my-3 items-center'>
              <outcome.icon variant='Bold' className='text-text' />
              <p className='text-grey-2 text-sm'>{outcome.text}</p>
            </div>
          ))}
        </CardBody>
        <Divider />
        <CardFooter className='mx-auto w-full py-4'>
          <Button
            startContent={<VideoPlay variant='Bold' />}
            className='text-white text-lg w-full font-semibold'
            color='primary'
          >
            Start Course
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CourseStartCard;
