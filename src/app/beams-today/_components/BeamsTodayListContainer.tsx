'use client'
import React, { useRef, useState, useEffect } from "react";
import { getRecentUploads } from "@/actions/beams-today/getRecentUploads";
import BeamsTodayCard from "./BeamsTodayCard";
import { BeamsToday } from "@/types/beamsToday";
import { Spinner, Button } from "@nextui-org/react";
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react';

interface BeamsTodayListContainerProps {
  completedTopics: string[];
  categories: any;
  user: any;
}

const BeamsTodayListContainer: React.FC<BeamsTodayListContainerProps> = ({
  completedTopics,
  user,
  categories
}) => {
  const [allUploads, setAllUploads] = useState<BeamsToday[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [clickedArrow, setClickedArrow] = useState<string | null>(null); // Track the last clicked arrow
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchRecentUploads = async () => {
      const clientDate = new Date().toLocaleDateString("en-CA");
      const uploads: any = await getRecentUploads(clientDate);
      setAllUploads(uploads.slice(0, 5)); // Limit to 5 items
      setIsLoading(false);
    };
    fetchRecentUploads();
  }, []);

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [allUploads.length]);

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % allUploads.length);
    }, 5000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const scrollLeft = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + allUploads.length) % allUploads.length);
    setClickedArrow('left');
    startTimer();
  };

  const scrollRight = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % allUploads.length);
    setClickedArrow('right');
    startTimer();
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    startTimer();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl pb-8 lg:mt-4 px-6 lg:px-0">
      <div className="flex justify-between items-center">
        <div className="w-full flex flex-col items-start lg:items-center">
          <h1 className="text-lg md:text-2xl text-text font-display font-bold mb-[1px]">Now Trending</h1>
          <div className="border-b-2 border-brand mb-6 w-full" style={{ maxWidth: '13%' }}></div>
        </div>
      </div>
      
      <div className="relative mt-2 flex justify-center items-center">
        <Button
          size="sm"
          isIconOnly
          onClick={scrollLeft}
          className={`z-20 rounded-full p-2 mr-6 md:mr-8 ${clickedArrow === 'left' ? 'bg-brand text-white' : 'bg-grey text-grey-2'}`}
        >
          <ArrowLeft2 className="w-full h-full" />
        </Button>
        
        <div className="w-48 md:w-64 flex justify-center items-center mx-4">
          {allUploads?.length > 0 && (
            <BeamsTodayCard key={allUploads[currentIndex]?.id} topic={allUploads[currentIndex]} />
          )}
        </div>
        
        <Button
          size="sm"
          isIconOnly
          onClick={scrollRight}
          className={`z-20 rounded-full p-2 ml-6 md:ml-8 ${clickedArrow === 'right' ? 'bg-brand text-white' : 'bg-grey text-grey-2'}`}
        >
          <ArrowRight2 className="w-full h-full" />
        </Button>
      </div>
      
      <div className="flex justify-center mt-4">
        {allUploads.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full mx-1 cursor-pointer ${index === currentIndex ? 'bg-[#f96f2e]' : 'bg-grey-2'}`}
            onClick={() => handleDotClick(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default BeamsTodayListContainer;
