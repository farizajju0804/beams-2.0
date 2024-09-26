'use client'

import React, { useState } from 'react';
import { Button, Modal, ModalContent, ModalBody, useDisclosure, Chip } from '@nextui-org/react';
import Image from 'next/image';
import { FaShare } from 'react-icons/fa';


interface AchievementCompletionButtonProps {
  badgeName: string;
  badgeImageUrl: string;
  color: string;
  beamsToGain: number;
  userFirstName: string;
  personalizedMessage: string;
  currentBeams: number;
  isCompleted: boolean;
}

const INSPIRING_MESSAGES = [
  "{userName}, you're unstoppable! The {badgeName} badge looks great on you!",
  "What an achievement, {userName}! You're on fire with your new {badgeName} badge!",
  "Incredible work on becoming a {badgeName}, {userName}! You're crushing it!",
  "You've just leveled up to {badgeName}, {userName}! What's your next conquest?",
  "Bravo, {userName}! Your dedication as a {badgeName} is truly inspiring!",
  "You're a true {badgeName} now, {userName}! Time to celebrate this milestone!",
  "The sky's the limit, {userName}! Wear your {badgeName} badge with pride!",
  "{userName}, you've proven you're a force to be reckoned with as a {badgeName}!",
  "Congratulations, {userName}! You've mastered the art of being a {badgeName}!",
  "{userName}, you're making waves with your new {badgeName} badge! Keep it up!"
];

const AchievementCompletionButton: React.FC<AchievementCompletionButtonProps> = ({
  badgeName,
  badgeImageUrl,
  color,
  beamsToGain,
  userFirstName,
  personalizedMessage,
  currentBeams,
  isCompleted
}) => {
  const {isOpen, onOpen, onClose} = useDisclosure();

  const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * INSPIRING_MESSAGES.length);
    return INSPIRING_MESSAGES[randomIndex]
      .replace(/{userName}/g, userFirstName)
      .replace(/{badgeName}/g, badgeName);
  };

  const [inspiringMessage] = useState(getRandomMessage());

  const handleShare = () => {
    // Implement sharing functionality here
    console.log('Sharing achievement...');
    // You can use the Web Share API if supported, or open a new window with social media share links
  };

  return (
    <>
      <Button
        className="flex-grow font-medium font-poppins"
        isDisabled={!isCompleted}
        onClick={onOpen}
        style={{
          backgroundColor: isCompleted ? color : undefined,
          color: isCompleted ? 'white' : undefined
        }}
      >
        {`${userFirstName}, ${personalizedMessage}`}
      </Button>

      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        size="sm"
        placement="center"
      >
        <ModalContent>
          <ModalBody className="py-6">
            <div className="flex flex-col items-center text-center">
              <Image
                src={badgeImageUrl}
                alt={`${badgeName} Badge`}
                width={120}
                height={120}
                className="mb-4"
              />
              <h2 className="text-lg font-bold mb-2">{userFirstName}! The {badgeName}!</h2>
              <p className="text-sm  mb-4">{inspiringMessage}</p>
              <Chip 
               style={{ backgroundColor: color }} 
              variant='shadow' size="sm" className={`mb-2  text-white `}
              
              >
                +{beamsToGain} Beams
              </Chip>
              <p className="text-sm mb-4">Total Beams: {currentBeams + beamsToGain}</p>
              <Button 
                color="primary"
                endContent={<FaShare size={18} />}
                size="sm"
                className='font-medium text-white'
                onClick={handleShare}
              >
                Share
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AchievementCompletionButton;