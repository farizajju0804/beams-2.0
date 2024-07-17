import React from 'react';
import { getNowShowingBeamsTheatre } from "@/actions/beams-theatre/getNowShowingBeamsTheatre";
import { BeamsTheatre } from '@/types/beamsTheatre';
import NowShowingCard from './NowShowingCard';
import Image from "next/image";



const NowShowing: React.FC = async () => {
  const nowShowing: any = await getNowShowingBeamsTheatre();

  return (
    <div className="my-8 flex items-center flex-col justify-start w-full gap-12 relative bg-black">
      <div className="mt-10 px-4 flex flex-col md:items-center items-start">
        <div className="-mb-6 z-[4] ml-8 md:ml-0 bg-white font-display text-black p-2 rounded-2xl text-base lg:text-xl">
          Now Showing
        </div>
        <NowShowingCard data={nowShowing} />
      </div>
      <Image
        src={'/images/beams-theatre/theatre-seat.png'}
        width={0}
        height={0}
        sizes="100vw"
        className="w-full h-[70px] md:h-auto aspect-auto absolute bottom-0 left-0 right-0"
        alt="theatre-seat"
      />
    </div>
  );
};

export default NowShowing;
