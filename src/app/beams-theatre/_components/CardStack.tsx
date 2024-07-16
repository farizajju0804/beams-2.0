"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, ArrowLeft2, ArrowRight2 } from 'iconsax-react'; // Import Heart and Arrow icons
import { Button } from "@nextui-org/react";

let interval: any;

type Card = {
  id: number;
  name: string;
  designation: string;
  imageUrl: string; // Add imageUrl property
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
  const CARD_OFFSET = offset || 5; // Adjusted for more overlap
  const SCALE_FACTOR = scaleFactor || 0.04; // Adjusted scale factor
  const [cards, setCards] = useState<Card[]>(items);
  const isMobile =  window.innerWidth <767;
  useEffect(() => {
    startFlipping();

    return () => clearInterval(interval);
  }, []);

  const startFlipping = () => {
    interval = setInterval(() => {
      setCards((prevCards: Card[]) => {
        const newArray = [...prevCards]; // create a copy of the array
        newArray.unshift(newArray.pop()!); // move the last element to the front
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
  };

  const handlePrev = () => {
    setCards((prevCards: Card[]) => {
      const newArray = [...prevCards];
      newArray.push(newArray.shift()!);
      return newArray;
    });
  };

  return (
    <div className="flex items-center justify-center gap-0 lg:gap-4">
      <Button isIconOnly onClick={handlePrev} className="bg-transparent text-black">
        <ArrowLeft2 size={isMobile ? "16" : "24"} />
      </Button>
      <div className="relative h-40 w-60 md:h-80 md:w-[30rem] flex items-center justify-center">
        {cards.map((card, index) => {
          return (
            <motion.div
              key={card.id}
              className="absolute h-40 w-60 md:h-80 md:w-[30rem] rounded-3xl shadow-xl border border-neutral-200 flex items-center justify-center"
              style={{
                transformOrigin: "top center",
                backgroundImage: `url(${card.imageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              animate={{
                top: index * -CARD_OFFSET,
                scale: 1 - index * SCALE_FACTOR, // decrease scale for cards that are behind
                zIndex: cards.length - index, // decrease z-index for the cards that are behind
              }}
            >
              <div className="absolute top-2 right-2">
                <button className="text-white">
                  <Heart size={isMobile ? "16" : "24"} variant="Bold" />
                </button>
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
