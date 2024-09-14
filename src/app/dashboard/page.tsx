import Sidebar from '@/components/Sidebar'
import TopNav from '@/components/TopNav'
import React from 'react'
import LearningOverview from './_components/LearningOverview'
import { getUserAnalyticsById } from '@/actions/dashboard/timeSpent'
import { currentUser } from '@/libs/auth'
import { getPollDataByUserId } from '@/actions/dashboard/pollData'
import { getWatchedBeamsTodayContent } from '@/actions/dashboard/watchedContent'


const page = async () => {
  const user:any = await currentUser()
  const userAnalytics:any = await getUserAnalyticsById(user.id)
  const pollData:any = await getPollDataByUserId(user.id)
  const watchedData:any = await getWatchedBeamsTodayContent(user.id)
  console.log(pollData)
  return (
    <div className='flex flex-col md:px-8 py-4'>
      <LearningOverview
            userAnalytics={userAnalytics}
            pollData={pollData}
            watchedData={watchedData}
          />

    </div>
  )
}

export default page