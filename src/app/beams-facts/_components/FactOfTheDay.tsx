"use client"

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ScratchCard from "@/components/ScratchCard";
import { markFactAsCompleted, getFactAndCompletionStatus } from "@/actions/fod/fod";
import Loader from "@/components/Loader";
import StreakModal from "./StreakModal";
import DateComponent from "./DateComponent";
import { FactOfTheday } from "@prisma/client";

interface FactOfTheDayProps {
  userId: string;
  facts: any;
}

const FactOfTheDay: React.FC<FactOfTheDayProps> = ({ userId, facts }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [fact, setFact] = useState<any | null>(facts.fact);
  const [isCompleted, setIsCompleted] = useState(facts.completed);

  const clientDate = new Date().toLocaleDateString("en-CA");
  const router = useRouter();

  const revealLock = useRef(false);

  const handleReveal = async () => {
    if (isRevealed || isCompleted || !fact || revealLock.current) {
      return;
    }

    revealLock.current = true;
    setIsRevealed(true);

    try {
      const result = await markFactAsCompleted(userId, fact.id, clientDate);
      setIsCompleted(true);

      
        // setStreakDay(result.streakDay);

        if (result) {
          // setStreakMessage(result.message);

          // setTimeout(() => {
          //   setShowStreakModal(true);
          // }, 1000);
        } else {
          console.log("Achievement already completed, no streak modal shown");
        }
      
    } catch (error) {
      console.error("Error marking fact as completed:", error);
    } finally {
      revealLock.current = false;
    }
  };

  // const handleCloseStreakModal = () => {
  //   setShowStreakModal(false);
  // };

 

  return (
    <div className="w-full mb-2 text-left relative max-w-md md:rounded-3xl mx-auto">
      {fact ? (
        <>
          <div className="px-6 lg:px-0 flex justify-between items-start lg:items-center">
            <div className="w-full flex-1">
              <h1 className="text-lg md:text-2xl text-text font-poppins font-semibold mb-[1px]">{fact.title}</h1>
              <div className="border-b-2 border-brand mb-4 w-full" style={{ maxWidth: '10%' }}></div>
            </div>
          </div>
          <div className="relative w-full max-w-md shadow-defined-top mx-auto h-[390px] rounded-lg">
            {isCompleted ? (
              <div className="relative">
                <Image
                  src={fact.finalImage}
                  alt="fact"
                  priority={true}
                  width={400}
                  height={400}
                  style={{ objectFit: "cover" }}
                  className="z-2 aspect-auto max-w-sm lg:rounded-lg"
                />
                {fact?.date && (
                  <div className="absolute top-2 right-2 z-10">
                    <DateComponent date={fact.date.toISOString().split('T')[0]} />
                  </div>
                )}
              </div>
            ) : (
         
                <ScratchCard
                  scratchImage={fact.scratchImage ? fact.scratchImage : 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1727699559/fact%20of%20the%20day/wrap_zd7veo.png'}
                  finalImage={fact.finalImage}
                  onReveal={handleReveal}
                />
            )}
          </div>
        </>
      ) : (
        <p className="text-lg text-left md:text-center font-semibold text-grey-500 pl-6 md:pl-0">
          No fact available for today
        </p>
      )}

      {/* <StreakModal
        streakDay={streakDay}
        streakMessage={streakMessage}
        isOpen={showStreakModal}
        onClose={handleCloseStreakModal}
        onCTA={handleStreakCTA}
        ctaText={streakDay >= 7 ? "View My Badge" : "I'm committed"}
      /> */}
    </div>
  );
};

export default FactOfTheDay;