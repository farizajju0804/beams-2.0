import React from 'react'
import Heading from './Heading'
import AchievementCard from './AchievementCard';

const achievements = [{
    id: "1",
    name: "Bronze Achiever",
    badgeImageUrl: "https://res.cloudinary.com/drlyyxqh9/image/upload/v1726574962/achievements/bronze-3d_jephy6.webp",
    task: "Reach Level 10",
    caption: "You're just getting started!",
    points: 300,
    completionStatus: false,
    progress: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    name: "Silver Achiever",
    badgeImageUrl: "https://res.cloudinary.com/drlyyxqh9/image/upload/v1726574962/achievements/silver-3d_ba5jkn.webp",
    task: "Reach Level 20",
    caption: "You're just getting started!",
    points: 300,
    completionStatus: false,
    progress: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]
const Achievements = () => {
  return (
    <div className='w-full flex-col'>
       

      <Heading heading="Achievements"/>
      <div className="md:px-0 px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {achievements.map((achievement:any,id:any) => 
        <AchievementCard key={id} achievement={achievement} />
        )}
    </div>
    <p className='mt-6 text-brand underline font-medium text-center mx-auto text-sm'>View Achievements progress here</p>

    </div>
  )
}

export default Achievements