import React from 'react' // Importing React
import UserLevelIndicator from './_components/UserLevelIndicator' // Component to display user's level
import { currentUser } from '@/libs/auth' // Function to get the current logged-in user
import { getAllLevels, getUserLevelAndBeams } from '@/actions/points/getAllLevels' // Functions to fetch levels and user's levels and beams
import { Achievement, UserAchievement } from '@prisma/client' // Importing types for Achievement and UserAchievement
import { getAllAchievements, getUserAchievements } from '@/actions/points/achievements' // Functions to fetch achievements
import AchievementsModal from './_components/AchievementsModal' // Modal for displaying achievements
import AchievementCard from './_components/AchievementCard' // Card component for displaying individual achievements
import { ReferFriendModal } from '@/components/ReferalModal' // Modal for referral functionality
import { getReferralStatus } from '@/actions/auth/getLatestUserData' // Function to get referral status of the user
import { referalBadgeName } from '@/constants/victoryConstants' // Constant for the referral badge name
import LevelsModal from './_components/LevelsModal'

// Main page component
const Page = async() => {
  // Fetch current user information
  const user:any = await currentUser();
  // Get all levels and user's beams and level
  const levels = await getAllLevels();
  const data = await getUserLevelAndBeams(user?.id);
  const beams = data.beams; // Extract beams from user data
  const level = data.level; // Extract level from user data
  
  // Get all achievements and user achievements
  const allAchievements:Achievement[] = await getAllAchievements();
  const userAchievements:UserAchievement[] = await getUserAchievements(user.id);
  
  // Fetch the user's referral status
  const referralStatus = await getReferralStatus();

  // Filter out "Growth Ambassador" achievement if the user has a referrer
  const filteredAchievements = allAchievements.filter(achievement => {
    if (achievement.name === referalBadgeName && 
        referralStatus?.referredById !== null && 
        referralStatus?.referralStatus !== null) {
      return false; // Exclude achievement if conditions are met
    }
    return true; // Include the achievement otherwise
  });

  return (
    <div className='flex flex-col w-full'>
      {/* Title for the achievements section */}
      <h1 className="w-fit mx-auto md:mx-8 font-poppins md:text-2xl uppercase font-semibold my-2 md:my-4 bg-yellow text-purple py-2 px-4">
        Achievements
      </h1>
      
      {/* Modal for levels */}
      <LevelsModal/>
      
      {/* User level indicator displaying current level and beams */}
      <UserLevelIndicator 
        levels={levels}
        beams={beams}
      />
      
      {/* Section for achievements */}
      <section id='victory'>
        {/* Modal for achievements */}
        <AchievementsModal />
        
        {/* Grid layout for achievement cards */}
        <div className='w-full px-6 md:px-8 pb-6 grid gap-16 lg:grid-cols-3 md:grid-cols-2 grid-cols-1'>
          {filteredAchievements.map((achievement) => {
            // Find the user's achievement status for the current achievement
            const userAchievement = userAchievements.find(ua => ua.achievementId === achievement.id);
            const progress = userAchievement?.progress || 0; // Get progress, default to 0 if not found
            const completed = userAchievement?.completionStatus || false; // Get completion status, default to false if not found
            
            return (
              <AchievementCard
                key={achievement.id}
                userType={user?.userType} // Pass user type
                userId={user?.id} // Pass user ID
                id={achievement.id} // Pass achievement ID
                isCompleted={completed} // Pass completion status
                badgeName={achievement.name} // Pass achievement name
                badgeImageUrl={achievement.badgeImageUrl} // Pass image URL for achievement badge
                completedCount={progress} // Pass completed count
                totalCount={achievement.totalCount} // Pass total count required for achievement
                color={achievement.color} // Pass color for achievement card
                beamsToGain={achievement.beamsToGain} // Pass beams rewarded for achievement
                actionText={achievement.actionText} // Pass action text for the achievement
                taskDefinition={achievement.task} // Pass task definition for achievement
                userFirstName={user.firstName} // Pass user's first name
                actionUrl={achievement.actionUrl || "/achievements"} // Pass action URL for achievement, default to achievements page
                personalizedMessage={achievement.personalizedMessage} // Pass personalized message for achievement
                currentBeams={beams} // Pass current beams
                currentLevel={level} // Pass current level
              />
            );
          })}
        </div>
      </section>
      {/* Modal for referring friends */}
      <ReferFriendModal />
    </div>
  )
}

export default Page;
