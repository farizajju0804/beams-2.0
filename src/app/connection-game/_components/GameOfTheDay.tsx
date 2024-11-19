'use client'

import React  from "react"
import { Button} from "@nextui-org/react"
import { useRouter } from 'next/navigation'
import { BiSolidJoystick } from "react-icons/bi"
import ConnectionModal from "./ConnectionModal"
import DateComponent from "./DateComponent"

interface GameOfTheDayProps {
  game: {
    id: string
    title: string
    date: Date
    hint: string
    thumbnail : string
  }
  username?: string,
  isCompleted : boolean | undefined
}

export default function GameOfTheDay({ 
  game,
  username,
  isCompleted
}: GameOfTheDayProps) {
  const router = useRouter()

  const handlePlayGame = () => {
    router.push(`/connection-game/${game?.id}`)
  }

  return (
    
    <div className="w-full max-w-4xl mx-auto pb-4">
      <div
  
      >
        <ConnectionModal/>
        <div 
      className="relative overflow-hidden"
      style={{
        backgroundImage: `url(${game.thumbnail})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '400px'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
      <div className="relative z-10 flex flex-col h-full justify-between py-6 text-white">
        <div className="w-full flex justify-end">
          <div className="inline-block px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm">
            <DateComponent date={game.date.toISOString().split('T')[0]} />
          </div>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-4">
            {game.title}
          </h2>
        </div>
        <div className="flex justify-center mb-2">
        <Button
          endContent={<BiSolidJoystick  />}
          className="font-semibold text-white text-base md:text-lg p-4 lg:px-8 py-6"
          size="md"
          color={isCompleted ?  'success' : 'primary' }
          onClick={handlePlayGame}
          >
          {isCompleted ?  'View Solution' : 'Play Now' }
          </Button>
        </div>
      </div>
    </div>

      </div>
    </div>
  )
}


