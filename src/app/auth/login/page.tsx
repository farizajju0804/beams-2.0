'use client';

import type { FC } from "react";
import LoginForm from "@/components/auth/login-form";
import { Suspense, useEffect, useState } from 'react';

interface LoginPageProps {}

const LoginPage: FC<LoginPageProps> = ({}) => {
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");

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

  // Function to handle error message from LoginForm
  const handleLoginError = (error: string | undefined) => {
    setErrorMessage(error);
    if (error) {
      document.querySelector(".door")?.classList.add("doorClosed");
    } else {
      document.querySelector(".door")?.classList.remove("doorClosed");
    }
  };

  return (
    <Suspense>
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden">
        <div className="flex items-center justify-center md:justify-center px-4 md:px-12 w-full ">
          <div className="w-full flex items-center justify-center max-w-md md:max-w-lg">
            <LoginForm onError={handleLoginError} />
          </div>
        </div>
        {/* <div className="hidden md:flex md:items-center md:justify-center md:h-full bg-opacity-50 p-4 w-3/5">
          <div className="relative w-3/5 h-4/5 bg-white rounded-md">
            <div className={`bg-[brown] absolute top-0 left-0 w-full h-full cursor-pointer z-10 transition-transform duration-500 origin-left door ${errorMessage ? "doorClosed" : ""}`}></div>
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white text-xl light-ray opacity-0">
              {errorMessage ? (
                <div className="glowing-error">{errorMessage}</div>
              ) : (
                <div className="welcome-message">Welcome Back!</div>
              )}
            </div>
          </div>
        </div> */}
      </div>
    </Suspense>
  );
};

export default LoginPage;
