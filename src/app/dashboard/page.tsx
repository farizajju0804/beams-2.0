
import React from 'react'
import LearningOverview from './_components/LearningOverview'
import { getUserAnalyticsById } from '@/actions/dashboard/timeSpent'
import { currentUser } from '@/libs/auth'
import { getPollDataByUserId } from '@/actions/dashboard/pollData'
import { getWatchedBeamsTodayContent } from '@/actions/dashboard/watchedContent'
import LevelBeams from './_components/LevalBeams'
import { getUserLevelAndHistory } from '@/actions/dashboard/getUserLevelAndRecentHistory'
import Achievements from './_components/Achievements'
import Leaderboard from './_components/Leaderboard'


const users = [
  {
    id: "1",
    name: "User 1",
    score: 2430,
    avatarUrl: "https://res.cloudinary.com/drlyyxqh9/image/upload/v1720690887/Beams%20today/thumbnails/wireless_charging_aqczlw.png",
    rank: 1
  },
  {
    id: "2",
    name: "User 2",
    score: 1847,
    avatarUrl: "https://res.cloudinary.com/drlyyxqh9/image/upload/v1720690800/Beams%20today/thumbnails/ear_tbxkpk.png",
    rank: 2
  },
  {
    id: "3",
    name: "User 3",
    score: 1674,
    avatarUrl: "https://res.cloudinary.com/drlyyxqh9/image/upload/v1720690681/Beams%20today/thumbnails/headphnr_cqiulp.png",
    rank: 3
  }
];

const user2 = 
  {
    id: "10",
    name: "User 1",
    score: 2430,
    avatarUrl: "https://res.cloudinary.com/drlyyxqh9/image/upload/v1720690887/Beams%20today/thumbnails/wireless_charging_aqczlw.png",
    rank: 13
  }

const page = async () => {
  const user:any = await currentUser()
  console.log("user",user)
  const userAnalytics:any = await getUserAnalyticsById(user.id)
  const pollData:any = await getPollDataByUserId(user.id)
  const watchedData:any = await getWatchedBeamsTodayContent(user.id)
  const { userLevel, beams, recentActivities, accumulatedPoints } = await getUserLevelAndHistory(user.id);
  console.log(userLevel, beams, recentActivities, accumulatedPoints )
  return (
    <div className='flex flex-col md:px-8 gap-12 py-4'>
      <LearningOverview
            userAnalytics={userAnalytics}
            pollData={pollData}
            watchedData={watchedData}
          />
           <LevelBeams
        userLevel={userLevel}  // Pass user level and progress
        beams={beams}  // Pass beams (points)
        recentActivities={recentActivities}  // Pass recent activities
        accumulatedPoints={accumulatedPoints} 
      />
      <Leaderboard currentUser={user2} users={users} />
      <Achievements/>
    </div>
  )
}

export default page