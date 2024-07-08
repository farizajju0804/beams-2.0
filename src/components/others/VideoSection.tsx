import React from 'react';
import { SparklesCore } from "@/ui/Sparkles";
import { Spotlight } from '@/ui/Spotlight';

const FullScreenVideoBackground: React.FC = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
        
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/videos/hero-preview.mp4"
        autoPlay
        loop
        muted
      />
      <div className="h-[40rem] w-full bg-black flex flex-col items-center justify-center overflow-hidden ">
      <h1 className="text-7xl lg:text-9xl font-display font-bold text-center text-white relative z-20">
        Beams
      </h1>
    
    </div>
    </div>
  );
};

export default FullScreenVideoBackground;
