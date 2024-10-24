import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { currentUser } from '@/libs/auth';



const PublicFooter: React.FC = async() => {

  const user =  await currentUser()
  return (
    <>
      <footer
        className=" w-full mb-16 md:mb-0  mx-auto bg-background border-gray-200"
      >
        <div className="w-full max-w-7xl mx-auto pb-4 px-8 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0 fade-in">
        
          </div>

          <div className="pt-4 flex flex-col md:flex-row justify-between items-center fade-in">
          <div className='my-4 md:my-0'>
              <Link prefetch href={ user ? '/beams-today' : '/'}>
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
                className="text-gray-400 text-xs md:text-sm"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-gray-400 text-xs md:text-sm"
              >
                Privacy Policy
              </Link>
            </div>
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
  