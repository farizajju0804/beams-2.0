import React from 'react';

import { currentUser } from '@/libs/auth';

import Leaderboard from './_components/Leaderboard';

import { getLeaderboardData } from '@/actions/dashboard/getLeaderBoard';
import { getTop3EntriesForMostRecentWeek } from '@/actions/points/getPreviousLeaderboard';


const Page = async () => {
  const user: any = await currentUser();
  console.log("session",user)
  const [
    leaderboardData,
    previousWeekTop3
  ]:any = await Promise.all([
    getLeaderboardData(user?.id, user?.userType),
    getTop3EntriesForMostRecentWeek(user?.userType,user?.id)
  ]);

console.log("previous",previousWeekTop3)

  return (
    <div className='flex flex-col md:px-8 gap-12 py-4'>
     
      <Leaderboard
        userId={user?.id}
        initialData={leaderboardData}
        userType={user?.userType}
        previous={previousWeekTop3}
      />
      {/* <Achievements /> */}
    </div>
  );
};

export default Page;