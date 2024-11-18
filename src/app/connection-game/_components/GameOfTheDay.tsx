'use client'

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardBody, CardFooter, CardHeader} from "@nextui-org/react"
import { Calendar, Game } from 'iconsax-react'
import { useRouter } from 'next/navigation'
import { BiSolidJoystick } from "react-icons/bi"


interface GameOfTheDayProps {
  game: {
    id: string
    title: string
    date: Date
    hint: string
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
  const [isHovering, setIsHovering] = useState(false)

  const handlePlayGame = () => {
    router.push(`/connection-game/${game?.id}`)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date)
  }

  return (
    
    <div className="w-full max-w-4xl mx-auto px-4 pb-4">
      <div
  
      >
        <Card className="overflow-hidden bg-background shadow-defined border-2 border-primary/20">
          <CardHeader className="space-y-1">
            <div className="w-full flex flex-col md:flex-row gap-4 items-center justify-between">
              <h4 className="text-2xl font-bold text-primary">Game of the Day</h4>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{formatDate(game.date)}</span>
              </div>
            </div>
          </CardHeader>
          <CardBody className="grid gap-4">
            <div
              className="text-center md:py-4"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-4">
                {game.title}
              </h2>

            </div>
          </CardBody>
          <CardFooter className="flex justify-center pb-8">
         
              <Button
                onClick={handlePlayGame}
                className="font-semibold text-xl px-8 py-6 bg-primary text-white"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                 <BiSolidJoystick className="mr-2 h-5 w-5" />
               {isCompleted ?  'View Solution' : 'Play Now' }
              </Button>
            </CardFooter>
        </Card>
      </div>
    </div>
  )
}