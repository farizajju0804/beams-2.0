import React from 'react';
import Heading from './Heading';
import AchievementCard from './AchievementCard';
import Link from 'next/link';
import { getCompletedAchievements } from '@/actions/points/achievements';
import { currentUser } from '@/libs/auth';

const Achievements = async () => {
  const user: any = await currentUser();
  const achievements = await getCompletedAchievements(user?.id);
  
  return (
    <div className='w-full flex flex-col'>
      <Heading heading="Achievements" />

      {achievements.length > 0 ? (
        <div className="md:px-0 px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {achievements.map((achievement: any, id: any) => (
            <AchievementCard
              key={id}
              achievement={achievement.achievement}
              receivedOn={achievement.updatedAt.toLocaleDateString()}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-grey-2 px-4 text-sm">No achievements yet! Keep going, you&apos;re almost there!</p>
        </div>
      )}

      <Link
        href='/achievements/#victory'
        className='mt-6 w-full text-brand underline font-medium text-center mx-auto text-sm'
      >
        View Achievements progress here
      </Link>
    </div>
  );
};

export default Achievements;
