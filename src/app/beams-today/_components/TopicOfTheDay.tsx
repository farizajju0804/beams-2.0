import React from "react";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import { BeamsToday } from "@/types/beamsToday";
import DateComponent from "./DateComponent";
import FavoriteButton from "./FavoriteButton";
import { Chip } from "@nextui-org/react";
import { Microscope } from "iconsax-react";
import Link from "next/link";

interface TopicOfTheDayProps {
  topic: BeamsToday | null;  // The topic of the day or null if not available
  clientDate: string;        // The current date on the client side
}

/**
 * Component to display the "Topic of the Day" section, with the topic's image, title, and a "Beam Now" button.
 * If no topic is available, a message is displayed instead.
 */
const TopicOfTheDay: React.FC<TopicOfTheDayProps> = ({ topic, clientDate }) => {
  return (
    <div className="w-full py-1 mb-4 text-left relative max-w-6xl mx-auto">
      
      {/* Heading */}
      <div className="pl-6 lg:pl-0 flex flex-col items-start lg:items-center">
        <h1 className="text-lg md:text-2xl text-text font-poppins font-semibold mb-[1px]">Topic of the Day</h1>
        <div className="border-b-2 border-brand mb-6 w-full" style={{ maxWidth: '10%' }}></div>
      </div>

      {/* Main Content */}
      {topic ? (
        <div className="relative w-full lg:w-4/6 mx-auto h-96 md:h-[360px] rounded-lg">
          {/* Favorite Button */}
          <div className="absolute top-4 right-4 z-[3]">
            <FavoriteButton beamsTodayId={topic.id} />
          </div>

          {/* Category Chip */}
          <Chip  size="sm" className="mb-2 absolute top-4 left-4 z-[3] bg-white text-black">
            {topic.category.name}
          </Chip>

          {/* Topic Image */}
          <Image
            src={topic.thumbnailUrl as string}
            alt={topic.title}
            priority={true}
            fill={true}
            style={{ objectFit: "cover" }}
            className="z-2 aspect-auto md:aspect-video lg:rounded-lg"
          />

          {/* Content Overlay */}
          <div className="absolute inset-0 lg:rounded-lg"></div>

          {/* Topic Title and Beam Now Button */}
          <div className="absolute lg:rounded-lg bottom-0 w-full p-2 px-4 bg-gradient-to-t from-text to-text/30 text-background">
            <h2 className="text-2xl md:text-3xl mb-2 font-semibold">{topic.title}</h2>
            <div className="flex justify-between items-center">
              <div className="flex items-center my-2 justify-between w-full">
                <div className="flex w-full items-center justify-start lg:justify-center flex-1">
                  {/* Beam Now Button */}
                  <Link href={`/beams-today/${topic.id}`} prefetch>
                  <Button
                    endContent={<Microscope variant="Bold" className="text-white" />}
                    className="font-semibold text-white text-base md:text-lg p-4 lg:px-8 py-6"
                    size="md"
                    color="primary"
                  >
                    Beam Now
                  </Button>
                  </Link>
                </div>

                {/* Date Component */}
                <div>
                  <DateComponent date={topic.date.toISOString().split('T')[0]} />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Message displayed if no topic is available
        <p className="text-lg text-left md:text-center font-semibold text-grey-500 pl-6 md:pl-0">
          No topic available for today
        </p>
      )}
    </div>
  );
};

export default TopicOfTheDay;
