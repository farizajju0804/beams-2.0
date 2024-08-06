import { Card, CardBody, CardHeader } from '@nextui-org/react'
import { Verify } from 'iconsax-react'
import React from 'react'

const LearnPointsCard = () => {
  return (
    <Card className='bg-grey-3 shadow-none border-none'>
    <CardBody className='p-4'>
    <h1 className='font-display text-lg lg:text-2xl font-bold text-text mb-4'>What You’ll Learn</h1>
    <div  className='flex gap-4 items-center mb-4'>
              <Verify variant='Bold' className='text-text' />
              <p className='text-grey-2 text-sm lg:text-base'>Lorem ipsum dolor sit amet consectetur. Enim blandit.</p> 
              </div>
    </CardBody>
  </Card>
  )
}

export default LearnPointsCard