'use client'
import confetti from "canvas-confetti";
import React, { useEffect, useState, useTransition } from 'react'
import { updateOnboardingStatus } from '@/actions/auth/onboarding'
import { Button } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import ProgressDots from './ProgressDots'
import Pagination from './Pagination'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { motion } from 'framer-motion';
import RedirectMessage from "@/components/Redirection";
import toast, { Toaster } from "react-hot-toast";

const OnboardingPage = () => {
  const [isPending, startTransition] = useTransition()
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);
  // const [isModalOpen, setIsModalOpen] = useState(true);
  const { data: session, update } = useSession();
  const router = useRouter();
  
  const slides = [
    {
      mainImage: 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1723791783/onboarding/boy_flying_mlb9at.png',
      title: 'Welcome to Beams',
      content: 'Explore innovation like never before with Beams. From daily insights to interactive games, we’ve got it all.',
    },
    {
      mainImage: 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1723792299/onboarding/formats_ialiwf.png',
      title: 'Beams Today: Your Daily Dose',
      content: 'Discover tech revolutions in less than 2 minutes. Learn through <b class="text-purple">video, audio,</b> and <b class="text-purple">text</b> formats, and join the daily poll to share your views.',
    },
    {
      mainImage: 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1723820625/onboarding/discover_p39zka.png',
      title: 'Beams Facts: Knowledge in Seconds',
      content: 'Uncover fascinating facts and quick insights in less than 10 seconds. Learning has never been this effortless!',
    },
    {
      mainImage: 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1723798016/onboarding/poll_gbkqsh.png',
      title: 'Beams Connect: Play & Learn',
      content: 'Challenge yourself with image-based games. Connect the dots and test your knowledge of new technologies daily.',
    },
    {
      mainImage: 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1723798017/onboarding/features_qgakm7.png',
      title: 'Gamify Your Experience',
      content: 'Earn badges, climb leaderboards, and level up as you explore, learn, and play. Make every moment count!',
    },
    {
      mainImage: 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1723798016/onboarding/ready_tgikcv.png',
      title: 'Your Journey Starts Here',
      content: "Explore Beams Today, Beams Facts, and Beams Connect. Start your journey of discovery and innovation now!",
    },
  ];
  

  const totalSlides = slides.length;
  const isEvenSlide = currentSlide % 2 === 0;
  const [isMobile, setIsMobile] = useState(false);
  const activeColor = isEvenSlide ? '#370075' : '#F9D42E'; 
  const inactiveColor = isEvenSlide ? '#fefefe' : '#ffffff'; 

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 767);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const triggerConfetti = () => {
    const end = Date.now() + 2 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];
 
    const frame = () => {
      if (Date.now() > end) return;
 
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });
 
      requestAnimationFrame(frame);
    };
 
    frame();
  };

  const backgroundImage = isEvenSlide 
    ? isMobile 
        ? 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1723837246/onboarding/yellow-bg-mobile_xxtark.png'
        : 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1723792297/onboarding/yellow-bg-dektop_vvd0c0.png' 
    : isMobile 
        ? 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1723837246/onboarding/purple-bg-mobile_oarvy7.png'
        : 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1723792297/onboarding/purple-bg-dektop_yljvfl.png';

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => Math.min(totalSlides - 1, prev + 1));
  };

  const handleCompletion = () => {
    startTransition(async () => {
      try {
        const updatedUser: any = await updateOnboardingStatus(true);
        
        if (updatedUser) {
          // Trigger confetti
          triggerConfetti();
          
          if(updatedUser.referredById){
            localStorage.removeItem('referral');
          }

          // Update session and redirect after a delay
          setTimeout(async () => {
            await update({
              ...session,
              user: {
                ...session?.user,
                onBoardingCompleted: true,
              },
            });
            setIsRedirecting(true);
            router.push(DEFAULT_LOGIN_REDIRECT);
          }, 3000);
        }
      } catch (error) {
        // Display a toast error message on network error
        toast.error("Network or server error. Please Check your internet or try again later");
        console.error("Error completing onboarding:", error);
      }
    });
  };

  return (
    <div className="flex relative flex-col items-center gap-0 justify-around bg-cover object-cover bg-center lg:bg-bottom transition-all duration-500 ease-in-out pt-4 pb-2"
    style={{ backgroundImage: `url(${backgroundImage})` , height : '100svh'}}
    >
      <Toaster position="top-center"/>
      {isRedirecting ? (
        <RedirectMessage username={session?.user.firstName}/>
      ) : (
        <>
          <div className="absolute top-4 left-0 right-0 w-full flex justify-between items-center px-6 lg:py-2">
            <ProgressDots
              totalDots={totalSlides}
              activeDot={currentSlide}
              activeColor={activeColor}
              inactiveColor={inactiveColor}
              onDotClick={handleDotClick}
            />
            <Button
              onClick={handleCompletion}
              size='sm'
              aria-label="skip"
              className="w-fit text-sm bg-white text-black rounded-full"
              isLoading={isPending}
            >
              Skip
            </Button>
          </div>

          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-full">
            <Image
              src={slides[currentSlide].mainImage}
              alt="Onboarding illustration"
              // layout="fill"
              priority
              width={300}
              height={300}
              // objectFit="contain"
              className="object-cover mb-8 h-72 w-72 md:h-80 md:w-80 mx-auto"
            />
          </motion.div>

          <div className='flex flex-col items-center justify-center min-h-44 md:min-h-60 lg:min-h-44'>
            <div className="flex flex-col items-center justify-start">
              <div className="px-6 mt-4 text-center max-w-3xl">
                <h2 className="text-3xl text-purple lg:text-4xl font-bold font-poppins mb-4">
                  {slides[currentSlide].title}
                </h2>
                <p 
                  dangerouslySetInnerHTML={{ __html: slides[currentSlide].content }} 
                  className="mb-8 lg:mb-8 text-black text-sm md:text-base lg:text-lg"
                />
              </div>
            </div>

            <Pagination
              currentSlide={currentSlide}
              totalSlides={totalSlides}
              onPrev={handlePrev}
              onNext={handleNext}
              onComplete={handleCompletion}
              completeBtnText="Yes I'm Ready"
              isPending={isPending}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default OnboardingPage;