import React from 'react'
import FactOfTheDay from './_components/FactOfTheDay'
import { currentUser } from '@/libs/auth'
import { TrendingFacts } from './_components/TrendingFacts'

const page = async() => {
    const user:any = await currentUser()
  return (
    <div className="flex mx-auto max-w-[100vw] lg:max-w-5xl flex-col gap-2 md:gap-6 items-center justify-center w-full bg-background ">

      <FactOfTheDay userId={user?.id} />
      <TrendingFacts/>
        
    </div>
  )
}

export default page