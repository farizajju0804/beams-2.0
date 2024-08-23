'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@nextui-org/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRouter } from 'next/navigation';

gsap.registerPlugin(ScrollTrigger);

const PublicFooter: React.FC = () => {
  const router = useRouter();
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footerElement = footerRef.current;

    if (footerElement) {
      gsap.fromTo(
        footerElement.querySelectorAll('.fade-in'),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.2,
          scrollTrigger: {
            trigger: footerElement,
            start: 'top bottom', // when the top of the footer hits the bottom of the viewport
            toggleActions: 'play none none none', // Play animation when it enters, no reverse
          },
        }
      );
    }
  }, []);

  return (
    <>
      <footer
        ref={footerRef}
        className="w-full max-w-6xl mx-auto bg-white border-t border-gray-200"
      >
        <div className="w-full max-w-6xl mx-auto py-8 px-8 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0 fade-in">
            <div className="flex flex-col space-y-4">
              <div>
                <Image
                  src="/images/logo.png"
                  alt="Beams Logo"
                  width={100}
                  height={40}
                />
              </div>
              <p className="text-gray-600">Email: info@beams.world</p>
            </div>

            <div className="flex flex-col items-start md:items-end space-y-4 fade-in">
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
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col-reverse md:flex-row justify-between items-center fade-in">
            <p className="text-gray-500 text-sm mt-4 md:mt-0">
              © 2024 Beams Inc. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                href="/terms"
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
      <div className="w-full h-1 bg-brand"></div>
    </>
  );
};

export default PublicFooter;
  