import ForgotEmailForm from '@/app/auth/_components/forgot-email-form'; // Importing the forgot email form component
import React from 'react'; // Importing React (though not necessary in newer Next.js versions)
import LoginSide from '../_components/LoginSide'; // Importing the side component for the login page UI

/**
 * A page component that renders the Forgot Email form alongside a side UI component.
 */
const page = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 md:min-h-screen w-full">
      {/* Render the LoginSide component on the left side, with 'show' prop set to false */}
      <LoginSide show={false} />
      
      {/* Main content area where the ForgotEmailForm is rendered */}
      <div className="w-full md:pt-6 lg:pt-0 lg:min-h-screen flex items-center justify-center">
        <ForgotEmailForm />
      </div>
    </div>
  );
};

export default page; // Exporting the page as the default export
