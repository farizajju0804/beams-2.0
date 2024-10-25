import React from 'react'; // Import React library
import LoginSide from '../_components/LoginSide'; // Import the LoginSide component
import VerifyEmail from './changeEmailVerify'; // Import the VerifyEmail component

// Define the main page component
const page = () => {
  return (
    // Create a grid layout that adjusts based on screen size
    <div className="grid grid-cols-1 lg:grid-cols-2 md:min-h-screen w-full">
      {/* Render the LoginSide component, passing show prop as false */}
      <LoginSide show={false} />
      
      {/* Right side for VerifyEmail component, centering it on the screen */}
      <div className="w-full md:pt-6 lg:pt-0 lg:min-h-screen flex items-center justify-center">
        {/* Render the VerifyEmail component */}
        <VerifyEmail />
      </div>
    </div>
  );
};

// Export the page component for use in other parts of the application
export default page;
