import React from 'react'; // Importing React
import LearningOverview from './_components/LearningOverview'; // Importing sub-components
import { getUserAnalyticsById } from '@/actions/dashboard/timeSpent'; // Action to fetch user analytics
import { currentUser } from '@/libs/auth'; // Auth utility to get current user
import { getPollDataByUserId } from '@/actions/dashboard/pollData'; // Action to fetch poll data
import { getWatchedBeamsTodayContent } from '@/actions/dashboard/watchedContent'; // Action to fetch watched content
import { getUserLevelAndHistory } from '@/actions/dashboard/getUserLevelAndRecentHistory'; // Action to fetch user level and history
import LevelBeams from './_components/LevalBeams'; // Importing LevelBeams component
import ReferralSection from './_components/Referrals'; // Importing ReferralSection component
import { getReferredUsers } from '@/actions/dashboard/getReferredUsers'; // Action to fetch referred users
import VictoryVault from './_components/VictoryVault'; // Importing VictoryVault component
import { getCompletedAchievements } from '@/actions/points/achievements'; // Action to fetch completed achievements
import ProfilePictureForm from '@/components/ProfilePictureForm'; // Importing ProfilePictureForm component
import LevelDetails from './_components/LevelDetails'; // Importing LevelDetails component
import AccordionMenu from './_components/AccordionMenu'; // Importing AccordionMenu component
import { Activity, Book, Coin1, User } from 'iconsax-react'; // Importing icons
import VibrantBeamsBreakdown from './_components/PieChart'; // Importing VibrantBeamsBreakdown component
import { getReferralStatus } from '@/actions/auth/getLatestUserData'; // Action to fetch referral status


// Main DashboardPage functional component
const DashboardPage = async () => {
  // Fetching the current user
  const user: any = await currentUser();

  // Using Promise.all to fetch multiple data sources concurrently
  const [
    userAnalytics, // Analytics data for the user
    pollData, // Poll data for the user
    watchedData, // Data for content watched by the user
    { userLevel, beams, recentActivities, top20RecentActivities, accumulatedPoints }, // User level and history data
    referred, // Referred users data
    completed, // Completed achievements data
    referralStatus // Current referral status
  ]: any = await Promise.all([
    getUserAnalyticsById(user?.id), // Fetch user analytics by ID
    getPollDataByUserId(user?.id), // Fetch poll data by user ID
    getWatchedBeamsTodayContent(user?.id), // Fetch watched content by user ID
    getUserLevelAndHistory(user?.id), // Fetch user level and recent history
    getReferredUsers(user?.id), // Fetch referred users by user ID
    getCompletedAchievements(user?.id), // Fetch completed achievements for user
    getReferralStatus() // Fetch current referral status
  ]);

  // Construct the menuItems array based on referral status
  const menuItems = [
    // Check if user is not referred and doesn't have a referral status
    ...(referralStatus?.referredById == null && referralStatus?.referralStatus == null
      ? [
          {
            title: "My Referrals", // Menu item title
            icon: <User variant="Bold" className="h-5 w-5 text-grey-2" />, // Icon for the item
            content: <ReferralSection referrals={referred} />, // Content for the item
          },
        ]
      : []),
    {
      title: "My Learning", // Menu item title for learning overview
      icon: <Book variant="Bold" className="h-5 w-5 text-grey-2" />, // Icon for learning
      content: <LearningOverview userAnalytics={userAnalytics} pollData={pollData} watchedData={watchedData} />, // Content for learning overview
    },
    {
      title: "My Beams", // Menu item title for beams breakdown
      icon: <Coin1 variant="Bold" className="h-5 w-5 text-grey-2" />, // Icon for beams
      content: (
        <VibrantBeamsBreakdown
          beams={beams} // Data for beams
          accumulatedPoints={accumulatedPoints} // Total points
        />
      ),
    },
    {
      title: "My Activity", // Menu item title for user activity
      icon: <Activity variant="Bold" className="h-5 w-5 text-grey-2" />, // Icon for activity
      content: (
        <LevelBeams
          userLevel={userLevel} // User level data
          beams={beams} // Beams data
          recentActivities={top20RecentActivities} // Recent activities data
          accumulatedPoints={accumulatedPoints} // Total points
        />
      ),
    },
  ];

  // Return the dashboard layout
  return (
    <div className='w-full flex flex-col px-6 md:px-8 gap-4 py-4'>
      <div className="w-full flex flex-col items-start"> {/* Column for title and underline */}
        <h1 className="text-lg md:text-2xl text-text font-poppins font-semibold mb-[1px]">Dashboard</h1> {/* Title */}
        <div className="border-b-2 border-brand mb-3 w-[60px]"></div> {/* Underline for title */}
      </div>
      <div className="grid gap-8 w-full grid-cols-1 md:grid-cols-1 lg:grid-cols-12 md:gap-8">
        <div className="lg:col-span-2">
          <ProfilePictureForm user={user} /> {/* Profile picture form */}
        </div>
        <div className="lg:col-span-5 flex items-center justify-center">
          <LevelDetails userLevel={userLevel} beams={beams} /> {/* Level details component */}
        </div>
        <div className="lg:col-span-5 flex items-center justify-center">
          <VictoryVault color={userLevel.bgColor} badges={completed} /> {/* Victory vault component */}
        </div>
      </div>

      {/* Render the AccordionMenu with constructed menu items */}
      <AccordionMenu menuItems={menuItems} />
    </div>
  );
};

export default DashboardPage; // Exporting the DashboardPage component
