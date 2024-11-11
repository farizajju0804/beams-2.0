import React from 'react'
import { currentUser } from '@/libs/auth'
import { checkConnectionGameStatus, getWordGame } from '@/actions/beams-today/connectionGame';
import ConnectionGame from '../_components/ConnectionGame';
import { redirect } from 'next/navigation';

interface ConnectionGamePageProps {
  params: { id: string };
}
const Page = async ({ params }: ConnectionGamePageProps) => {
  const { id } = params;
    const user = await currentUser()
    const connectionGame = await getWordGame(id)
    const completionStatus = await checkConnectionGameStatus(id)

    if(completionStatus.data?.isCompleted){
      redirect(`/beams-today/${id}`)
    }
    if(!connectionGame.success){
      return (
        <h1 className='mx-auto w-full text-5xl'>No Game Found</h1>
      )
    }
  

    if(connectionGame.data){
      return (
        <ConnectionGame
        id={connectionGame.data.id}
        beamsTodayId={id}
      image={connectionGame.data?.image}
      answer={connectionGame.data?.answer}
      title={connectionGame.data?.title}
      hint={connectionGame.data?.hint}
      username={user?.firstName}
    />
      )
    }
 
}

export default Page