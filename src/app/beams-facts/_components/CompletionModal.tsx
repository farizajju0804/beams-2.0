'use client';
import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalContent, ModalBody, useDisclosure, Chip, Spinner } from '@nextui-org/react';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { ArrowRight2 } from 'iconsax-react';

import { Level, UserType } from '@prisma/client';
import IconFillingEffect from '@/components/IconFillingEffect';
import { getHasGainedBeamsStatus, handleUserPointsAndMarkGained } from '@/actions/points/handleUserPointsAndMarkGained';
import LevelName from '@/components/LevelName';
import ShareButton from '@/app/achievements/_components/ShareButton';

interface AchievementCompletionButtonProps {
  userId: string;
  badgeName: string;
  badgeImageUrl: string;
  color: string;
  beamsToGain: number;
  userFirstName: string;
  personalizedMessage: string;
  currentBeams: number;
  currentLevel: Level;
  isCompleted: boolean;
  userType: UserType;
  achievementId: string; // To check if beams were already gained
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

const CompletionButton: React.FC<AchievementCompletionButtonProps> = ({
  userId,
  badgeName,
  badgeImageUrl,
  color,
  beamsToGain,
  userFirstName,
  personalizedMessage,
  currentBeams,
  currentLevel,
  isCompleted,
  userType,
  achievementId
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showConfetti, setShowConfetti] = useState(false);
  const [animatedBeams, setAnimatedBeams] = useState(currentBeams);
  const [leveledUp, setLeveledUp] = useState(false);
  const [newLevel, setNewLevel] = useState<Level | null>(null);
  const [levelCaption, setLevelCaption] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // For showing loader
  const [hasGainedBeams, setHasGainedBeams] = useState(false); // Fetch from server

  const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * INSPIRING_MESSAGES.length);
    return INSPIRING_MESSAGES[randomIndex]
      .replace(/{userName}/g, userFirstName)
      .replace(/{badgeName}/g, badgeName);
  };

  const [inspiringMessage] = useState(getRandomMessage());

  const triggerConfetti = () => {
    const defaults = {
      spread: 360,
      ticks: 50,
      gravity: 0,
      decay: 0.94,
      startVelocity: 10,
      colors: [color],
    };

    const shoot = () => {
      confetti({
        ...defaults,
        particleCount: 20,
        scalar: 1.2,
        shapes: ["star"],
      });

      confetti({
        ...defaults,
        particleCount: 10,
        scalar: 0.75,
        shapes: ["circle"],
      });
    };

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 300);
  };

  useEffect(() => {
    if (isOpen && showConfetti) {
      triggerConfetti();
      setShowConfetti(false);
    }
  }, [isOpen, showConfetti]);

  // Fetch hasGainedBeams status on component mount
  useEffect(() => {
    const fetchHasGainedStatus = async () => {
      setLoading(true);
      const status = await getHasGainedBeamsStatus(userId, achievementId);
      setHasGainedBeams(status);
      setLoading(false);
    };

    fetchHasGainedStatus();
  }, [userId, achievementId]);

  const handleOpenModal = async () => {
    // If hasGainedBeams is true, we don't want to run any backend actions
    if (hasGainedBeams) {
      onOpen(); // Open the modal without any backend actions
      setShowConfetti(true);
      return;
    }

    setLoading(true); // Show the loader

    // Call server action to update points and mark beams as gained
    const { userBeamPoints, leveledUp: userLeveledUp, newLevel: userNewLevel, levelCaption } =
      await handleUserPointsAndMarkGained(userId, beamsToGain, 'ACHIEVEMENT', `${badgeName} Badge Unlocked!`, userType, achievementId);

    if (!userBeamPoints) {
      // console.log('Beams already gained or error occurred.');
      setLoading(false);
      return;
    }

    // Animation for filling the icons
    let progress = currentBeams;
    const targetBeams = currentBeams + beamsToGain;
    const increment = Math.ceil((targetBeams - currentBeams) / 10); // Adjust for smoothness

    const fillInterval = setInterval(() => {
      progress += increment;
      if (progress >= targetBeams) {
        setAnimatedBeams(targetBeams);
        clearInterval(fillInterval);
      } else {
        setAnimatedBeams(progress);
      }
    }, 150); // Change the interval timing for smoother animation

    // If leveled up, update the state with new level and show level-up message
    if (userLeveledUp) {
      setLeveledUp(true);
      setNewLevel(userNewLevel);
      setLevelCaption(levelCaption);
    }

    // After all updates are done, open the modal and hide the loader
    setLoading(false);
    onOpen();
    setShowConfetti(true);
  };

  const shareData = {
    title: `${userFirstName} just unlocked the ${badgeName} badge!`,
    shortDesc: `I'm excited to share that I earned the ${badgeName} badge and gained ${beamsToGain} Beams!`,
    url: window.location.href, // Current page URL to be shared
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[250]">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <>
      <Button
        className="flex-wrap flex h-auto py-2 items-center justify-between font-medium font-poppins"
        endContent={<ArrowRight2 size={20} />}
        onClick={handleOpenModal}
        style={{
          backgroundColor: isCompleted ? color : undefined,
          color: isCompleted ? 'white' : undefined,
        }}
      >
        {`${userFirstName}, ${personalizedMessage}`}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="md" placement="center">
        <ModalContent>
          <ModalBody className="py-6">
            <div className="flex flex-col items-center text-center">
              <Image
                src={badgeImageUrl}
                alt={`${badgeName} Badge`}
                width={200}
                height={200}
                className="mb-4"
              />
              <h2 className="text-lg font-bold mb-2">{userFirstName}! The {badgeName}!</h2>

              {/* If hasGainedBeams is true, just show the badge, inspiring message, and share button */}
              {hasGainedBeams ? (
                <>
                  <p className="text-sm mb-4">{inspiringMessage}</p>
                  <ShareButton
                    url={shareData.url}
                    shareTitle={shareData.title}
                    shareText={shareData.shortDesc}
                  />
                </>
              ) : (
                <>
                  <p className="text-sm mb-4">{inspiringMessage}</p>

                  {leveledUp && (
                    <div className="text-center my-4">
                      <h3 className="text-lg font-bold">Level Up!</h3>
                      <p className="text-sm">{levelCaption}</p>
                      
                    </div>
                  )}

                  <LevelName
                   minPoints={newLevel ? newLevel.minPoints : currentLevel.minPoints}
                   maxPoints={newLevel ? newLevel.maxPoints : currentLevel.maxPoints}
                   name={newLevel ? newLevel.name : currentLevel.name}
                   levelNumber={newLevel ? newLevel.levelNumber : currentLevel.levelNumber}
                  />
  
                  <IconFillingEffect
                    icon={newLevel ? newLevel.icon : currentLevel.icon}
                    filledColor={newLevel ? newLevel.bgColor : currentLevel.bgColor}
                    beams={animatedBeams}  // Using animated beams for filling effect
                    minPoints={newLevel ? newLevel.minPoints : currentLevel.minPoints}
                    maxPoints={newLevel ? newLevel.maxPoints : currentLevel.maxPoints}
                  />

                  <Chip
                    style={{ backgroundColor: color }}
                    variant="shadow"
                    size="sm"
                    className="my-2 text-white"
                  >
                    +{beamsToGain} Beams
                  </Chip>

                  <ShareButton
                    url={shareData.url}
                    shareTitle={shareData.title}
                    shareText={shareData.shortDesc}
                  />
                </>
              )}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CompletionButton;
