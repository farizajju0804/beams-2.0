import { Button, Card, CardBody, CardFooter, CardHeader, Divider } from '@nextui-org/react'
import { Verify, VideoPlay } from 'iconsax-react'
import React from 'react'

const outcomes = [
    "2 hours on demand video",
     "4 downloadable resources",
     "Certificate Of Completion",
     "Full lifetime access",
     "Access on mobile and desktop"
]

const CourseStartCard = () => {
  return (
    <div className='hidden lg:block w-2/6'>
       <Card className='w-full bg-grey-3 border-none outline-none shadow-none'>
        <CardHeader className='flex py-4 items-center'>
            <h1 className='text-4xl font-semibold font-poppins text-text'>$20</h1>
            <p className='text-base text-default-500 line-through ml-2'>$30</p>
        </CardHeader>
        <Divider/>
        <CardBody>
            {
               outcomes.map( (outcome,id) => 
              <div key={id} className='flex gap-2 my-2 items-center'>
              <Verify variant='Bold' className='text-text' />
              <p className='text-grey-2 text-sm lg:text-base'>{outcome}</p> 
              </div>
                )
            }
        </CardBody>
        <Divider/>
        <CardFooter className='mx-auto w-full py-4'>
            <Button startContent={<VideoPlay variant='Bold' />} className='text-white text-lg w-full font-semibold' color='primary'> Start Course
                </Button>        
            </CardFooter>
        </Card>
    </div>
  )
}

export default CourseStartCard