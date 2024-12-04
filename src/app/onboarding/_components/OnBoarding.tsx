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
import { UserType } from "@prisma/client";

const OnboardingPage = ({userType}: { userType : UserType}) => {
  const [isPending, startTransition] = useTransition()
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { data: session, update } = useSession();
  const router = useRouter();
  
  const studentSlides = [
    {
      mainImage: 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1723791783/onboarding/boy_flying_mlb9at.png',
      title: 'Welcome to Beams',
      content: 'Explore <b class="text-secondary-2">innovation</b> like never before with Beams. From daily insights to interactive games, we’ve got it all.',
    },
    {
      mainImage: 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1723792299/onboarding/formats_ialiwf.png',
      title: 'Beams Today: Your Daily Dose',
      content: 'Discover tech revolutions in less than <b class="text-secondary-2">2 minutes.</b> Learn through <b class="text-secondary-2">video, audio,</b> and <b class="text-secondary-2">text</b> formats, and join the daily poll to share your views.',
    },
    {
      mainImage: 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1723820625/onboarding/discover_p39zka.png',
      title: 'Beams Facts: Knowledge in Seconds',
      content: 'Uncover fascinating facts and quick insights in less than <b class="text-secondary-2">10 seconds.</b> Learning has never been this effortless!',
    },
    {
      mainImage: 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1733312998/onboarding/game-onboarding-675041b637d7c_mxi7xp.webp',
      title: 'Beams Connect: Play & Learn',
      content: 'Challenge yourself with <b class="text-secondary-2">image-based games.</b> Connect the dots and test your knowledge of new technologies daily.',
    },
    {
      mainImage: 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1733313016/onboarding/award-onboarding-675041b5f37aa_pka4qe.webp',
      title: 'Gamify Your Experience',
      content: 'Earn <b class="text-secondary-2">badges</b>, climb <b class="text-secondary-2">leaderboards</b>, and <b class="text-secondary-2">level up</b> as you explore, learn, and play. Make every moment count!',
    },
    {
      mainImage: 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1723798016/onboarding/ready_tgikcv.png',
      title: 'Your Journey Starts Here',
      content: 'Explore <b class="text-secondary-2">Beams Today, Beams Facts, and Beams Connect.</b> Start your journey of discovery and innovation now!',
    },
  ];
  
  const nonStudentSlides =[
    {
      mainImage: 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1733320924/onboarding/innovation-675060cdbf24c_wnzfkn.webp',
      title: 'Welcome to Beams',
      content: 'Explore <b class="text-secondary-2">innovation</b> like never before with Beams. From daily insights to interactive games, we’ve got it all.',
    },
    {
      mainImage: 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1733321267/onboarding/slide-2-non-student-67506225036ce_chf8yt.webp',
      title: 'Beams Today: Your Daily Dose',
      content: 'Discover tech revolutions in less than <b class="text-secondary-2">2 minutes.</b> Learn through <b class="text-secondary-2">video, audio,</b> and <b class="text-secondary-2">text</b> formats, and join the daily poll to share your views.',
    },
    {
      mainImage: 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1733321465/onboarding/facts-non-student-675062d6c5df2_jpo4jz.webp',
      title: 'Beams Facts: Knowledge in Seconds',
      content: 'Uncover fascinating facts and quick insights in less than <b class="text-secondary-2">10 seconds.</b> Learning has never been this effortless!',
    },
    {
      mainImage: 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1733322212/onboarding/connect-non-student-6750645bf29dc_fgimap.webp',
      title: 'Beams Connect: Play & Learn',
      content: 'Challenge yourself with <b class="text-secondary-2">image-based games.</b> Connect the dots and test your knowledge of new technologies daily.',
    },
    {
      mainImage: 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1733322621/onboarding/gamify-non-student-675067651e98a_kbcn4a.webp',
      title: 'Gamify Your Experience',
      content: 'Earn <b class="text-secondary-2">badges</b>, climb <b class="text-secondary-2">leaderboards</b>, and <b class="text-secondary-2">level up</b> as you explore, learn, and play. Make every moment count!',
    },
    {
      mainImage: 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1733322621/onboarding/last-non-student-6750676518348_xlarr0.webp',
      title: 'Your Journey Starts Here',
      content: 'Explore <b class="text-secondary-2">Beams Today, Beams Facts, and Beams Connect.</b> Start your journey of discovery and innovation now!',
    },
  ];

 
  const isStudent = userType === 'STUDENT';
  const slides = isStudent ? studentSlides : nonStudentSlides;
  const totalSlides = slides.length;
  const [isMobile, setIsMobile] = useState(false);
  const activeColor =  '#F9642e'; 
  const inactiveColor = '#d1d1d1'; 
  
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
    <div className={`flex relative flex-col items-center justify-center gap-12  bg-cover object-cover bg-center lg:bg-bottom transition-all duration-500 ease-in-out pt-4 pb-2`}
    style={{  height: '100svh' }}
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
              className="w-fit text-sm bg-default-100 text-default-600 rounded-full"
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
              width={2000}
              height={2000}
              // objectFit="contain"
              className={`object-cover mb-0 h-auto w-72 px-6  md:w-80 mx-auto`}
            />
          </motion.div>

          <div className='flex flex-col items-center justify-center min-h-44 md:min-h-60 lg:min-h-44'>
            <div className="flex flex-col items-center justify-start">
              <div className="px-6 mt-4 text-center max-w-3xl">
                <h2 
                className={`text-3xl lg:text-4xl font-bold font-poppins mb-4 
                   'text-text'
                `}
                >
                  {slides[currentSlide].title}
                </h2>
                <p 
                  dangerouslySetInnerHTML={{ __html: slides[currentSlide].content }} 
                  className='text-text mb-8 lg:mb-8  text-sm md:text-base lg:text-lg'
                />
              </div>
            </div>

            <Pagination
              currentSlide={currentSlide}
              totalSlides={totalSlides}
              onPrev={handlePrev}
              onNext={handleNext}
              onComplete={handleCompletion}
              completeBtnText="Let's Begin"
              isPending={isPending}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default OnboardingPage;