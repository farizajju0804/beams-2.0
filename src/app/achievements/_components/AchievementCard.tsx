'use client'; // Indicates that this component is a client-side component

import React from 'react'; // Importing React library
import Image from 'next/image'; // Importing Image component from Next.js
import AchievementCompletionButton from './AchievementCompletionButton'; // Importing custom button component
import { Button, Chip, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@nextui-org/react'; // Importing UI components from NextUI
import { Level, UserType } from '@prisma/client'; // Importing types for Level and UserType
import { useReferralModalStore } from '@/store/referralStore'; // Importing the referral modal store

// Defining the props for AchievementCard component
interface AchievementCardProps {
  id: string; // Achievement ID
  userType: UserType; // Type of the user
  userId: string; // ID of the user
  badgeName: string; // Name of the achievement badge
  badgeImageUrl: string; // URL of the badge image
  isCompleted: boolean; // Indicates if the achievement is completed
  completedCount: number; // Count of tasks completed
  totalCount: number; // Total tasks to complete for the achievement
  color: string; // Color for the badge background
  beamsToGain: number; // Number of beams to gain for the achievement
  actionText: string; // Action text for the button
  taskDefinition: string; // Description of the task for the achievement
  userFirstName: string; // First name of the user
  actionUrl: string; // URL for the action button
  personalizedMessage: string; // Personalized message for the button
  currentBeams: number; // Current beams of the user
  currentLevel: Level; // Current level of the user
}

// The AchievementCard component
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
  // Determine if no progress has been made
  const noProgress = completedCount === 0;
  const cardColor = noProgress ? '#a2a2a2' : color; // Set card color based on progress
  const openReferralModal = useReferralModalStore(state => state.openModal); // Get the function to open the referral modal
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure(); // Modal control hooks
  const MAX_VISIBLE_BARS = 10; // Maximum number of progress bars to show
  const progressPercentage = (completedCount / totalCount) * 100; // Calculate progress percentage
  const visibleBars = totalCount > MAX_VISIBLE_BARS ? MAX_VISIBLE_BARS : totalCount; // Determine number of visible bars
  const filledBars = totalCount > MAX_VISIBLE_BARS 
    ? Math.round((progressPercentage / 100) * MAX_VISIBLE_BARS) // Calculate filled bars based on progress
    : completedCount; // If total is less than or equal to MAX_VISIBLE_BARS, use completedCount

  // Function to handle actions when the button is clicked
  const handleAction = () => {
    if (actionUrl === 'OPEN_REFERRAL_MODAL') {
      openReferralModal(); // Open referral modal if specified
    } else if (actionUrl) {
      window.location.href = actionUrl; // Navigate to the action URL
    }
  };

  return (
    <section id={id}>
      <div className='flex w-full items-center md:justify-start justify-center'>
        <div className="w-full bg-background rounded-2xl overflow-hidden shadow-defined">
          <div className="relative h-20" style={{ backgroundColor: color }}>
            <div className="absolute inset-0 flex items-center px-4">
              <div onClick={onOpen} className="w-16 h-16 cursor-pointer bg-background rounded-full flex items-center justify-center shadow-lg mr-4">
                <Image
                  src={badgeImageUrl}
                  alt={`${badgeName} Badge`}
                  width={400}
                  height={400}
                  priority
                  className="rounded-full w-16 h-12"
                />
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-white font-poppins font-semibold text-base">{badgeName}</h2>
                <Chip
                  style={{
                    backgroundColor: isCompleted ? 'white' : undefined,
                    color: isCompleted ? color : undefined,
                  }}
                  variant={'solid'}
                  size="sm"
                  className="font-semibold"
                  classNames={{
                    content: isCompleted ? "font-semibold" : 'font-medium'
                  }}
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
                  {/* Render progress bars */}
                  {[...Array(visibleBars)].map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-4 rounded-sm ${index < filledBars ? '' : 'bg-gray-200'}`}
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
              {isCompleted && (
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
              )}
              {!isCompleted && (
                <Button 
                  onClick={handleAction} 
                  size='sm' 
                  className={`bg-background font-medium border-2 min-w-0 py-2 px-3 text-text`}
                >
                  {personalizedMessage} 
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Modal to display achievement details */}
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        size="md"
        placement="center"
        className="bg-background"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex w-full items-center justify-center">
                <span className="text-xl font-poppins text-center font-semibold">{badgeName}</span>
              </ModalHeader>
              <ModalBody className="flex items-center justify-center pb-4 px-8">
                <Image
                  src={badgeImageUrl}
                  alt={`${badgeName} Badge`}
                  width={300}
                  height={300}
                  className="rounded-lg"
                  priority
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
}
