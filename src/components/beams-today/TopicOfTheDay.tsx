import React from "react";
import Image from "next/image";
import { FaPlay } from "react-icons/fa";
import { BeamsToday } from "@/types/beamsToday";

interface TopicOfTheDayProps {
  topic: BeamsToday | null;
  clientDate: string;
}

const TopicOfTheDay: React.FC<TopicOfTheDayProps> = ({ topic, clientDate }) => {
  return (
    <div className="w-full max-w-5xl mb-8 text-left">
      <h1 className="text-2xl font-bold mb-4">Topic Of The Day</h1>
      {topic ? (
        // <a href={`/beams-today/${clientDate}`} className="block">
        <a href={`/beams-today/${topic.id}`} className="block">

          <div className="flex flex-row items-start justify-center gap-8 border border-gray-200 rounded-lg shadow-lg p-4 transition ease-in-out duration-200 hover:bg-gray-100 cursor-pointer">
            <div className="relative">
              <FaPlay className="absolute top-2 right-2 bg-black text-white" />
              <Image
                src={topic.thumbnailUrl}
                alt={topic.title}
                objectFit="cover"
                width={200}
                height={140}
                className="w-full rounded-lg"
              />
            </div>
            <div className="text-left p-4">
              <h2 className="text-lg font-bold">{topic.title}</h2>
              <p className="text-base">{topic.shortDesc}</p>
            </div>
          </div>
        </a>
      ) : (
        <p className="text-lg font-bold text-gray-500">
          No topic available for today
        </p>
      )}
    </div>
  );
};

export default TopicOfTheDay;
