import React from 'react'
import { TrendingCardStack } from './_components/TrendingTopics'
import { NowShowing } from './_components/NowShowing'

const page = () => {
  return (
    <div className='flex flex-col w-full items-center justify-center'>
        <NowShowing/>
        <TrendingCardStack/>
        </div>
  )
}

export default page