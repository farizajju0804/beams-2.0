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
  const [factData, setFactData] = useState<{
    fact: { id: string; finalImage: string; scratchImage: string } | null;
    isCompleted: boolean;
    isRevealed: boolean;
  }>({ fact: null, isCompleted: false, isRevealed: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFactOfTheDay = async () => {
      try {
        const clientDate = new Date().toLocaleDateString("en-CA");
        const fact = await getFactOfTheDay(clientDate);
        
        if (fact) {
          const completedStatus = await getFactCompletionStatus(userId, fact.id);
          setFactData({ fact, isCompleted: completedStatus, isRevealed: completedStatus });
        } else {
          setFactData({ fact: null, isCompleted: false, isRevealed: false });
        }
      } catch (error) {
        console.error("Error fetching fact of the day:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFactOfTheDay();
  }, [userId]);

  const handleReveal = async () => {
    if (factData.fact && !factData.isCompleted) {
      try {
        await markFactAsCompleted(userId, factData.fact.id);
        setFactData(prev => ({ ...prev, isCompleted: true, isRevealed: true }));
      } catch (error) {
        console.error("Error marking fact as completed:", error);
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="w-full py-6 text-left relative max-w-6xl mx-auto">
      <div className="pl-6 lg:pl-0 flex flex-col items-start lg:items-center">
        <h1 className="text-lg md:text-2xl text-text font-poppins font-semibold mb-[1px]">Fact of the Day</h1>
        <div className="border-b-2 border-brand mb-6 w-full" style={{ maxWidth: '10%' }}></div>
      </div>

      {factData.fact ? (
        <div className="relative w-full max-w-sm mx-auto h-96 rounded-lg">
          {factData.isCompleted ? (
            <Image
              src={factData.fact.finalImage}
              alt="fact"
              priority={true}
              fill={true}
              style={{ objectFit: "cover" }}
              className="z-2 aspect-auto md:aspect-video lg:rounded-lg"
            />
          ) : (
            <ScratchCard
              scratchImage={factData.fact.scratchImage}
              finalImage={factData.fact.finalImage}
              onReveal={handleReveal}
            />
          )}
        </div>
      ) : (
        <p className="text-lg text-left md:text-center font-semibold text-grey-500 pl-6 md:pl-0">
          No fact available for today
        </p>
      )}
    </div>
  );
};

export default FactOfTheDay;