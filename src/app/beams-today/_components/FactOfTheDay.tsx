"use client"

import React, { useState, useEffect } from "react";
import Image from "next/image";
import ScratchCard from "@/components/ScratchCard";
import { getFactOfTheDay, markFactAsCompleted, getFactCompletionStatus } from "@/actions/fod/fod";
import Loader from "@/components/Loader";

interface FactOfTheDayProps {
  userId: string;
}

const FactOfTheDay: React.FC<FactOfTheDayProps> = ({ userId }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [fact, setFact] = useState<{ id: string, finalImage: string; scratchImage: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false); // To check if the fact is already completed
  const clientDate = new Date().toLocaleDateString("en-CA");

  useEffect(() => {
    const fetchFactOfTheDay = async () => {
      try {
        const factData = await getFactOfTheDay(clientDate); // Fetch fact of the day
        setFact(factData);
        
        if (factData) {
          const completedStatus = await getFactCompletionStatus(userId, factData.id); // Check if fact is completed
          setIsCompleted(completedStatus);
        }
      } catch (error) {
        console.error("Error fetching fact of the day:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFactOfTheDay();
  }, [clientDate, userId]);

  // Handle fact completion after scratch
  const handleReveal = async () => {
    if (fact && !isCompleted) {
      try {
        await markFactAsCompleted(userId, fact.id); // Mark fact as completed
        setIsCompleted(true); // Update state to reflect completion
      } catch (error) {
        console.error("Error marking fact as completed:", error);
      }
    }
    setIsRevealed(true);
  };

  if (loading) {
    return <Loader/>;
  }

  return (
    <div className="w-full py-6 text-left relative max-w-6xl mx-auto">
      {/* Heading */}
      <div className="pl-6 lg:pl-0 flex flex-col items-start lg:items-center">
        <h1 className="text-lg md:text-2xl text-text font-poppins font-semibold mb-[1px]">Fact of the Day</h1>
        <div className="border-b-2 border-brand mb-6 w-full" style={{ maxWidth: '10%' }}></div>
      </div>

      {/* Main Content */}
      {fact ? (
        <div className="relative w-full max-w-sm mx-auto h-96 rounded-lg">
          {isCompleted ? (
            <Image
              src={fact.finalImage}
              alt="fact"
              priority={true}
              fill={true}
              style={{ objectFit: "cover" }}
              className="z-2 aspect-auto md:aspect-video lg:rounded-lg"
            />
          ) : (
            <ScratchCard
              scratchImage={fact.scratchImage}
              finalImage={fact.finalImage}
              onReveal={handleReveal}
            />
          )}
        </div>
      ) : (
        // Message displayed if no fact is available
        <p className="text-lg text-left md:text-center font-semibold text-grey-500 pl-6 md:pl-0">
          No fact available for today
        </p>
      )}
    </div>
  );
};

export default FactOfTheDay;
