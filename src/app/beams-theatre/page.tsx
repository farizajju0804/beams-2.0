import React from 'react'
import TrendingCardStack  from './_components/TrendingTopics'
import NowShowing  from './_components/NowShowing'
import BrowsebySection from './_components/BrowsebySection'
import Header from './_components/Header'

const page = () => {
  return (
    <div className='flex flex-col w-full items-center gap-12 justify-center'>
        <Header/>
        <TrendingCardStack/>
        <BrowsebySection/>
        </div>
  )
}

export default page