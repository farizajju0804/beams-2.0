"use client";
import React from "react";
import { PinContainer } from "@/ui/3dPin";

export function PinCard() {
  return (
    <div className="h-[40rem] w-full flex items-center justify-center ">
      <PinContainer
        title="/beams-theatre"
        href="https://www.beams.world/beams-theatre"
      >
        <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
          <h3 className="max-w-xs !pb-2 !m-0 font-bold font-display text-2xl text-slate-100">
            Beams Theatre
          </h3>
          <div className="text-base !m-0 !p-0 font-normal">
            <span className="text-slate-300 ">
              Videos on Revolutionary Topics
            </span>
          </div>
          <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500" />
        </div>
      </PinContainer>
    </div>
  );
}
