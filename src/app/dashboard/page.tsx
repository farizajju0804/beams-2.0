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
import { Activity, Book, Coin, Coin1, Gift, User } from 'iconsax-react';
import VibrantBeamsBreakdown from './_components/PieChart';
import { getReferralStatus } from '@/actions/auth/getLatestUserData';


const DashboardPage = async () => {
  const user: any = await currentUser();

  const [
    userAnalytics,
    pollData,
    watchedData,
    { userLevel, beams, recentActivities, top20RecentActivities ,accumulatedPoints },
    referred,
    completed,
    referralStatus
  ]: any = await Promise.all([
    getUserAnalyticsById(user?.id),
    getPollDataByUserId(user?.id),
    getWatchedBeamsTodayContent(user?.id),
    getUserLevelAndHistory(user?.id),
    getReferredUsers(user?.id),
    getCompletedAchievements(user?.id),
    getReferralStatus()
  ]);

  // Construct the menuItems array and pass components with plain props
  const menuItems = [
    ...(referralStatus?.referredById == null && referralStatus?.referralStatus == null
      ? [
          {
            title: "My Referrals",
            icon: <User variant="Bold" className="h-5 w-5 text-grey-2" />,
            content: <ReferralSection referrals={referred} />,
          },
        ]
      : []),
    {
      title: "My Learning",
      icon: <Book variant="Bold" className="h-5 w-5 text-grey-2" />,
      content: <LearningOverview userAnalytics={userAnalytics} pollData={pollData} watchedData={watchedData} />,
    },
    {
      title: "My Beams",
      icon:  <Coin1 variant="Bold" className="h-5 w-5 text-grey-2" />,
      content: (
        <VibrantBeamsBreakdown
         
          beams={beams}
          
          accumulatedPoints={accumulatedPoints}
        />
      ),
    },
    {
      title: "My Activity",
      icon:  <Activity variant="Bold" className="h-5 w-5 text-grey-2" />,
      content: (
        <LevelBeams
          userLevel={userLevel}
          beams={beams}
          recentActivities={top20RecentActivities}
          accumulatedPoints={accumulatedPoints}
        />
      ),
    },
   
  ];

  return (
    <div className='w-full flex flex-col px-6 md:px-8 gap-10 py-4'>
      <div className="grid gap-8 w-full grid-cols-1 md:grid-cols-1 lg:grid-cols-12 md:gap-8">
  <div className="lg:col-span-2">
    <ProfilePictureForm user={user} />
  </div>
  <div className=" lg:col-span-5 flex items-center justify-center" >
    <LevelDetails userLevel={userLevel} beams={beams} />
  </div>
  <div className="lg:col-span-5 flex items-center justify-center">
    <VictoryVault color={userLevel.bgColor} badges={completed} />
  </div>
</div>

      {/* Pass the plain data to AccordionMenu */}
      <AccordionMenu menuItems={menuItems} />
    </div>
  );
};

export default DashboardPage;
