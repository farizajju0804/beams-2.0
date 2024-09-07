'use client';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ProgressBar from './_components/ProgressBar';
import Slide1 from './_components/Slide1';
import MainSlide from './_components/MainSlide';
import Slide2 from './_components/Slide2';
import Slide3 from './_components/Slide3';
import Slide5 from './_components/Slide5';
import Slide6 from './_components/Slide6';
import Slide4 from './_components/Slide4';
import { updateUserMetadata } from '@/actions/auth/register';
import RedirectionMessage from '@/components/RedirectionMessage';
import Image from 'next/image';
import { Button } from '@nextui-org/react'; // Import Button from NextUI

const Page = () => {
  const { data: session, update } = useSession();  
  const router = useRouter(); 
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false); // For showing redirection message
  const [isModalOpen, setIsModalOpen] = useState(true); // Modal state
  const [formData, setFormData] = useState<{
    userType?: "STUDENT" | "NON_STUDENT";
    firstName?: string;
    lastName?: string;
    gender?: string;
    dob?: Date;
    grade?: string;
    schoolName?: string;
    topics?: string[];
  }>({
    firstName: session?.user.firstName,
    lastName: session?.user.lastName
  });

  const totalSlides = formData.userType === 'STUDENT' ? 6 : 3; // Conditional total slides
  const handleNext = (data: any) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
    setCurrentSlide((prevSlide) => prevSlide + 1);
  };

  const handleBack = () => {
    setCurrentSlide((prevSlide) => prevSlide - 1);
  };

  const handleNextAndSubmit = async (data: any) => {
    setIsLoading(true); // Start loading
    try {
      setFormData((prev) => ({
        ...prev,
        ...data,
      }));
      await handleSubmit(data);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (!session?.user?.email) {
        throw new Error('Email not found in session.');
      }
  
      const values = {
        firstName: formData.firstName || data.firstName,
        lastName: formData.lastName || data.lastName,
        gender: formData.gender || data.gender, 
        ...(formData.userType === 'STUDENT' && {
          grade: formData.grade || data.grade,
          schoolName: formData.schoolName || data.schoolName,
        }),
        dob: formData.dob || data.dob,
        userType: formData.userType,
        interests: formData.topics || data.topics || [],
        userFormCompleted: true,
      };
  
      const updatedUser = await updateUserMetadata(session.user.email, values);
      if (updatedUser) {
        await update({
          ...session,
          user: {
            ...session?.user,
            userFormCompleted: true,
          },
        });
        setIsRedirecting(true);
        router.push('/onboarding');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert("There was an error submitting the form.");
    }
  };

  return (
    <div className='flex flex-col w-full min-h-screen px-4 py-8 items-center justify-center'>
      {currentSlide !== 0 && <ProgressBar totalSlides={totalSlides} currentSlide={currentSlide} />}

      {/* Custom Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex z-[100] items-center justify-center  bg-black bg-opacity-50">
          <div className="bg-white rounded-3xl p-6 max-w-md mx-auto shadow-md text-center relative">
            <Image
              src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1725629881/authentication/welcome_jdqwjj.webp"
              alt="Welcome image"
              width={150}
              height={150}
              className="mx-auto mb-4"
            />
            <h2 className="font-bold text-black font-poppins text-2xl mb-4">Welcome To Beams 🎉</h2>
            <p className="text-black font-medium mb-4">
              You&apos;re in, explorer! But first, let&apos;s fuel your curiosity. Answer some questions, shall we?
            </p>
            <Button className='font-semibold text-lg text-white' color="primary" onClick={() => setIsModalOpen(false)}>
              Start
            </Button>
          </div>
        </div>
      )}

      {/* Render RedirectionMessage while redirecting */}
      {isRedirecting ? (
        <RedirectionMessage />  // Display a message while redirecting
      ) : (
        <>
          {currentSlide === 0 && <MainSlide onNext={handleNext} />}
          {currentSlide === 1 && <Slide1 onNext={handleNext} formData={formData} />}
          {currentSlide === 2 && <Slide2 onNext={handleNext} handleBack={handleBack} formData={formData} />}
          {/* {currentSlide === 3 && <Slide3 onNext={handleNext} formData={formData} handleBack={handleBack} />} */}

          {currentSlide === 3 && formData.userType === 'STUDENT' && (
            <Slide3 onNext={handleNext} formData={formData} handleBack={handleBack} />
          )}
          {currentSlide === 4 && formData.userType === 'STUDENT' && (
            <Slide4 onNext={handleNext} formData={formData} handleBack={handleBack} />
          )}

          {/* Slide 4: Final submit for NON_STUDENT */}
          {currentSlide === 3 && formData.userType === 'NON_STUDENT' && (
            <Slide4
              onNext={handleNextAndSubmit} 
              formData={formData}
              handleBack={handleBack}
              isLoading={isLoading}
            />
          )}

          {currentSlide === 5 && formData.userType === 'STUDENT' && <Slide5 onNext={handleNext} formData={formData} handleBack={handleBack} />}
          {currentSlide === 6 && formData.userType === 'STUDENT' && <Slide6 onNext={handleNextAndSubmit}  isLoading={isLoading} formData={formData} handleBack={handleBack} />}
        </>
      )}
    </div>
  );
};

export default Page;
