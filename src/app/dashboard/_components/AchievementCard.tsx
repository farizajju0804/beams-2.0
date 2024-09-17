interface Achievement {
    id: string;
    name: string;
    badgeImageUrl: string;
    task: string;
    caption: string;
    points: number; // Assuming points are needed as per the example image
    completionStatus: boolean;
    progress: number;
    createdAt?: Date;
    updatedAt?: Date;
  }
import Image from 'next/image';
  import React from 'react';

  interface AchievementProps {
    achievement: Achievement;
  }
  
  const AchievementCard: React.FC<AchievementProps> = ({ achievement }) => {
    return (
      <div className="bg-background rounded-3xl shadow-defined p-4 flex items-center justify-between">
          <Image src={achievement.badgeImageUrl} alt="Badge" width={60} height={40} className="mr-6"/>
        <div className="flex flex-col flex-1 justify-around h-full w-full">
            <div className='flex flex-col'>
        <h5 className="text-lg font-poppins font-semibold">{achievement.name}</h5>
        <div className='flex items-center justify-between'>
        <p className="text-xs text-grey-2">{achievement.task}</p>
          <p className="text-sm font-semibold text-green-500">+{achievement.points}</p>
          </div>
          </div>
        <p className="text-sm text-text">{achievement.caption}</p>
        </div>
      </div>
    );
  };
  
  export default AchievementCard;
  