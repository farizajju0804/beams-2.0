import React from 'react';
import LearningOverview from './_components/LearningOverview';
import { getUserAnalyticsById } from '@/actions/dashboard/timeSpent';
import { currentUser } from '@/libs/auth';
import { getPollDataByUserId } from '@/actions/dashboard/pollData';
import { getWatchedBeamsTodayContent } from '@/actions/dashboard/watchedContent';
import { getUserLevelAndHistory } from '@/actions/dashboard/getUserLevelAndRecentHistory';
import Achievements from './_components/Achievements';
import Leaderboard from './_components/Leaderboard';

import { getLeaderboardData } from '@/actions/dashboard/getLeaderBoard';
import { getTop3EntriesForMostRecentWeek } from '@/actions/points/getPreviousLeaderboard';
import LevelBeams from './_components/LevalBeams';

const DashboardPage = async () => {
  const user: any = await currentUser();
  console.log("session",user)
  const [
    userAnalytics,
    pollData,
    watchedData,
    { userLevel, beams, recentActivities, accumulatedPoints },
    leaderboardData,
    previousWeekTop3
  ]:any = await Promise.all([
    getUserAnalyticsById(user?.id),
    getPollDataByUserId(user?.id),
    getWatchedBeamsTodayContent(user?.id),
    getUserLevelAndHistory(user?.id),
    getLeaderboardData(user?.id, user?.userType),
    getTop3EntriesForMostRecentWeek(user?.userType,user?.id)
  ]);

console.log("previous",previousWeekTop3)

  return (
    <div className='flex flex-col md:px-8 gap-12 py-4'>
      <LearningOverview
        userAnalytics={userAnalytics}
        pollData={pollData}
        watchedData={watchedData}
      />
      <LevelBeams
        userLevel={userLevel}
        beams={beams}
        recentActivities={recentActivities}
        accumulatedPoints={accumulatedPoints}
      />
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

export default DashboardPage;