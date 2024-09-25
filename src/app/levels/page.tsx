import Sidebar from '@/components/Sidebar'
import TopNav from '@/components/TopNav'
import React from 'react'
import Heading from '../dashboard/_components/Heading'
import UserLevelIndicator from './_components/UserLevelIndicator'

const page = () => {
  return (
    <div className='flex flex-col w-full'>
      <div className='md:pl-6'>
        <Heading heading='Levels'/>
       
        </div>
        <UserLevelIndicator beams={50}/>

    </div>
  )
}

export default page