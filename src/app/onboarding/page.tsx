import React from 'react';
import OnboardingPage from './_components/OnBoarding';  // Import the OnboardingPage component
import { currentUser } from '@/libs/auth';


const page = async () => {
  const user = await currentUser()
  if(!user){
    return
  }
  const userType = user.userType

  return (
    <OnboardingPage userType={userType} />  // Render the OnboardingPage component
  );
}

export default page;  // Export this component as the default export
