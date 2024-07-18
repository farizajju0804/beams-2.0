"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft2, ArrowRight2 } from 'iconsax-react';
import { Button } from "@nextui-org/react";
import BeamsTheatreFavoriteButton from "./BeamsTheatreFavoriteButton";

let interval: any;

type Card = {
  id: string;
  name: string;
  designation: string;
  imageUrl: string;
};

export const CardStack = ({
  items,
  offset,
  scaleFactor,
}: {
  items: Card[];
  offset?: number;
  scaleFactor?: number;
}) => {
  const router = useRouter();
  const CARD_OFFSET = offset || 5; 
  const SCALE_FACTOR = scaleFactor || 0.04; 
  const [cards, setCards] = useState<Card[]>(items);
  const isMobile = window.innerWidth < 767;

  useEffect(() => {
    startFlipping();
    return () => clearInterval(interval);
  }, []);

  const startFlipping = () => {
    clearInterval(interval); // Clear any existing interval
    interval = setInterval(() => {
      setCards((prevCards: Card[]) => {
        const newArray = [...prevCards];
        newArray.unshift(newArray.pop()!);
        return newArray;
      });
    }, 5000);
  };

  const handleNext = () => {
    setCards((prevCards: Card[]) => {
      const newArray = [...prevCards];
      newArray.unshift(newArray.pop()!);
      return newArray;
    });
    startFlipping(); // Reset the interval timer
  };

  const handlePrev = () => {
    setCards((prevCards: Card[]) => {
      const newArray = [...prevCards];
      newArray.push(newArray.shift()!);
      return newArray;
    });
    startFlipping(); // Reset the interval timer
  };

  const handleCardClick = (id: string) => {
    router.push(`/beams-theatre/${id}`);
  };

  return (
    <div className="flex items-center justify-center gap-0 lg:gap-4">
      <Button isIconOnly onClick={handlePrev} className="bg-transparent text-black">
        <ArrowLeft2 size={isMobile ? "16" : "24"} />
      </Button>
      <div className="relative h-60 w-60 md:h-[20rem] md:w-[20rem] flex items-center justify-center">
        {cards.map((card, index) => {
          return (
            <motion.div
              key={card.id}
              className="absolute h-60 w-60 md:h-[20rem] md:w-[20rem] rounded-3xl shadow-xl border border-neutral-200 flex items-center justify-center cursor-pointer"
              style={{
                transformOrigin: "top center",
                backgroundImage: `url(${card.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              animate={{
                top: index * -CARD_OFFSET,
                scale: 1 - index * SCALE_FACTOR,
                zIndex: cards.length - index,
              }}
              onClick={() => handleCardClick(card.id)}
            >
              <div className="absolute top-4 right-4">
                <BeamsTheatreFavoriteButton beamsTheatreId={card.id} />
              </div>
            </motion.div>
          );
        })}
      </div>
      <Button isIconOnly onClick={handleNext} className="bg-transparent text-black">
        <ArrowRight2 size={isMobile ? "16" : "24"} />
      </Button>
    </div>
  );
};
