'use client'
import React, { useState } from 'react'
import ProgressBar from './_components/ProgressBar'
import Slide1 from './_components/Slide1'
import MainSlide from './_components/MainSlide'

const Page = () => {
 const [currentSlide, setCurrentSlide] = useState(0);
 const [formData, setFormData] = useState<{ userType?: string, firstName?: string, lastName?: string }>({});
 const handleNext = (data: { userType?: string; firstName?: string; lastName?: string }) => {
    
    setFormData((prev) => ({
      ...prev,
      ...data, 
    }));
    console.log("Accumulated Form Data:", { ...formData, ...data });
    setCurrentSlide(currentSlide + 1); 
  };
  return (
    <div className='flex flex-col w-full min-h-screen px-4 py-8 items-center justify-center'>
        {currentSlide !== 0 && <ProgressBar totalSlides={6} currentSlide={currentSlide} />}
        {currentSlide === 0 && <MainSlide onNext={handleNext} />}
        {currentSlide === 1 && <Slide1 onNext={handleNext} />}
        {currentSlide === 2 && 
        <div>
            {`Captured data from the form ${formData.userType} ${formData.firstName} ${formData.lastName} `}
        </div>
        
        }
    </div>
  )
}

export default Page