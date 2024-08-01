import React from "react";
import Image from "next/image";
import {  Button } from "@nextui-org/react";
import { BeamsToday } from "@/types/beamsToday";
import DateComponent from "./DateComponent";
import FavoriteButton from "./FavoriteButton";
import { Chip } from "@nextui-org/react";
import Breadcrumbs from "../Breadcrumbs";
import { MonitorMobbile } from "iconsax-react";

interface TopicOfTheDayProps {
  topic: BeamsToday | null;
  clientDate: string;
}

const isMobile = typeof window !== "undefined" ? window.innerWidth < 767 : false;

const TopicOfTheDay: React.FC<TopicOfTheDayProps> = ({ topic, clientDate }) => {
  return (
    <div className="w-full py-1 text-left relative max-w-6xl mx-auto">
      
      <div className="pl-6 md:pl-12">
    
        <h1 className="text-lg md:text-3xl text-text font-display font-bold mb-[1px]">Topic of the Day</h1>
        <div className="border-b-2 border-brand mb-4 w-full" style={{ maxWidth: '10%' }}></div>
      </div>
      {topic ? (
        <div className="relative w-full lg:w-4/6 mx-auto h-96 md:h-[360px] rounded-lg">
            <div className="absolute top-6 right-6 z-[3]">
      <FavoriteButton  beamsTodayId={topic.id} />
      </div>
      <Chip size="sm" className="mb-2 absolute top-6 left-6 z-[3] bg-white text-black">{topic.category.name}</Chip>
          <Image
            src={topic.thumbnailUrl as string}
            alt={topic.title}
            priority={true}
            fill={true}
            style={{ objectFit: "cover" }}
            className="z-2 aspect-auto md:aspect-video lg:rounded-lg"
          />
          <div className="absolute inset-0 lg:rounded-lg"></div>
          <div className="absolute lg:rounded-lg bottom-0 w-full p-4 px-6 bg-gradient-to-t from-text to-text/30 text-background">
            <h2 className="text-2xl md:text-3xl mb-2 font-semibold">{topic.title}</h2>
            <div className="flex justify-between items-center">
              <div className="flex items-center my-2 justify-between w-full">
                <div className="flex w-full items-center justify-start lg:justify-center flex-1">
                <Button endContent={<MonitorMobbile className="text-white" />} className="font-semibold text-white text-lg p-4 py-6" size={isMobile ? 'sm' : 'lg'} as="a" href={`/beams-today/${topic.id}`} color="primary">
                  Beam Now
                </Button>
                </div>
                <div><DateComponent date={clientDate} /></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-lg font-bold text-gray-1 pl-6 md:pl-12">
          No topic available for today
        </p>
      )}
    </div>
  );
};

export default TopicOfTheDay;
