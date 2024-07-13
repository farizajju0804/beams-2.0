import React from "react";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import { BeamsToday } from "@/types/beamsToday";
import DateComponent from "./DateComponent";
import FavoriteButton from "./FavoriteButton";
import { Chip } from "@nextui-org/react";

interface TopicOfTheDayProps {
  topic: BeamsToday | null;
  clientDate: string;
}

const isMobile = typeof window !== "undefined" ? window.innerWidth < 767 : false;

const TopicOfTheDay: React.FC<TopicOfTheDayProps> = ({ topic, clientDate }) => {
  return (
    <div className="w-full pt-2 pb-4 text-left relative max-w-6xl mx-auto">
      
      <div className="pl-6 md:pl-12">
        <h1 className="text-xl md:text-3xl font-display font-bold mb-1">Topic of the Day</h1>
        <div className="border-b-2 border-brand-950 mb-6 w-full" style={{ maxWidth: '10%' }}></div>
      </div>
      {topic ? (
        <div className="relative w-full h-96 md:h-[500px]">
            <div className="absolute top-6 right-6 z-[3]">
      <FavoriteButton  beamsTodayId={topic.id} />
      </div>
      <Chip size="sm" className="mb-2 absolute top-6 left-6 z-[3] bg-gray-200 text-black">{topic.category.name}</Chip>
          <Image
            src={topic.thumbnailUrl as string}
            alt={topic.title}
            priority={true}
            fill={true}
            style={{ objectFit: "cover" }}
            className="z-2 aspect-auto md:aspect-video rounded-none"
          />
          <div className="absolute inset-0 rounded-none"></div>
          <div className="absolute bottom-0 w-full p-4 px-6 md:px-12 bg-gradient-to-t from-black to-black/30 text-white">
            <h2 className="text-2xl md:text-4xl mb-2 font-bold">{topic.title}</h2>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-6 mt-2 justify-between w-full">
                <Button className="font-semibold text-lg" size={isMobile ? 'sm' : 'lg'} as="a" href={`/beams-today/${topic.id}`} color="primary">
                  Beam Now
                </Button>
              <DateComponent date={clientDate} />
                
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-lg font-bold text-gray-500 pl-6 md:pl-12">
          No topic available for today
        </p>
      )}
    </div>
  );
};

export default TopicOfTheDay;
