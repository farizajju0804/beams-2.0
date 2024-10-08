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
      <h1 className="font-poppins my-3 md:my-0 text-2xl md:text-4xl font-semibold bg-purple text-yellow p-2">Beams Facts</h1>
      <FactOfTheDay userId={user?.id} />
      <TrendingFacts completedFacts={completed}/>
        
    </div>
  )
}

export default page