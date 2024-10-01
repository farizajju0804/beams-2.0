'use client';

import { Spinner } from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
// import Lottie from "lottie-react";
// import animationData from '../../public/loader.json';

const loadingMessages = [
  "We’re brewing something awesome! ☕",
  "Almost there, stay curious! 🚀",
  "Loading... Awesomeness inbound! 🌟",
  "Hold on, greatness takes a second! ⏳",
  "Patience, adventure is coming! 🧭"
];



const Loader: React.FC = () => {
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  // Select a random loading message on component mount
  useEffect(() => {
    setLoadingMessage(
      loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
    );
  }, []);

  return (
    <div className="flex flex-col justify-center min-h-[50vh] items-center lg:h-screen">
      {/* Lottie Animation */}
      {/* <Player
        autoplay
        loop
        src={loadingAnimation} // Path to your Lottie JSON file
        style={{ height: '150px', width: '150px' }}
      /> */}
      {/* Random Loading Message */}
      {/* <Lottie animationData={animationData} 
      className="flex justify-center items-center w-40"
      autoPlay loop={true} /> */}
      <Spinner size='lg' className='mx-auto'/>
      <p className="text-base text-center mx-auto mt-4">{loadingMessage}</p>
    </div>
  );
};

export default Loader;
