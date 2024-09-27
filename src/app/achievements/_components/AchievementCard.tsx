import React from 'react'

import Image from 'next/image'
import { ArrowRight2 } from 'iconsax-react'
import AchievementCompletionButton from './AchievementCompletionButton'
import { Button, Chip } from '@nextui-org/react'

interface AchievementCardProps {
  badgeName: string
  badgeImageUrl: string
  isCompleted: boolean
  completedCount: number
  totalCount: number
  color: string
  beamsToGain: number
  actionText: string
  taskDefinition: string
  userFirstName: string
  actionUrl: string
  personalizedMessage: string
  currentBeams: number
}

const FALLBACK_BADGE_IMAGE = 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1727358975/achievements/badges/fallback-badge_ejxqbd.webp'

export default function Component({
  badgeName,
  badgeImageUrl,
  isCompleted,
  completedCount,
  totalCount,
  color,
  beamsToGain,
  actionText,
  taskDefinition,
  userFirstName,
  actionUrl,
  personalizedMessage,
  currentBeams
}: AchievementCardProps) {
  const noProgress = completedCount === 0
  const cardColor = noProgress ? '#a2a2a2' : color

  return (
    <div className="w-80 max-w-sm mx-auto bg-background rounded-2xl overflow-hidden shadow-lg">
      <div className="relative h-40" style={{ backgroundColor: cardColor }}>
        <div className="absolute inset-0 opacity-30">
          <svg width="100%" height="100%">
            <pattern id="pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="20" y2="20" stroke="white" strokeWidth="2" strokeOpacity="0.2" />
              <line x1="20" y1="0" x2="0" y2="20" stroke="white" strokeWidth="2" strokeOpacity="0.2" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#pattern)" />
          </svg>
        </div>
       
       
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 bg-background rounded-full flex items-center justify-center shadow-lg">
            <Image
              src={noProgress ? FALLBACK_BADGE_IMAGE : badgeImageUrl}
              alt={`${badgeName} Badge`}
              width={120}
              height={120}
              className="rounded-full"
            />
          </div>
        </div>
      </div>
      <div className="px-4 py-4">
        <p className="text-grey-2 text-sm mt-2 mb-4">{taskDefinition}</p>
        <div className="mb-4">
          <div className="flex justify-between font-semibold text-sm text-grey-2 mb-2">
            <span>
              {completedCount}/{totalCount} <span>{actionText}</span>
            </span>
            <div className={` rounded-full p-1  text-xs  shadow-defined ${noProgress ? 'bg-text text-background' : 'bg-background text-text' }`} >
           {`${beamsToGain} Beams`} 

        </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {[...Array(totalCount)].map((_, index) => (
              <div
                key={index}
                className={`h-2 w-4 rounded-sm ${
                  index < completedCount ? '' : 'bg-gray-200'
                }`}
                style={{ backgroundColor: index < completedCount ? cardColor : undefined }}
                aria-hidden="true"
              ></div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap justify-between items-center w-full">
          <AchievementCompletionButton
            badgeName={badgeName}
            badgeImageUrl={badgeImageUrl}
            color={color}
            beamsToGain={beamsToGain}
            userFirstName={userFirstName}
            personalizedMessage={personalizedMessage}
            currentBeams={currentBeams}
            isCompleted={isCompleted}
          />
         {noProgress && ( <Button isIconOnly as="a" href={actionUrl} variant="light" size='sm' className="bg-transparent" > 
          <ArrowRight2 size={20} /> </Button> )} 
        </div>
      </div>
    </div>
  )
}