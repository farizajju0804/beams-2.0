import React from 'react'
import TrendingCardStack  from './_components/TrendingTopics'
import BrowsebySection from './_components/BrowsebySection'
import Header from './_components/Header'
import SearchBar from './_components/SearchBar'

const page = () => {
  return (
    <div className='flex flex-col w-full items-center gap-4 md:gap-8 justify-center'>
        <Header/>
        <SearchBar />
        <TrendingCardStack/>
        <BrowsebySection/>
        </div>
  )
}

export default page