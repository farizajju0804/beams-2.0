import React from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

export function DailyHeader() {
  return (
    <div className="w-full">
      {/* <BackgroundBeamsWithCollision> */}
        <div className="w-full max-w-screen-xl mx-auto">
          <div className="flex flex-col items-center gap-4 px-4">
            <h2 className="text-2xl font-semibold md:text-3xl font-poppins text-center text-text tracking-tight">
              Discover the Power of{" "}
              <span className="bg-brand px-2 text-white font-poppins font-bold text-transparent ">
                Beams
              </span>
            </h2>
            <div className="text-text mb-2">
              <p className="text-sm md:text-base text-center font-medium">
                Your daily dose of innovation, knowledge, and play.
              </p>
            </div>
          </div>
        </div>
      {/* </BackgroundBeamsWithCollision> */}
    </div>
  );
}