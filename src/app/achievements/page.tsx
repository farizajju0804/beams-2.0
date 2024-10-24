
import React from 'react'

import UserLevelIndicator from './_components/UserLevelIndicator'
import {  currentUser } from '@/libs/auth'
import { getAllLevels, getUserLevelAndBeams } from '@/actions/points/getAllLevels'
import LevelsModal from './_components/LevelsModal'
import { Achievement, UserAchievement } from '@prisma/client'
import { getAllAchievements, getUserAchievements } from '@/actions/points/achievements'
import AchievementsModal from './_components/AchievementsModal'
import AchievementCard from './_components/AchievementCard'
import { ReferFriendModal } from '@/components/ReferalModal'




const page = async() => {
  const user:any = await currentUser();
  const levels = await getAllLevels();
  const data = await getUserLevelAndBeams(user?.id);
  const beams = data.beams
  const level = data.level
  const allAchievements:Achievement[] = await getAllAchievements();
  const userAchievements:UserAchievement[] = await getUserAchievements(user.id);

  return (
    <div className='flex flex-col w-full'>
      <h1 className="w-fit mx-auto md:mx-8 font-poppins md:text-2xl uppercase  font-semibold my-2 md:my-4 bg-yellow text-purple py-2 px-4 ">Achievements</h1>
        <LevelsModal/>
        <UserLevelIndicator levels={levels} 
        beams={beams} 
        />

        <section id='victory'>
        <AchievementsModal />
        <div className='w-full px-6 md:px-8 pb-6 grid gap-16 lg:grid-cols-3 md:grid-cols-2 grid-cols-1'>
        {allAchievements.map((achievement) => {
          const userAchievement = userAchievements.find(ua => ua.achievementId === achievement.id);
          const progress = userAchievement?.progress || 0;
          const completed = userAchievement?.completionStatus || false
          return (
            <AchievementCard
              key={achievement.id}
              userType={user?.userType}
              userId={user?.id}
              id={achievement.id}
              isCompleted={completed}
              badgeName={achievement.name}
              badgeImageUrl={achievement.badgeImageUrl}
              completedCount={progress}
              totalCount={achievement.totalCount}
              color={achievement.color}
              beamsToGain={achievement.beamsToGain}
              actionText={achievement.actionText}
              taskDefinition={achievement.task}
              userFirstName={user.firstName}
              actionUrl={achievement.actionUrl || "/achievements"}
              personalizedMessage={achievement.personalizedMessage}
              currentBeams={beams}
              currentLevel={level}
            />
          );
        })}
    </div>
    </section>
    <ReferFriendModal
    />
   </div>
  )
}

export default page