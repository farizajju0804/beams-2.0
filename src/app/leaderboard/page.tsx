import React from 'react';

// Importing the current user information from the auth library
import { currentUser } from '@/libs/auth';

// Importing the Leaderboard component
import Leaderboard from './_components/Leaderboard';

// Importing actions to fetch leaderboard data and previous week's top 3 entries
import { getLeaderboardData } from '@/actions/dashboard/getLeaderBoard';
import { getTop3EntriesForMostRecentWeek } from '@/actions/points/getPreviousLeaderboard';

// The main Page component, which is an async function
const Page = async () => {
  // Fetch the current user's information
  const user: any = await currentUser();

  // Fetch leaderboard data and top 3 entries for the previous week using Promise.all for concurrent fetching
  const [
    leaderboardData,
    previousWeekTop3
  ]: any = await Promise.all([
    getLeaderboardData(user?.id, user?.userType,'2024-11-04T14:00:00.000+00:00'), // Fetch leaderboard data based on user ID and user type
    getTop3EntriesForMostRecentWeek(user?.userType, user?.id,'2024-11-04T00:00:00.000+00:00') // Fetch top 3 entries for the most recent week
  ]);



  return (
    <div className='flex flex-col md:px-8 gap-12 py-4'>
      {/* Rendering the Leaderboard component and passing necessary props */}
      <Leaderboard
        userId={user?.id} // Current user's ID
        initialData={leaderboardData} // Leaderboard data fetched
        userType={user?.userType} // Current user's type
        previous={previousWeekTop3} // Top 3 entries from the previous week
      />
    </div>
  );
};

export default Page; // Exporting the Page component for use in other parts of the application
