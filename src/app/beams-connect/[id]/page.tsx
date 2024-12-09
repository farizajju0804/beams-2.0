import React from 'react'
import { currentUser } from '@/libs/auth'
import { checkConnectionGameStatus, getGamePopupPreference, getWordGameById } from '@/actions/connection/connectionGame';
import ConnectionGameWrapper from '../_components/ConnectionGameWrapper';

interface ConnectionGamePageProps {
  params: { id: string };
}
const Page = async ({ params }: ConnectionGamePageProps) => {
  const { id } = params;
    const user = await currentUser()
    const connectionGame = await getWordGameById(id)
    const completionStatus = await checkConnectionGameStatus(id)
    const preference = await getGamePopupPreference()

    if(!connectionGame.success){
      return (
        <h1 className='mx-auto w-full text-5xl'>No Game Found</h1>
      )
    }
  

    if(connectionGame.data){
      return (
        <ConnectionGameWrapper
        id={connectionGame.data.id}
        beamsTodayId={id}
        firstImage={connectionGame.data?.firstImage}
        secondImage={connectionGame.data?.secondImage}
        thirdImage={connectionGame.data.thirdImage}
        referenceLink={connectionGame.data.referenceLink}
        answer={connectionGame.data?.answer}
        title={connectionGame.data?.title}
        hint={connectionGame.data?.hint}
        username={user?.firstName}
        isCompleted={completionStatus.data?.isCompleted}
        answerExplanation={connectionGame.data.answerExplantion}
        solutionPoints={connectionGame.data.solutionPoints}
        gameDate={connectionGame.data.date}
        letterChoicesNonStudent={connectionGame.data.letterChoiceNonStudent}
        letterChoicesStudent={connectionGame.data.letterChoiceStudent}
        popupPreference={preference}
      />
      )
    }
 
}

export default Page