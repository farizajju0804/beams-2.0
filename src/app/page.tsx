
import Navbar from '@/components/Navbar'
import { PinCard } from '@/components/PinCard'
import ScrollPath from '@/components/ScrollPath'
import { SparklesSection } from '@/components/SparklesSection'
import FullScreenVideoBackground from '@/components/VideoSection'
import React from 'react'

const page = () => {
  return (
    <div className='w-full min-h-[130vh]'>
    <SparklesSection/>
    <FullScreenVideoBackground/>
    <PinCard/>
    {/* <ScrollPath/> */}
    </div>
  )
}

export default page