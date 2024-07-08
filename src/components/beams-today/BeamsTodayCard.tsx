import Image from "next/image";
import Link from "next/link";
import { Play } from 'iconsax-react';
import { BeamsToday } from "@/types/beamsToday";

interface BeamsTodayCardProps {
  topic: BeamsToday;
}

const BeamsTodayCard: React.FC<BeamsTodayCardProps> = ({ topic }) => (
  // <Link href={`/beams-today/${topic.date.toISOString().split("T")[0]}`} className="videoCard">
  <Link href={`/beams-today/${topic.id}`} >

    <div className="relative">
      <Play size="24" color="white" className="absolute top-2 right-2" />
      <Image src={topic.thumbnailUrl} alt={topic.title} width={200} height={170} className="w-full rounded-lg" />
    </div>
    <div className="text-left p-4">
      <p className="text-lg font-bold">{topic.title}</p>
      <p className="text-base">{topic.shortDesc}</p>
    </div>
  </Link>
);

export default BeamsTodayCard;
