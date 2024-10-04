import React from 'react'
import FactOfTheDay from './_components/FactOfTheDay'
import { currentUser } from '@/libs/auth'
import { TrendingFacts } from './_components/TrendingFacts'
import { getCompletedFacts } from '@/actions/fod/fod'

const page = async() => {
    const user:any = await currentUser()
    const completed:string[] = await getCompletedFacts(user?.id)
  return (
    <div className="flex mx-auto max-w-[100vw] lg:max-w-5xl flex-col gap-2 md:gap-6 items-center justify-center w-full bg-background ">

      <FactOfTheDay userId={user?.id} />
      <TrendingFacts completedFacts={completed}/>
        
    </div>
  )
}

export default page