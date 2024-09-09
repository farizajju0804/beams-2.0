'use client'
import Lottie from 'lottie-react';
import React, { useEffect, useState } from 'react'
import animationData from '../../public/loader.json';

const loadingMessages = [
  "Hang tight, we’re brewing something awesome! ☕",
  "Almost there, stay curious! 🚀",
  "Hold On... Awesomeness inbound! 🌟",
  "Hold on, greatness takes a second! ⏳",
  "Patience, adventure is coming! 🧭"
];

const RedirectionMessage = () => {
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  // Select a random loading message on component mount
  useEffect(() => {
    setLoadingMessage(
      loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
    );
  }, []);
  return (
   
        <div className="fixed inset-0 bg-background  flex items-center justify-center z-50">
          <div className="bg-background p-6 flex items-center flex-col justify-center rounded-md shadow-lg text-center">
            <p className="text-lg font-poppins text-green-500 font-semibold">Submission Successful!</p>
            <Lottie animationData={animationData} 
      className="flex justify-center items-center w-40"
      autoPlay loop={true} />
            <p className='text-text mt-4'>{loadingMessage}</p>
          </div>
        </div>
      
  )
}

export default RedirectionMessage