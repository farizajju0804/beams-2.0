
import { ThreeDCardSection } from '@/components/3dCardSection'
import { ModulesStickyScroll } from '@/components/ModulesStickyScroll'
import Navbar from '@/components/Navbar'
import { PinCard } from '@/components/PinCard'
import ScrollPath from '@/components/ScrollPath'
import ScrollyComponent from '@/components/ScrollyComponent'
import { SparklesSection } from '@/components/SparklesSection'
import Testimonial from '@/components/Testimonial'
import FullScreenVideoBackground from '@/components/VideoSection'
import { CardContainer } from '@/ui/3d-Card'
import { Spotlight } from '@/ui/Spotlight'
import React from 'react'

const page = () => {
  return (
    <div className='w-full min-h-[130vh] '>
    <SparklesSection/>
    {/* <FullScreenVideoBackground/> */}
    <PinCard/>
    <ModulesStickyScroll/>
    <Testimonial/>
    <ThreeDCardSection/>

    {/* <ScrollyComponent/> */}
    {/* <ScrollPath/> */}
    </div>
  )
}

export default page