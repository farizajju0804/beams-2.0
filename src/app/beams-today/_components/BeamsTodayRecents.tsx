"use client";
import Image from "next/image";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import FavoriteButton from "./FavoriteButton";

export function BeamsTodayRecents({ topics }: any) {
  const [active, setActive] = useState<any | boolean | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0  grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px]  h-full md:h-fit md:pb-6  flex flex-col bg-background sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <Image
                  priority
                  width={200}
                  height={200}
                  src={active.thumbnailUrl}
                  alt={active.title}
                  className="w-full h-60 lg:h-60  object-cover object-center"
                />
              </motion.div>

              <div className="">
                <div className="flex  items-start px-4 pt-4">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-medium font-poppins text-text text-lg"
                    >
                      {active.title}
                    </motion.h3>
                    {/* <motion.p
                      layoutId={`description-${active.shortDesc}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400 text-base"
                    >
                      {active.shortDesc}
                    </motion.p> */}
                 

                  
                </div>
                <div className="pt-2 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-grey-2 text-sm md:text-sm lg:text-base pb-6 flex flex-col items-start gap-4 overflow-auto  [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {active.shortDesc}
                  </motion.div>
                </div>
                <div className="pt-2 flex justify-between items-center relative px-4">
                <motion.a
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    href={`/beams-today/${active.id}`}
                    className="px-4 py-2 text-base rounded-lg font-bold bg-brand text-white"
                  >
                    Read Now
                  </motion.a>
                  <FavoriteButton beamsTodayId={active?.id} />
                  </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <div className="pl-6 lg:pl-0 w-full flex flex-col items-start lg:items-center">
          <h1 className="text-lg md:text-2xl text-text font-display font-bold mb-[1px]">Recent Uploads</h1>
          <div className="border-b-2 border-brand w-full" style={{ maxWidth: '13%' }}></div>
        </div>
      <ul className="max-w-5xl px-6 mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start gap-4">
      
        {topics.map((topic: any, index: number) => (
          <motion.div
            layoutId={`card-${topic.title}-${id}`}
            key={topic.id}
            onClick={() => setActive(topic)}
            className="p-4 flex flex-col  rounded-xl cursor-pointer"
          >
            <div className="flex gap-4 flex-col  w-full">
              <motion.div layoutId={`image-${topic.title}-${id}`}>
                <Image
                  width={100}
                  height={100}
                  src={topic.thumbnailUrl}
                  alt={topic.title}
                  className="h-48 w-full rounded-lg object-cover object-center"
                />
              </motion.div>
              <div className="flex justify-center items-center flex-col">
                <motion.h3
                  layoutId={`title-${topic.title}-${id}`}
                  className="font-medium text-text font-poppins text-left text-base"
                >
                  {topic.title}
                </motion.h3>
                {/* <motion.p
                  layoutId={`description-${topic.shortDesc}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400 text-center md:text-left text-base"
                >
                  {topic.shortDesc}
                </motion.p> */}
              </div>
            </div>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
