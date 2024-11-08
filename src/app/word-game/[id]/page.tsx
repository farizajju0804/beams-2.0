import React from 'react'
import WordGuessGame from '../_components/WordGuessGame'
import { currentUser } from '@/libs/auth'
import { getWordGame } from '@/actions/beams-today/connectionGame';

interface WordGamePageProps {
  params: { id: string };
}
const Page = async ({ params }: WordGamePageProps) => {
  const { id } = params;
    const user = await currentUser()
    const wordGame = await getWordGame(id)
    
    if(!wordGame.success){
      return (
        <h1 className='mx-auto w-full text-5xl'>No Game Found</h1>
      )
    }
    

    if(wordGame.data){
      return (
        <WordGuessGame
        id={wordGame.data.id}
      image={wordGame.data?.image}
      answer={wordGame.data?.answer}
      title={wordGame.data?.title}
      hint={wordGame.data?.hint}
      username={user?.firstName}
    />
      )
    }
 
}

export default Page