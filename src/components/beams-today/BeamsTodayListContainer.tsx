'use client'
import React, { useRef, useState, useEffect } from "react";
import { getRecentUploads } from "@/actions/beams-today/getRecentUploads";
import BeamsTodayCard from "@/components/beams-today/BeamsTodayCard";
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
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchRecentUploads = async () => {
      const clientDate = new Date().toLocaleDateString("en-CA");
      const uploads: any = await getRecentUploads(clientDate);
      setAllUploads(uploads);
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
    startTimer();
  };

  const scrollRight = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % allUploads.length);
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
    <div className="w-full max-w-6xl pb-8 lg:mt-4 px-6 md:px-12">
      <div className="flex justify-between items-center">
        <div className="w-full">
          <h1 className="text-lg md:text-3xl font-display font-bold mb-[1px]">Trending Topics</h1>
          <div className="border-b-2 border-brand-950 mb-6 w-full" style={{ maxWidth: '13%' }}></div>
        </div>
      </div>
      
      <div className="relative mt-4 flex justify-center items-center">
        <Button size="sm" isIconOnly onClick={scrollLeft} className="bg-gray-100 rounded-full p-2 mr-4">
          <ArrowLeft2 size={16} />
        </Button>
        
        <div className="w-64 flex justify-center items-center mx-4">
          {allUploads.length > 0 && (
            <BeamsTodayCard key={allUploads[currentIndex].id} topic={allUploads[currentIndex]} />
          )}
        </div>
        
        <Button size="sm" isIconOnly onClick={scrollRight} className="bg-gray-100 rounded-full p-2 ml-4">
          <ArrowRight2 size={16} />
        </Button>
      </div>
      
      <div className="flex justify-center mt-4">
        {allUploads.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full mx-1 cursor-pointer ${index === currentIndex ? 'bg-[#f96f2e]' : 'bg-gray-300'}`}
            onClick={() => handleDotClick(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default BeamsTodayListContainer;
