import { checkConnectionGameStatus, getRecentGames, getWordGame } from '@/actions/connection/connectionGame';
import { cookies } from 'next/headers';
import React from 'react'
import GameOfTheDay from './_components/GameOfTheDay';
import { currentUser } from '@/libs/auth';
import RecentGames from './_components/RecentGames';


const page = async() => {
const user:any = await currentUser()
    const cookieStore = cookies();
  const timeZone = cookieStore.get('client_time_zone')?.value || 'UTC';
  const now = new Date();
  const clientDate = now.toLocaleDateString('en-CA', { timeZone });

  const response = await getRecentGames({
    clientDate: clientDate,
    page: 1,
    limit: 9,
    sortBy: "dateDesc",
    filterOption: "all",
    userId: user?.id
  });

  const initialData = {
    games: response.success && response.games ? response.games : [],
    totalPages: response.totalPages || 1,
    currentPage: response.currentPage || 1
  };

  const game = await getWordGame(clientDate)
  let completionStatus
  if(game.data){
  completionStatus = await checkConnectionGameStatus(game.data?.id)
  }
  return (
         
    <div className="flex mx-auto max-w-[100vw] lg:max-w-5xl flex-col gap-2 md:gap-6 items-center justify-center w-full bg-background ">
      <h1 className="font-poppins text-2xl md:text-4xl uppercase font-semibold bg-success text-black p-2">Beams Connect</h1>
      {game.data && game.success &&
      <GameOfTheDay game={game.data} isCompleted={completionStatus?.data?.isCompleted} username={user.firstName} />
      }
      {initialData && 
      <RecentGames
      initialData={initialData}
      userId={user?.id}
      clientDate={clientDate}
    />
      }
      </div>
  )
}

export default page