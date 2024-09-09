import ResetForm from '@/app/auth/_components/reset-form'; // Import the ResetForm component
import React from 'react'; // Import React
import LoginSide from '../_components/LoginSide'; // Import the LoginSide component

/**
 * ResetPage component renders the password reset page. It contains
 * a two-column layout with a side component for visuals and the reset form.
 */
const ResetPage = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 md:min-h-screen w-full">
      {/* Left-side visual component, with `show={false}` to potentially hide certain content */}
      <LoginSide show={false} />

      {/* Main content area where the reset form is rendered */}
      <div className="w-full md:pt-6 lg:pt-0 lg:min-h-screen flex items-center justify-center">
        <ResetForm /> {/* Reset form component for handling password resets */}
      </div>
    </div>
  );
};

export default ResetPage; // Export the ResetPage component as the default export
