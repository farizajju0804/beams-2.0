import { Card, CardBody, CardHeader } from '@nextui-org/react'
import React from 'react'

const OverviewCard = () => {
  return (
    <Card className='bg-grey-3 shadow-none border-none'>
    <CardBody className='p-4'>
    <h1 className='font-display text-lg lg:text-2xl font-bold text-grey-2 mb-4'>Overview</h1>
      <p className='text-sm text-grey-2 lg:text-base'>
      Lorem ipsum dolor sit amet consectetur. Pellentesque elementum venenatis nunc et ut. Ultrices velit euismod massa quis. Dictumst tellus etiam dignissim amet arcu odio viverra. Eu suspendisse auctor est varius et. Mattis ultrices tellus potenti consectetur nibh blandit quis vel. Sed nibh elit orci consectetur at mus. Sed quam dui ut commodo fames quis odio pretium volutpat. Venenatis arcu nec lectus commodo tincidunt lacus dui vel.
      </p>
    </CardBody>
  </Card>
  )
}

export default OverviewCard