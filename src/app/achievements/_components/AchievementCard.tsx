import React from 'react';
import { Button, Chip } from '@nextui-org/react';
import Image from 'next/image';
import { ArrowRight2 } from 'iconsax-react';
import AchievementCompletionButton from './AchievementCompletionButton';

interface AchievementCardProps {
  badgeName: string;
  badgeImageUrl: string;
  completedCount: number;
  totalCount: number;
  color: string;
  beamsToGain: number;
  actionText: string;
  taskDefinition: string;
  userFirstName: string;
  actionUrl: string;
  personalizedMessage: string;
  currentBeams: number;
}

const FALLBACK_BADGE_IMAGE = '/path/to/common-fallback-badge.png';

export default function AchievementCard({
  badgeName,
  badgeImageUrl,
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
  const isCompleted = completedCount === totalCount;
  const noProgress = completedCount === 0;
  const cardColor = noProgress ? '#a2a2a2' : color;

  return (
    <div className="max-w-sm mx-auto bg-background rounded-2xl overflow-hidden shadow-defined">
      <div className="relative h-20" style={{ backgroundColor: cardColor }}>
        <div className="absolute inset-0 opacity-30">
          <svg width="100%" height="100%">
            <pattern id="pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="15" fill="white" fillOpacity="0.2" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#pattern)" />
          </svg>
        </div>
        <Chip 
          size='sm'
          className="absolute top-5 right-3 shadow-defined bg-background text-grey-2">
          {`${beamsToGain} Beams`}
        </Chip>
      </div>
      <div className="relative px-6 pb-6">
        <div className="flex items-end -mt-12 mb-4">
          <div className="w-24 h-24 bg-background rounded-full flex items-center justify-center shadow-defined flex-shrink-0 mr-4">
            <Image
              src={noProgress ? FALLBACK_BADGE_IMAGE : badgeImageUrl}
              alt={`${badgeName} Badge`}
              width={80}
              height={80}
              className="rounded-full"
            />
          </div>
          <div className="flex items-center justify-end h-full">
            <h2 className="text-lg md:text-xl font-poppins font-semibold">{badgeName}</h2>
          </div>
        </div>
        <p className="text-grey-2 text-xs md:text-sm mt-4 mb-4">
          {taskDefinition}
        </p>
        <div className="mb-4">
          <div className="flex justify-between text-xs md:text-sm text-grey-2 mb-3">
            <span>
              {completedCount}/{totalCount} <span>{actionText}</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[...Array(totalCount)].map((_, index) => (
              <div
                key={index}
                className={`h-3 w-5 rounded-sm ${
                  index < completedCount ? '' : 'bg-gray-200'
                }`}
                style={{ backgroundColor: index < completedCount ? cardColor : undefined }}
                aria-hidden="true"
              ></div>
            ))}
          </div>
        </div>
        <div className="w-full flex items-center space-x-3">
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
          {noProgress && (
            <Button
              isIconOnly
              as="a"
              href={actionUrl}
              variant="light"
              size='sm'
              className="bg-transparent"
            >
              <ArrowRight2 size={20} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}