import React from 'react';
import LearningOverview from './_components/LearningOverview';
import { getUserAnalyticsById } from '@/actions/dashboard/timeSpent';
import { currentUser } from '@/libs/auth';
import { getPollDataByUserId } from '@/actions/dashboard/pollData';
import { getWatchedBeamsTodayContent } from '@/actions/dashboard/watchedContent';
import { getUserLevelAndHistory } from '@/actions/dashboard/getUserLevelAndRecentHistory';
import LevelBeams from './_components/LevalBeams';
import ReferralSection from './_components/Referrals';
import { getReferredUsers } from '@/actions/dashboard/getReferredUsers';
import VictoryVault from './_components/VictoryVault';
import { getCompletedAchievements } from '@/actions/points/achievements';
import ProfilePictureForm from '@/components/ProfilePictureForm';
import LevelDetails from './_components/LevelDetails';
import AccordionMenu from './_components/AccordionMenu';
import { Activity, Book, Gift, User } from 'iconsax-react';

const DashboardPage = async () => {
  const user: any = await currentUser();

  const [
    userAnalytics,
    pollData,
    watchedData,
    { userLevel, beams, recentActivities, accumulatedPoints },
    referred,
    completed
  ]: any = await Promise.all([
    getUserAnalyticsById(user?.id),
    getPollDataByUserId(user?.id),
    getWatchedBeamsTodayContent(user?.id),
    getUserLevelAndHistory(user?.id),
    getReferredUsers(user?.id),
    getCompletedAchievements(user?.id)
  ]);

  // Construct the menuItems array and pass components with plain props
  const menuItems = [
    {
      title: "My Referrals",
      icon: <User variant="Bold" className="h-5 w-5 text-grey-2" />,
      content: <ReferralSection referrals={referred} />,
    },
    {
      title: "My Learning",
      icon: <Book variant="Bold" className="h-5 w-5 text-grey-2" />,
      content: <LearningOverview userAnalytics={userAnalytics} pollData={pollData} watchedData={watchedData} />,
    },
    {
      title: "My Activity",
      icon:  <Activity variant="Bold" className="h-5 w-5 text-grey-2" />,
      content: (
        <LevelBeams
          userLevel={userLevel}
          beams={beams}
          recentActivities={recentActivities}
          accumulatedPoints={accumulatedPoints}
        />
      ),
    },
   
  ];

  return (
    <div className='w-full flex flex-col px-6 md:px-8 gap-12 py-4'>
      <div className='grid gap-6 w-full grid-cols-1 md:grid-cols-3'> 
        <ProfilePictureForm user={user} />
        <LevelDetails userLevel={userLevel} beams={beams} />
        <VictoryVault badges={completed} />
      </div>

      {/* Pass the plain data to AccordionMenu */}
      <AccordionMenu menuItems={menuItems} />
    </div>
  );
};

export default DashboardPage;
