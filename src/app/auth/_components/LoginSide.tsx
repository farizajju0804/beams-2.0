import Image from 'next/image'; // Import Image component from Next.js for optimized image loading
import Link from 'next/link'; // Import Link component from Next.js for client-side navigation
import React, { FC } from 'react';

interface LoginSideProps {
  show: boolean; // Determines whether to show or hide the large login image
}

/**
 * LoginSide component displays a welcoming side panel with branding and imagery.
 * It includes a logo, a welcome message, and a large character image that can be conditionally shown.
 */
const LoginSide: FC<LoginSideProps> = ({ show }) => {
  return (
    <div className="lg:min-h-screen m-0 p-4 px-6 flex flex-col items-center justify-center gap-8 bg-yellow w-full">
      {/* Logo Section */}
      <div className="flex items-start w-full md:pl-6">
        <Link href="/"> {/* Link to home page */}
          <Image 
            priority 
            src="/images/logo.png" 
            alt="Beams Logo" 
            width={85} 
            height={30} 
          /> {/* Company Logo */}
        </Link>
      </div>

      {/* Welcome Text Section */}
      <div className="flex flex-col items-start gap-3 w-full md:pl-6">
        <h1 className="font-poppins text-2xl md:text-4xl font-semibold text-purple">
          Welcome Back,
        </h1> {/* Main welcome message */}
        <p className="font-medium text-black text-base md:text-xl">
          Your account missed you
        </p> {/* Subtext */}
      </div>

      {/* Character Image Section */}
      <Image
        src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1725345826/authentication/charcater-login-2-dev_wrtei2.webp"
        alt="login"
        width={0} 
        height={0} 
        sizes="60vw" 
        className={`${show ? "block" : "hidden"} md:block w-[300px] h-[400px]`}
      /> {/* Character image that is conditionally rendered based on the `show` prop */}
    </div>
  );
}

export default LoginSide; // Export the component
