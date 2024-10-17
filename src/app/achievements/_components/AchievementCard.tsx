import React from 'react'
import Image from 'next/image'
import { ArrowRight2 } from 'iconsax-react'
import AchievementCompletionButton from './AchievementCompletionButton'
import { Button, Chip } from '@nextui-org/react'
import { Level, UserType } from '@prisma/client'

interface AchievementCardProps {
  id: string
  userType: UserType
  userId: string
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
  currentBeams: number,
  currentLevel: Level
}

const FALLBACK_BADGE_IMAGE = 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1727358975/achievements/badges/fallback-badge_ejxqbd.webp'

export default function AchievementCard({
  id,
  userType,
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
  userId,
  actionUrl,
  personalizedMessage,
  currentBeams,
  currentLevel
}: AchievementCardProps) {
  const noProgress = completedCount === 0
  const cardColor = noProgress ? '#a2a2a2' : color

  const MAX_VISIBLE_BARS = 10
  const progressPercentage = (completedCount / totalCount) * 100
  const visibleBars = totalCount > MAX_VISIBLE_BARS ? MAX_VISIBLE_BARS : totalCount
  const filledBars = totalCount > MAX_VISIBLE_BARS 
    ? Math.round((progressPercentage / 100) * MAX_VISIBLE_BARS)
    : completedCount

  return (
    <section id={id}>
    <div  className='flex w-full items-center md:justify-start justify-center'>
      <div className="w-80 max-w-sm bg-background rounded-2xl overflow-hidden shadow-defined">
        <div className="relative h-20" style={{ backgroundColor: cardColor }}>
          <div className="absolute inset-0 flex items-center px-4">
            <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center shadow-lg mr-4">
              <Image
                src={noProgress ? FALLBACK_BADGE_IMAGE : badgeImageUrl}
                alt={`${badgeName} Badge`}
                width={400}
                height={400}
                className="rounded-full w-16 h-12"
              />
            </div>
            <div className="flex flex-col gap-2">
            {/* <Image
                src={badgeName}
                alt={`${badgeName} Badge`}
                width={160}
                height={80}
                className="rounded-full  aspect auto"
              /> */}
              <h2 className="text-white font-poppins font-semibold text-base">{badgeName}</h2>
              <Chip
                  style={{
                    backgroundColor: isCompleted ? 'white' : undefined,
                    color: isCompleted ? color : undefined,
                  }}
                variant={'solid'}
                size="sm"
                className="font-semibold"
                classNames={
                  {
                    content : isCompleted ? "font-semibold" : 'font-medium'

                  }
                }
              >
                {beamsToGain} Beams
              </Chip>
            </div>
          </div>
        </div>
        <div className="px-4 py-2">
          <p className="text-grey-2 font-medium text-base mt-2 mb-4">{taskDefinition}</p>
          <div className="mb-4">
            <div className="flex items-center justify-start gap-4 font-semibold text-sm text-grey-2 mb-6">
             
              <div className="flex flex-wrap gap-1">
                {[...Array(visibleBars)].map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-4 rounded-sm ${
                      index < filledBars ? '' : 'bg-gray-200'
                    }`}
                    style={{ backgroundColor: index < filledBars ? cardColor : undefined }}
                    aria-hidden="true"
                  ></div>
                ))}
              </div>
              <span className='text-xs'>
                {completedCount}/{totalCount}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-start mb-2 w-full">
            <AchievementCompletionButton
              badgeName={badgeName}
              userId={userId}
              achievementId={id}
              userType={userType}
              badgeImageUrl={badgeImageUrl}
              color={color}
              beamsToGain={beamsToGain}
              userFirstName={userFirstName}
              personalizedMessage={personalizedMessage}
              currentBeams={currentBeams}
              currentLevel={currentLevel}
              isCompleted={isCompleted}
            />
           {!isCompleted && ( <Button  as="a" href={actionUrl}  size='sm' className="bg-text min-w-0 py-2 px-3 text-background" > 
            Take Me There </Button> )} 
          </div>
        </div>
      </div>
    </div>
    </section>
  )
}