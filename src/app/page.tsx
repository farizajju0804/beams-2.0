
import Navbar from '@/components/Navbar'
import { SparklesSection } from '@/components/SparklesSection'
import FullScreenVideoBackground from '@/components/VideoSection'
import React from 'react'

const page = () => {
  return (
    <div className='w-full min-h-[130vh]'>
    <SparklesSection/>
    <FullScreenVideoBackground/>
    </div>
  )
}

export default page