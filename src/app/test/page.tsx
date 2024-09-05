'use client'
import React, { useState } from 'react';
import ProgressBar from './_components/ProgressBar';
import Slide1 from './_components/Slide1';
import MainSlide from './_components/MainSlide';
import Slide2 from './_components/Slide2';
import Slide3 from './_components/Slide3';
import Slide5 from './_components/Slide5';
import Slide6 from './_components/Slide6';
import Slide4 from './_components/Slide4';

const Page = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState<{ userType?: string, firstName?: string, lastName?: string , gender?: string, dob?: Date , grade?: string, schoolName?: string }>({});

  const totalSlides = formData.userType === 'STUDENT' ? 6 : 4; // Conditional total slides

  const handleNext = (data: { userType?: string; firstName?: string; lastName?: string }) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
    console.log("Accumulated Form Data:", { ...formData, ...data });
    setCurrentSlide((prevSlide) => prevSlide + 1);
  };

  const handleBack = () => {
    setCurrentSlide((prevSlide) => prevSlide - 1);
  };

  const handleSubmit = () => {
    console.log('Final Submit Data:', formData);
    alert("Form submitted successfully!");
  };

  return (
    <div className='flex flex-col w-full min-h-screen px-4 py-8 items-center justify-center'>
      {currentSlide !== 0 && <ProgressBar totalSlides={totalSlides} currentSlide={currentSlide} />}

      {currentSlide === 0 && <MainSlide onNext={handleNext} />}
      {currentSlide === 1 && <Slide1 onNext={handleNext} formData={formData} />}
      {currentSlide === 2 && <Slide2 onNext={handleNext} handleBack={handleBack} formData={formData} />}
      {currentSlide === 3 && <Slide3 onNext={handleNext} formData={formData} handleBack={handleBack} />}
      
      {/* Slide 4: Final slide for NON_STUDENT */}
      {currentSlide === 4 && formData.userType === 'STUDENT' && (
        <Slide4 onNext={handleNext} formData={formData} handleBack={handleBack} />
      )}

      {/* Slide 4: Final submit for NON_STUDENT */}
      {currentSlide === 4 && formData.userType === 'NON_STUDENT' && (
        <Slide4
          onNext={handleSubmit} 
          formData={formData}
          handleBack={handleBack}
        />
      )}

      
      {currentSlide === 5 && formData.userType === 'STUDENT' && <Slide5 onNext={handleNext} formData={formData} handleBack={handleBack} />}
      {currentSlide === 6 && formData.userType === 'STUDENT' && <Slide6 onNext={handleSubmit} formData={formData} handleBack={handleBack} />}
    </div>
  );
};

export default Page;
