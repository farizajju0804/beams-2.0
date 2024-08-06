import React from 'react'
import PreviewPlayerCard from './PreviewPlayerCard'
import CourseStartCard from './CourseStartCard'

const PreviewSection = () => {
  return (
    <div className='w-full lg:p-4 lg:mb-4 gap-10 h-auto flex'>
        <PreviewPlayerCard/>
        <CourseStartCard/>
    </div>
  )
}

export default PreviewSection