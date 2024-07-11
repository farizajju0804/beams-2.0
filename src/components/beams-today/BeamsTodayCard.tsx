import React from 'react';
import FavoriteButton from './FavoriteButton'; // Make sure this path is correct
import FormattedDate from './FormattedDate'; // Make sure this path is correct
import { BeamsToday } from '@/types/beamsToday';
import {Chip} from "@nextui-org/react";
import Link from 'next/link';
interface BeamsTodayCardProps {
  topic: BeamsToday;
  className?: string;
}

const BeamsTodayCard: React.FC<BeamsTodayCardProps> = ({ topic, className = '' }) => (
  <Link href={`/beams-today/${topic.id}`}>
  <div
    className={`w-full aspect-[9/16] h-[420px] rounded-3xl flex flex-col  justify-between px-4 py-6 box-border leading-[normal] tracking-[normal]`}
    style={{ 
      backgroundImage: `url(${topic.thumbnailUrl})`, 
      backgroundSize: 'cover', 
      backgroundRepeat: 'no-repeat', 
      backgroundPosition: 'center' 
    }}
  >
    <div className="flex flex-row items-center justify-between py-0 px-1">
    <Chip className="mb-2" classNames={{base : "bg-black",content:"text-white"}}>{topic.category.name}</Chip>
      <div className="[backdrop-filter:blur(15px)] rounded-2xl bg-white flex flex-row items-start justify-start ">
        <FavoriteButton beamsTodayId={topic.id} size={'md'} />
      </div>
    </div>
    <section className="self-stretch mt-auto [backdrop-filter:blur(20px)] rounded-3xl [background:linear-gradient(92.11deg,_#fff5ed,_rgba(255,_255,_255,_0.2)_99.93%)] flex flex-col items-start justify-start p-4 gap-4 text-left text-xl text-black">
      <h3 className="m-0 relative text-inherit font-semibold font-inherit">
        {topic.title}
      </h3>
      <div className="relative text-sm inline-block">
        <FormattedDate date={topic.date.toISOString().split('T')[0]} />
      </div>
    </section>
  </div>
  </Link>
);

export default BeamsTodayCard;
