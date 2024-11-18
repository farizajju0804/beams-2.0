import React from 'react'
import { currentUser } from '@/libs/auth'
import { checkConnectionGameStatus, getWordGameById } from '@/actions/connection/connectionGame';
import ConnectionGame from '../_components/ConnectionGame';
import { redirect } from 'next/navigation';

interface ConnectionGamePageProps {
  params: { id: string };
}
const Page = async ({ params }: ConnectionGamePageProps) => {
  const { id } = params;
    const user = await currentUser()
    const connectionGame = await getWordGameById(id)
    const completionStatus = await checkConnectionGameStatus(id)
    
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
      isCompleted={completionStatus.data?.isCompleted}
      answerExplanation={connectionGame.data.answerExplantion}
      solutionPoints={connectionGame.data.solutionPoints}
    />
      )
    }
 
}

export default Page