'use client'

import type { FC } from "react";
import LoginForm from "@/components/auth/login-form";
import { Suspense, useEffect } from 'react';

interface LoginPageProps {}

const LoginPage: FC<LoginPageProps> = ({}) => {

  useEffect(() => {
    const element = document.querySelector(".door");
    if (element) {
      element.addEventListener("click", toggleDoor);

      return () => {
        element.removeEventListener("click", toggleDoor);
      };
    }
  }, []);

  const toggleDoor = () => {
    const element = document.querySelector(".door");
    if (element) {
      element.classList.toggle("doorOpen");
      const lightRay = document.querySelector(".light-ray");
      if (lightRay) {
        lightRay.classList.toggle("opacity-0");
        lightRay.classList.toggle("opacity-100");
      }
    }
  };
  return (
    <Suspense>
      <div className="relative flex h-screen w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 inset-0 w-full h-full object-cover -z-10"
          src="/videos/hero-preview.mp4"
        ></video>
        <div className="flex items-center justify-center md:justify-center px-4 md:px-12 w-full lg:w-[55%]">
          <div className="w-full max-w-md md:max-w-lg">
            <LoginForm />
          </div>
        </div>
        <div className="hidden md:flex md:items-center md:justify-center md:h-full bg-opacity-50 p-4 w-3/5">
          <div className="relative w-3/5 h-4/5 bg-white rounded-md">
            <div className="bg-[brown] absolute top-0 left-0 w-full h-full cursor-pointer z-10 transition-transform duration-500 origin-left door"></div>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default LoginPage;
