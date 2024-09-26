
import React from 'react'

import {  currentUser } from '@/libs/auth'
import { getAllLevels, getUserBeams } from '@/actions/points/getAllLevels'
import AchievementsModal from './_components/AchievementsModal'
import AchievementCard from './_components/AchievementCard'

const page = async() => {
  const user:any = await currentUser();


  return (
    <div className='flex flex-col w-full'>
        <AchievementsModal/>
        <div className='pb-6 grid gap-12 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 '>
        <AchievementCard
  badgeName="Week Warrior"
  badgeImageUrl="/path/to/badge.png"
  completedCount={0}
  totalCount={5}
  color="#4CAF50"
  beamsToGain={100}
  actionText="logged in"
  taskDefinition="Login every day for a consecutive week."
  userFirstName="John"
  actionUrl="/path/to/action"
  personalizedMessage="The Week Warrior!"
  currentBeams={500}
/>

<AchievementCard
  badgeName="Week Warrior"
  badgeImageUrl="https://res.cloudinary.com/drlyyxqh9/image/upload/v1727358628/achievements/badges/week-warrior_on888b.webp"
  completedCount={4}
  totalCount={5}
  color="#4CAF50"
  beamsToGain={100}
  actionText="logged in"
  taskDefinition="Login every day for a consecutive week."
  userFirstName="John"
  actionUrl="/path/to/action"
  personalizedMessage="The Week Warrior!"
  currentBeams={500}
/>
<AchievementCard
  badgeName="Week Warrior"
  badgeImageUrl="https://res.cloudinary.com/drlyyxqh9/image/upload/v1727358628/achievements/badges/week-warrior_on888b.webp"
  completedCount={5}
  totalCount={5}
  color="#435cff"
  beamsToGain={100}
  actionText="logged in"
  taskDefinition="Login every day for a consecutive week."
  userFirstName="John"
  actionUrl="/path/to/action"
  personalizedMessage="The Week Warrior!"
  currentBeams={500}
/>

        </div>

    </div>
  )
}

export default page