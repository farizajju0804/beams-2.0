
import { getNowShowingBeamsTheatre } from "@/actions/beams-theatre/getNowShowingBeamsTheatre";
import { BeamsTheatre } from '@/types/beamsTheatre';
import NowShowingCard from './NowShowingCard';
import Image from "next/image";
import TicketTitle from "./TicketTitle";

const NowShowing: React.FC = async () => {
  const nowShowing: BeamsTheatre = await getNowShowingBeamsTheatre();

  return (
    <div className="mt-2 mb-8 flex items-center flex-col justify-start w-full gap-12 relative ">
      <div className="mt-2 px-4 flex flex-col items-center">
       
       <div className="mb-4">
      <TicketTitle  title="Now Showing"/>
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
