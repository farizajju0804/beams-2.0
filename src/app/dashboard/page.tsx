
import Sidebar from '@/components/Sidebar'
import TopNav from '@/components/TopNav'
import React from 'react'
import LearningOverview from './_components/LearningOverview'
import { getUserAnalyticsById } from '@/actions/dashboard/timeSpent'
import { currentUser } from '@/libs/auth'
import { getPollDataByUserId } from '@/actions/dashboard/pollData'
import { getWatchedBeamsTodayContent } from '@/actions/dashboard/watchedContent'
import LevelBeams from './_components/LevalBeams'


const page = async () => {
  const user:any = await currentUser()
  console.log("user",user)
  const userAnalytics:any = await getUserAnalyticsById(user.id)
  const pollData:any = await getPollDataByUserId(user.id)
  const watchedData:any = await getWatchedBeamsTodayContent(user.id)
  console.log(watchedData)
  return (
    <div className='flex flex-col md:px-8 gap-12 py-4'>
      <LearningOverview
            userAnalytics={userAnalytics}
            pollData={pollData}
            watchedData={watchedData}
          />
          <LevelBeams/>
    </div>
  )
}

export default page