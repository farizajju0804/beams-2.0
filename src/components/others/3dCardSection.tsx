"use client";

import Image from "next/image";
import React from "react";
import { CardBody, CardContainer, CardItem } from "@/ui/3d-Card";
import Link from "next/link";

export function ThreeDCardSection() {
  const cards = [
    {
      title: "Beams Theatre",
      description: "Watch educational videos on revolutionary topics in our mini YouTube.",
      image: "https://picsum.photos/200/300?random=2",
      link: "/beams-theatre"
    },
    {
      title: "Beams Today",
      description: "Stay updated with daily content in text, video, and audio formats.",
      image: "https://picsum.photos/200/300?random=3",
      link: "/beams-today"
    }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-8">
      {cards.map((card, index) => (
        <CardContainer key={index} className="">
          <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-5/6 lg:w-auto  sm:w-[30rem] h-auto rounded-xl p-6 border">
            <CardItem
              translateZ="50"
              className="text-xl font-bold text-neutral-600 dark:text-white"
            >
              {card.title}
            </CardItem>
            <CardItem
              as="p"
              translateZ="60"
              className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
            >
              {card.description}
            </CardItem>
            <CardItem translateZ="100" className="w-full mt-4">
              <Image
                src={card.image}
                height="1000"
                width="1000"
                className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                alt="thumbnail"
              />
            </CardItem>
            <div className="flex justify-end items-center mt-20">
              <CardItem
                translateZ={20}
                as={Link}
                href={card.link}
                className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
              >
                Know More
              </CardItem>
            </div>
          </CardBody>
        </CardContainer>
      ))}
    </div>
  );
}