import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { currentUser } from '@/libs/auth'; // Imports function to get current user data
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';

// Footer component definition
const PublicFooter: React.FC = async () => {
  const user = await currentUser(); // Fetches the current user status to conditionally render links

  return (
    <>
      <footer className="w-full mb-16 md:mb-0 mx-auto bg-background border-gray-200">
        <div className="w-full max-w-7xl mx-auto pb-4 px-8 lg:px-8">
          
          {/* Wrapper for main footer elements */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0 fade-in">
          </div>

          <div className="pt-4 flex flex-col md:flex-row justify-between items-center fade-in">
            {/* Logo Link (conditionally navigates based on user status) */}
            <div className="my-4 md:my-0">
              <Link prefetch href={user ? DEFAULT_LOGIN_REDIRECT : '/'}>
                <Image
                  src="/images/logo.png" // Image path for the logo
                  alt="Beams Logo"
                  width={85} // Logo dimensions
                  height={30}
                />
              </Link>
            </div>

            {/* Terms and Privacy Links */}
            <div className="flex items-center justify-center lg:ml-40 gap-6">
              <Link href="/terms" className="text-gray-400 text-xs md:text-sm">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-gray-400 text-xs md:text-sm">
                Privacy Policy
              </Link>
            </div>

            {/* Copyright Text */}
            <p className="text-gray-400 text-xs md:text-sm mt-4 md:mt-0">
              © 2024 Beams Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default PublicFooter;
