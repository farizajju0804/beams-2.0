"use client"

import React, { useState } from "react"
import Image from "next/image"
import ScratchCard from "@/components/ScratchCard"


interface FactOfTheDayProps {
  scratchImage: string
  finalImage: string
  userId: string
}

const FactOfTheDay: React.FC<FactOfTheDayProps> = ({ scratchImage, finalImage, userId }) => {
  const [isRevealed, setIsRevealed] = useState(false)

  return (
    <div className="w-full py-1 text-left relative max-w-6xl mx-auto">
      {/* Heading */}
      <div className="pl-6 lg:pl-0 flex flex-col items-start lg:items-center">
        <h1 className="text-lg md:text-2xl text-text font-poppins font-semibold mb-[1px]">Fact of the Day</h1>
        <div className="border-b-2 border-brand mb-6 w-full" style={{ maxWidth: '10%' }}></div>
      </div>

      {/* Main Content */}
      {finalImage && scratchImage ? (
        <div className="relative w-full max-w-sm mx-auto h-96  rounded-lg">
          <ScratchCard
            scratchImage={scratchImage}
            finalImage={finalImage}
            onReveal={() => setIsRevealed(true)}
          >
          
          </ScratchCard>
          
          {isRevealed && (
            <Image
              src={finalImage}
              alt={'fact'}
              priority={true}
              fill={true}
              style={{ objectFit: "cover" }}
              className="z-2 aspect-auto md:aspect-video lg:rounded-lg"
            />
          )}
        </div>
      ) : (
        // Message displayed if no topic is available
        <p className="text-lg text-left md:text-center font-semibold text-grey-500 pl-6 md:pl-0">
          No fact available for today
        </p>
      )}
    </div>
  )
}

export default FactOfTheDay