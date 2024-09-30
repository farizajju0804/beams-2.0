import Sidebar from '@/components/Sidebar'
import TopNav from '@/components/TopNav'
import React from 'react'
import Heading from '../dashboard/_components/Heading'
import UserLevelIndicator from './_components/UserLevelIndicator'
import {  currentUser } from '@/libs/auth'
import { getAllLevels, getUserBeams } from '@/actions/points/getAllLevels'
import LevelsModal from './_components/LevelsModal'
import { Divider } from '@nextui-org/react'
import { Achievement, UserAchievement } from '@prisma/client'
import { getAllAchievements, getUserAchievements } from '@/actions/points/achievements'

import AchievementsModal from '../achievements/_components/AchievementsModal'
import AchievementCard from '../achievements/_components/AchievementCard'

const page = async() => {
  const user:any = await currentUser();
  const levels = await getAllLevels();
  const beams = await getUserBeams(user?.id);
  const allAchievements:Achievement[] = await getAllAchievements();
  const userAchievements:UserAchievement[] = await getUserAchievements(user.id);

  return (
    <div className='flex flex-col w-full'>
        <LevelsModal/>
        <UserLevelIndicator levels={levels} beams={beams.beams}/>
        <Divider className='my-4'/>
        <section id='achievements'>
        <AchievementsModal />
        <div className='w-full pb-6 grid gap-12 lg:grid-cols-3 md:grid-cols-2 grid-cols-1'>
        {allAchievements.map((achievement) => {
          const userAchievement = userAchievements.find(ua => ua.achievementId === achievement.id);
          const progress = userAchievement?.progress || 0;
          const completed = userAchievement?.completionStatus || false
          return (
            <AchievementCard
              key={achievement.id}
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
              currentBeams={beams.beams} 
            />
          );
        })}
    </div>
    </section>
   </div>
  )
}

export default page