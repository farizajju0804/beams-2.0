import React from 'react'
import FactOfTheDay from './_components/FactOfTheDay'
import { currentUser } from '@/libs/auth'
import { TrendingFacts } from './_components/TrendingFacts'
import { getCompletedFacts, getFactAndCompletionStatus, getTrendingFacts } from '@/actions/fod/fod'
import { cookies } from 'next/headers'

const page = async() => {
    const user:any = await currentUser()
    const cookieStore = cookies();
  const timeZone = cookieStore.get('client_time_zone')?.value || 'UTC';
  const now = new Date();
  const clientDate = now.toLocaleDateString('en-CA', { timeZone });
  const fact = await getFactAndCompletionStatus(user.id ,clientDate)
  const userId = user.id
  const initialData = await getTrendingFacts({
    clientDate: clientDate,
    page: 1,
    sortBy: "dateDesc",
    filterOption: "all",
    userId
  });
  const completed:string[] = await getCompletedFacts(user?.id)
 
  return (
    <div className="flex mx-auto max-w-[100vw] lg:max-w-5xl flex-col gap-2 md:gap-6 items-center justify-center w-full bg-background ">
      <h1 className="font-poppins my-3 md:my-0 text-2xl md:text-4xl uppercase font-semibold bg-purple text-yellow p-2">Beams Facts</h1>
      <FactOfTheDay userId={user?.id} facts={fact} />
      <TrendingFacts initialData={initialData} userId={userId} clientDate={clientDate}/>
        
    </div>
  )
}

export default page