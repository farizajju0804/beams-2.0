
import { Achievement } from '@prisma/client';
import Image from 'next/image';
  import React from 'react';

  interface AchievementProps {
    achievement: Achievement;
    receivedOn : string;
  }
  
  const AchievementCard: React.FC<AchievementProps> = ({ achievement, receivedOn }) => {
    return (
      <div className="bg-background rounded-3xl shadow-defined p-4 flex items-center justify-between">
          <Image src={achievement.badgeImageUrl} alt="Badge" width={80} height={50} className="mr-6"/>
        <div className="flex flex-col flex-1 justify-around h-full w-full">
            <div className='flex flex-col'>
        <p className="text-xs mb-2 font-semibold text-grey-2">Receieved on {receivedOn}</p>
        <p className="text-xs mb-2 text-grey-2">{achievement.task}</p>
        {/* <p className="text-sm font-semibold text-brand">+{achievement.beamsToGain}</p> */}

          </div>
        </div>
      </div>
    );
  };
  
  export default AchievementCard;
  