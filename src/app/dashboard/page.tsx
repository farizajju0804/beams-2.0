import React from 'react';
import LearningOverview from './_components/LearningOverview';
import { getUserAnalyticsById } from '@/actions/dashboard/timeSpent';
import { currentUser } from '@/libs/auth';
import { getPollDataByUserId } from '@/actions/dashboard/pollData';
import { getWatchedBeamsTodayContent } from '@/actions/dashboard/watchedContent';

import { getUserLevelAndHistory } from '@/actions/dashboard/getUserLevelAndRecentHistory';
import Achievements from './_components/Achievements';
import Leaderboard from './_components/Leaderboard';

import LevelBeams from './_components/LevalBeams';
import { getLeaderboardData } from '@/actions/dashboard/getLeaderBoard';

const page = async () => {
  const user: any = await currentUser();

  const userAnalytics: any = await getUserAnalyticsById(user?.id);
  const pollData: any = await getPollDataByUserId(user?.id);
  const watchedData: any = await getWatchedBeamsTodayContent(user?.id);
  const { userLevel, beams, recentActivities, accumulatedPoints } = await getUserLevelAndHistory(user?.id);
  const { entries: leaderboardEntries, userPosition,userPoints, message, startDate, endDate } = await getLeaderboardData(user?.id);

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
      <Leaderboard startDate={startDate} endDate={endDate}  users={leaderboardEntries} userPosition={userPosition}  userPoints={userPoints} message={message} />
      <Achievements />
    </div>
  );
}

export default page;
