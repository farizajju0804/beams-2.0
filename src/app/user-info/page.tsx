'use client';
import React, { useEffect, useState } from 'react';
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

const Page = () => {
  const { data: session, update } = useSession();  
  const router = useRouter(); 
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false); // For showing redirection message
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

  const totalSlides = formData.userType === 'STUDENT' ? 6 : 4; // Conditional total slides

  const handleNext = (data: any) => {
    console.log("Data from current slide:", data);
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
    setCurrentSlide((prevSlide) => prevSlide + 1);
  };

  const handleBack = () => {
    setCurrentSlide((prevSlide) => prevSlide - 1);
  };

  const handleNextAndSubmit = (data: any) => {
    console.log("Data from final slide (before submission):", data);
  
    // Update formData with the latest data from the final slide
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  
    // After formData is updated, call handleSubmit explicitly for final submission
    handleSubmit(data); // Pass the final data explicitly to ensure topics are included
  };
  
  // handleSubmit function to be called when on the last slide
  const handleSubmit = async (data: any) => {
    try {
      if (!session?.user?.email) {
        throw new Error('Email not found in session.');
      }
  
      const values = {
        firstName: formData.firstName || data.firstName, // Ensure the latest data is used
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
  
      console.log("Form data before submission:", values);
  
      // Call API to update user metadata
      const updatedUser = await updateUserMetadata(session.user.email, values);
      if (updatedUser) {
        // Update session after successfully updating user metadata
        await update({
          ...session,
          user: {
            ...session?.user,
            userFormCompleted: true,
          },
        });
  
        // Set redirection flag to true before redirecting
        setIsRedirecting(true);
  
        // Redirect to /onboarding after successful form submission
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

      {/* Render RedirectionMessage while redirecting */}
      {isRedirecting ? (
        <RedirectionMessage />  // Display a message while redirecting
      ) : (
        <>
          {currentSlide === 0 && <MainSlide onNext={handleNext} />}
          {currentSlide === 1 && <Slide1 onNext={handleNext} formData={formData} />}
          {currentSlide === 2 && <Slide2 onNext={handleNext} handleBack={handleBack} formData={formData} />}
          {currentSlide === 3 && <Slide3 onNext={handleNext} formData={formData} handleBack={handleBack} />}

          {/* Slide 4: Final slide for STUDENT */}
          {currentSlide === 4 && formData.userType === 'STUDENT' && (
            <Slide4 onNext={handleNext} formData={formData} handleBack={handleBack} />
          )}

          {/* Slide 4: Final submit for NON_STUDENT */}
          {currentSlide === 4 && formData.userType === 'NON_STUDENT' && (
            <Slide4
              onNext={handleNextAndSubmit} 
              formData={formData}
              handleBack={handleBack}
            />
          )}

          {currentSlide === 5 && formData.userType === 'STUDENT' && <Slide5 onNext={handleNext} formData={formData} handleBack={handleBack} />}
          {currentSlide === 6 && formData.userType === 'STUDENT' && <Slide6 onNext={handleNextAndSubmit} formData={formData} handleBack={handleBack} />}
        </>
      )}
    </div>
  );
};

export default Page;
