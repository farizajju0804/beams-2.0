"use client"

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ScratchCard from "@/components/ScratchCard";
import { markFactAsCompleted, getFactAndCompletionStatus } from "@/actions/fod/fod";
import Loader from "@/components/Loader";
import StreakModal from "./StreakModal";
import DateComponent from "./DateComponent";


interface FactOfTheDayProps {
  userId: string;
  
}

const FactOfTheDay: React.FC<FactOfTheDayProps> = ({ userId, }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [fact, setFact] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [streakDay, setStreakDay] = useState(0);
  const [streakMessage, setStreakMessage] = useState("");
  const clientDate = new Date().toLocaleDateString("en-CA");
  const router = useRouter();

  const revealLock = useRef(false);  // Ensures that reveal happens only once


  useEffect(() => {
    const fetchFactAndCompletion = async () => {
      try {
        const { fact, completed }:any= await getFactAndCompletionStatus(userId, clientDate);
        setFact(fact);
        setIsCompleted(completed);
      } catch (error) {
        console.error("Error fetching fact and completion status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFactAndCompletion();
  }, [clientDate, userId]);

  const handleReveal = async () => {
    if (isRevealed || isCompleted || !fact || revealLock.current) {
      return; // Prevent further execution if already revealed or locked
    }

    revealLock.current = true;  // Lock future invocations
    setIsRevealed(true);  // Update the state

    try {
      const result = await markFactAsCompleted(userId, fact.id, clientDate);
      setIsCompleted(true);

      if (result) {
        setStreakDay(result.streakDay);

        if (result.message) {
          setStreakMessage(result.message);

          setTimeout(() => {
            setShowStreakModal(true);
          }, 1000);
        } else {
          console.log("Achievement already completed, no streak modal shown");
        }
      }
    } catch (error) {
      console.error("Error marking fact as completed:", error);
    } finally {
      revealLock.current = false;  // Unlock after process is done
    }
  };

  const handleCloseStreakModal = () => {
    setShowStreakModal(false);
  };

  const handleStreakCTA = () => {
    if (streakDay >= 7) {
      router.push('/achievements/#victory');
    } else {
      handleCloseStreakModal();
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full  mb-2 text-left relative max-w-md md:rounded-3xl mx-auto">
      {/* Heading */}
      

      {/* Main Content */}
      {fact ? (
        <>
        <div className="px-6 lg:px-0 flex justify-between items-start lg:items-center">
        {/* <h1 className="text-lg md:text-2xl text-text font-poppins font-semibold mb-[1px]">Fact of the Day</h1> */}
        <div className="w-full flex-1">
        <h1 className="text-lg md:text-2xl text-text font-poppins font-semibold mb-[1px]">{fact.title}</h1>
        <div className="border-b-2 border-brand mb-4 w-full" style={{ maxWidth: '10%' }}></div>
        </div>
        <div className="flex justify-start md:justify-center mb-3 items-center">
        {/* <h1 className="text-lg md:text-2xl text-text  font-semibold ]">{fact.title}</h1> */}
       
        {fact?.date &&
        <DateComponent date={fact.date.toISOString().split('T')[0]} />
          }
        </div>
      </div>
        <div className="relative w-full max-w-md  shadow-defined-top mx-auto h-[390px] rounded-lg">
          {isCompleted ? (
            <Image
              src={fact.finalImage}
              alt="fact"
              priority={true}
              width={400}
              height={400}
              style={{ objectFit: "cover" }}
              className="z-2 aspect-auto max-w-sm lg:rounded-lg"
            />
          ) : (
            <ScratchCard
              scratchImage={fact.scratchImage ? fact.scratchImage : 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1727699559/fact%20of%20the%20day/wrap_zd7veo.png' }
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

      <StreakModal
       
        streakDay={streakDay}
        streakMessage={streakMessage}
        isOpen={showStreakModal}
        onClose={handleCloseStreakModal}
        onCTA={handleStreakCTA}
        ctaText={streakDay >= 7 ? "View My Badge" : "I'm committed"}
      />
    </div>
  );
};

export default FactOfTheDay;