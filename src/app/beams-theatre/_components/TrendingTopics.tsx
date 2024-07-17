import React from 'react';
import { getTrendingBeamsTheatre } from "@/actions/beams-theatre/getTrendingBeamsTheatre";
import { BeamsTheatre } from '@/types/beamsTheatre';
import { CardStack } from "./CardStack";
import { SectionTitle } from "./SectionTitle";

const TrendingCardStack: React.FC = async () => {
  const trending: any = await getTrendingBeamsTheatre();

  const CARDS = trending.map((show:any) => ({
    id: show.id,
    name: show.title,
    designation: show.description,
    imageUrl: show.posterUrl,
  }));

  return (
    <div className="my-8 flex items-center flex-col justify-center max-w-5xl w-[90%] gap-12 relative mx-2 lg:mx-4 bg-brand-100  px-6 py-4 pb-8 rounded-3xl">
      <div className="flex items-center justify-between w-full ">
        <SectionTitle text="Trending Shows" />
      </div>
      <CardStack items={CARDS} />
    </div>
  );
};

export default TrendingCardStack;
