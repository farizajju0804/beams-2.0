"use client";
import React from "react";
import { StickyScroll } from "@/ui/StickyScrollReveal";
import Image from "next/image";

const content = [
  {
    title: "Beams Reels",
    description:
      "Short glimpse videos of the module, giving a quick overview and introduction to the topic.",
    content: (
      <div className="h-full text-4xl text-center w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        Beams Reels
      </div>
    ),
  },
  {
    title: "Beams Storyland",
    description:
      "Interactive storybook about the topic, engaging users through a creative and narrative approach.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-white">
        {/* <Image
          src="/storyland.jpg"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="Storyland demo"
        /> */}
        <div className="h-full text-4xl text-center w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        Beams Storyland
      </div>
      </div>
    ),
  },
  {
    title: "Beams Explorer",
    description:
      "Different creative blogs on topics about the module, providing in-depth knowledge and insights.",
    content: (
      <div className="h-full text-4xl text-center w-full bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] flex items-center justify-center text-white">
        Beams Explorer
      </div>
    ),
  },
  {
    title: "Beams Quizland",
    description:
      "Quiz on the module, testing knowledge and understanding of the topic covered.",
    content: (
      <div className="h-full text-4xl text-center w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        Beams Quizland
      </div>
    ),
  },
  {
    title: "Beams Jigsaw",
    description:
      "Jigsaw puzzle that, upon solving, reveals interesting information about the module or topic.",
    content: (
      <div className="h-full text-4xl text-center w-full bg-[linear-gradient(to_bottom_right,var(--pink-500),var(--indigo-500))] flex items-center justify-center text-white">
        Beams Jigsaw
      </div>
    ),
  },
  {
    title: "Beams Timeline",
    description:
      "Interactive timeline showing the innovation and evolution of the topic or module over the years.",
    content: (
      <div className="h-full text-4xl text-center w-full bg-[linear-gradient(to_bottom_right,var(--orange-500),var(--yellow-500))] flex items-center justify-center text-white">
        Beams Timeline
      </div>
    ),
  },
  {
    title: "Beams Startup Universe",
    description:
      "Exploring different startups revolutionizing the module concepts or applications.",
    content: (
      <div className="h-full text-4xl text-center w-full bg-[linear-gradient(to_bottom_right,var(--cyan-500),var(--emerald-500))] flex items-center justify-center text-white">
        Beams Startup Universe
      </div>
    ),
  },
  {
    title: "Beams Leader",
    description:
      "A quiz aiming to test the students' critical thinking, problem-solving, and application of the module learned.",
    content: (
      <div className="h-full text-4xl text-center w-full bg-[linear-gradient(to_bottom_right,var(--pink-500),var(--indigo-500))] flex items-center justify-center text-white">
        Beams Leader
      </div>
    ),
  },
];

export function ModulesStickyScroll() {
  return (
    <div className="h-screen">
      <StickyScroll content={content} />
    </div>
  );
}
