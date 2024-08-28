'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@nextui-org/react';

import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';


const PublicFooter: React.FC = () => {
  const router = useRouter();

  return (
    <>
      <footer
       
        className="w-full max-w-7xl mx-auto bg-background border-gray-200"
      >
        <div className="w-full max-w-7xl mx-auto pb-4 px-8 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0 fade-in">
            {/* <div className="flex flex-col space-y-4">
              <div>
              <Link href="/">
                <Image
                  src="/images/logo.png"
                  alt="Beams Logo"
                  width={85}
                  height={30}
                />
                </Link>
              </div>
              <p className="text-gray-600">Email: info@beams.world</p>
            </div> */}

            {/* <div className="flex flex-col items-start md:items-end space-y-4 fade-in">
              <p className="text-gray-800 font-medium">
                Get started with <span className="text-brand">Beams</span> now
              </p>
              <div className="flex space-x-4">
                <Button
                  color="primary"
                  className="font-medium text-base md:text-lg text-white w-28"
                  onClick={() => router.push('/auth/register')}
                >
                  Sign Up
                </Button>
                <Button
                  color="primary"
                  variant="bordered"
                  className="font-medium text-base md:text-lg w-28"
                  onClick={() => router.push('/auth/login')}
                >
                  Login
                </Button>
              </div>
            </div> */}
          </div>

          <div className="pt-4 flex flex-col md:flex-row justify-between items-center fade-in">
          <div className='my-4 md:my-0'>
              <Link href="/">
                <Image
                  src="/images/logo.png"
                  alt="Beams Logo"
                  width={85}
                  height={30}
                />
                </Link>
              </div>
            
            <div className="flex items-center justify-center lg:ml-40 gap-6">
              <Link
                href="/terms"
                className="text-gray-400 text-sm"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-gray-400 text-sm"
              >
                Privacy Policy
              </Link>
            </div>
            <p className="text-gray-400 text-sm mt-4 md:mt-0">
              © 2024 Beams Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      {/* <div className="w-full h-1 bg-brand"></div> */}
    </>
  );
};

export default PublicFooter;
  