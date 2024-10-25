import NewPasswordForm from '@/app/auth/_components/new-password-form'; // Import the NewPasswordForm component
import React from 'react'; // Import React library
import LoginSide from '../_components/LoginSide'; // Import the LoginSide component

// Define the NewPasswordPage component
const NewPasswordPage = () => {
  return (
    // Create a grid layout that adjusts based on screen size
    <div className="grid grid-cols-1 lg:grid-cols-2 md:min-h-screen w-full">
      {/* Render the LoginSide component, passing show prop as false */}
      <LoginSide show={false} />
      
      {/* Right side for NewPasswordForm component, centering it on the screen */}
      <div className="w-full md:pt-6 lg:pt-0 lg:min-h-screen flex items-center justify-center">
        {/* Render the NewPasswordForm component */}
        <NewPasswordForm />
      </div>
    </div>
  );
};

// Export the NewPasswordPage component for use in other parts of the application
export default NewPasswordPage;
