import Image from "next/image";
import { CardStack } from "./CardStack";
import { SectionTitle } from "./SectionTitle"; // Import Title component
import NowShowingCard from "./NowShowingCard";

const showData = {
    title: "The Longevity Science",
    description: "Lorem ipsum dolor sit amet consectetur. Nullam adipiscing ut mauris nec. Et volutpat molestie varius elementum faucibus sodales quis augue. Gravida id volutpat semper dignissim sit nisl et.",
    imageUrl: "https://res.cloudinary.com/drlyyxqh9/image/upload/v1720690887/Beams%20today/thumbnails/wireless_charging_aqczlw.png", // Replace with your image URL
    category: "Medicine",
    seasons: 2,
    episodes: 20,
  };
export function NowShowing() {
  return (
    <div className="my-8  flex items-center flex-col justify-start w-full  gap-12 relative  bg-black">
      <div className="mt-10 px-4 flex flex-col items-center justify-between  ">
      <div className="-mb-6 z-[4] bg-white font-display text-black  p-2 px-4 rounded-2xl text-base lg:text-2xl">
      Now Showing
    </div>
     <NowShowingCard data={showData}/>
      </div>
      <Image
      src={'/images/beams-theatre/theatre-seat.png'}
      width={0}
      height={0}
      sizes="100vw"
      className="w-full h-auto aspect-auto absolute bottom-0 left-0 right-0"
      alt="theatre-seat"
      />

    </div>
  );
}
