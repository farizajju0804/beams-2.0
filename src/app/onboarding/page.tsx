'use client'

import React, { useState, useTransition } from 'react'
import { updateOnboardingStatus } from '@/actions/auth/onboarding'
import { Button } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import ProgressDots from './_components/ProgressDots'
import Pagination from './_components/Pagination'

const OnboardingPage = () => {
  const [isPending, startTransition] = useTransition()
  const [currentSlide, setCurrentSlide] = useState(0);

  const { update } = useSession();
  const router = useRouter();
  
  const slides = [
    {
      mainImage: 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1723791783/onboarding/boy_flying_mlb9at.png',
      title: 'Welcome to Beams Today',
      content: 'Your daily dose of the innovation shaping the future.',
    },
    {
      mainImage: 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1723792299/onboarding/formats_ialiwf.png',
      title: 'Learn Your Way',
      content: 'Watch, listen, or read—experience innovation in <b class="text-purple">video, audio,</b> and <b class="text-purple" >text</b> formats, all designed to fit your style.',
    },
    {
      mainImage: 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1723820625/onboarding/discover_p39zka.png',
      title: 'Discover the latest breakthroughs ',
      content: 'Explore cutting-edge innovations across various categories like Technology, Medicine, etc.',
    },  
    {
      mainImage: 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1723798016/onboarding/poll_gbkqsh.png',
      title: 'Voice Your Opinion',
      content: 'Watch, listen, or read—experience innovation in video, audio, and text formats, all designed to fit your style.',
    },
    {
      mainImage: 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1723798017/onboarding/features_qgakm7.png',
      title: 'Make It Yours',
      content: 'Favorite topics, take notes, and never miss a moment. Access past topics anytime.',
    },
    {
      mainImage: 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1723798016/onboarding/ready_tgikcv.png',
      title: 'Ready to Dive In?',
      content: 'Your journey to tomorrow starts here. Explore today’s innovation and stay ahead of the curve.',
    },
  ];

  const totalSlides = slides.length;
  const isEvenSlide = currentSlide % 2 === 0;
  
  const activeColor = isEvenSlide ? '#370075' : '#F9D42E'; // Example: orange for even, purple for odd
  const inactiveColor = isEvenSlide ? '#fefefe' : '#ffffff'; // Example: white for even, light gray for odd
  const isMobile  = window.innerWidth < 767
  const backgroundImage = isEvenSlide 
    ? isMobile 
        ? 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1723837246/onboarding/yellow-bg-mobile_xxtark.png' // Mobile image for even slides
        : 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1723792297/onboarding/yellow-bg-dektop_vvd0c0.png' // Desktop image for even slides
    : isMobile 
        ? 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1723837246/onboarding/purple-bg-mobile_oarvy7.png' // Mobile image for odd slides
        : 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1723792297/onboarding/purple-bg-dektop_yljvfl.png'; // Desktop image for odd slides

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
    console.log('Current Slide:', currentSlide);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
    console.log('Current Slide:', currentSlide);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => Math.min(totalSlides - 1, prev + 1));
    console.log('Current Slide:', currentSlide);
  };

  const handleAction = () => {
    startTransition(async () => {
      const response  = await updateOnboardingStatus(true)
      if (response.success) {
        // await update();
        router.refresh();
        // router.push('/beams-today')
       
      } else {
        console.error('Failed to update user metadata:', response.error)
      }
      
      router.refresh();
      await update();
      router.push('/beams-today')
        
    })
  }

  return (
    <div 
      className="flex flex-col items-center gap-0 justify-between  bg-cover object-cover bg-center lg:bg-bottom transition-all duration-500 ease-in-out pt-4 pb-2"
      style={{ backgroundImage: `url(${backgroundImage})` , height : '100svh'}}
    >
      <div className="w-full flex justify-between items-center px-6 lg:py-2">
      <ProgressDots
          totalDots={totalSlides}
          activeDot={currentSlide}
          activeColor={activeColor}
          inactiveColor={inactiveColor}
          onDotClick={handleDotClick}
        />
        <Button
          onClick={() => handleAction()}
          size='sm'
          className="w-fit text-sm bg-white text-black rounded-full"
          isLoading={isPending}
        >
          Skip
        </Button>
      </div>
      <div className="mb-8 lg:mb-8 h-72 w-72 lg:h-80 md:w-full md:h-[40vh] lg:w-full relative animate-float">
      <Image
        src={slides[currentSlide].mainImage}
        alt="Onboarding illustration"
        layout="fill"
        objectFit="contain"
        className="transition-opacity duration-500 ease-in-out"
        
      />
    </div>
       
       <div className='flex flex-col items-center justify-center min-h-44 md:min-h-60 lg:min-h-44'>
      <div className="flex flex-col items-center justify-start">
        

        <div className="px-6 mt-4 text-center max-w-3xl">
          <h2 className="text-3xl text-purple lg:text-4xl font-bold font-poppins mb-4">{slides[currentSlide].title}</h2>
          <p dangerouslySetInnerHTML={{ __html: slides[currentSlide].content }} className="mb-8 lg:mb-8 text-sm md:text-base lg:text-lg" />
        </div>
      </div>

      <Pagination
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        onPrev={handlePrev}
        onNext={handleNext}
        onComplete={() => handleAction()}
        completeBtnText="Yes I'm Ready"
      />
      </div>
    </div>
  )
}

export default OnboardingPage
