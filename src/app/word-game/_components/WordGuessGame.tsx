'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardBody, CardHeader, Button, Input, Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import { FcIdea } from 'react-icons/fc';
import Image from 'next/image';
import { completeConnectionGame } from '@/actions/beams-today/connectionGame';
import LevelupModal from '@/components/LevelupModal';


interface WordGuessGameProps {
  id: string; 
  image: string;
  answer: string;
  title: string;
  hint: string;
  username?: string;
}



interface FeedbackMessage {
  message: string;
  emoji: string;
}

const CircularTimer: React.FC<{ timeLeft: number }> = ({ timeLeft }) => {
    const percentage = (timeLeft / 60) * 100;
    const getColor = () => {
      if (timeLeft > 30) return '#22c55e'; // Bright green
      if (timeLeft > 15) return '#fbbf24'; // Bright yellow
      return '#ef4444'; // Bright red
    };
  
    const getTrailColor = () => {
      if (timeLeft > 30) return '#dcfce7'; // Light green
      if (timeLeft > 15) return '#fef3c7'; // Light yellow
      return '#fee2e2'; // Light red
    };
  
    return (
      <div className="relative w-16 h-16">
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke={getTrailColor()}
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke={getColor()}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            style={{
              strokeDasharray: `${2 * Math.PI * 28}`,
              strokeDashoffset: `${2 * Math.PI * 28 * (1 - percentage / 100)}`,
              transition: 'all 1s linear'
            }}
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className={`text-xl font-bold ${
            timeLeft <= 15 ? 'text-red-500' : 
            timeLeft <= 30 ? 'text-yellow-500' : 
            'text-green-500'
          }`}>
            {timeLeft}
          </span>
        </div>
      </div>
    );
  };



const getPointsForTime = (timeLeft: number, usedHint: boolean): number => {
  let points = 0;
  if (timeLeft > 45) points = 10;
  else if (timeLeft > 30) points = 8;
  else if (timeLeft > 15) points = 5;
  else points = 2;
  
  return usedHint ? Math.max(points - 2, 1) : points;
};

const getFeedbackMessage = (username: string, attempts: number): string => {
  const feedback: FeedbackMessage[] = [
    {
      message: `Keep going ${username}! You're on the right track`,
      emoji: "🎯"
    },
    {
      message: `Almost there ${username}! Try a different approach`,
      emoji: "💫"
    },
    {
      message: `Don't give up ${username}! The answer is within reach`,
      emoji: "✨"
    },
    {
      message: `You're getting closer ${username}! Keep thinking`,
      emoji: "💭"
    }
  ];
  
  const feedbackIndex = Math.floor(Math.random() * feedback.length);
  return `${feedback[feedbackIndex].message} ${feedback[feedbackIndex].emoji}`;
};



const WordGuessGame: React.FC<WordGuessGameProps> = ({ 
  id,
  image, 
  answer, 
  title, 
  hint, 
  username = "Player" 
}) => {

  const [guess, setGuess] = useState<string>('');
  const [chars, setChars] = useState<string[]>(Array(answer.replace(/\s/g, '').length).fill(''));
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [points, setPoints] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [isHintVisible, setIsHintVisible] = useState<boolean>(false);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [levelUp, setLevelUp] = useState(false);
  const [beams, setBeams] = useState<any>();
  const [newLevel, setNewLevel] = useState<any>();

    const toggleHint = () => {
        setIsHintVisible(!isHintVisible);
        setShowHint(true); // This tracks if hint was used for points calculation
      };


  useEffect(() => {
    if (timeLeft > 0 && !isCorrect) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setMessage(`Time's up, ${username}! The answer is "${answer}"`);
    }
  }, [timeLeft, isCorrect, username, answer]);

  const normalizeText = (text: string): string => {
    return text
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '') // Remove all spaces
      .replace(/[^A-Z]/g, ''); // Remove any non-letter characters
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const userGuess = normalizeText(guess);
    const correctAnswer = normalizeText(answer);
    setAttempts(prev => prev + 1);

    console.log('User guess:', userGuess); // For debugging
    console.log('Correct answer:', correctAnswer); // For debugging

    if (userGuess === correctAnswer) {
      setIsCorrect(true);
      const earnedPoints = getPointsForTime(timeLeft, showHint);
      setPoints(earnedPoints);

      try {
        const result = await completeConnectionGame(id, earnedPoints);
        
        if (result.success && result.data) {
          setShowModal(true);
          const { leveledUp, newLevel} = result.data;
         
            setLevelUp(leveledUp);
            setNewLevel(newLevel); // Set new level
            setBeams(beams); // Update beams

            setShowModal(true);
            

          
        } else {
          console.error('Failed to save game completion:', result.error);
        }
      } catch (error) {
        console.error('Error saving game completion:', error);
      }
    } else {
      if (attempts >= 2 && !showHint) {
        setMessage(`Hey ${username}, would you like to use a hint? 💡`);
      } else {
        setMessage(getFeedbackMessage(username, attempts));
      }
    }
  };

  
  
  const handleFirstModalClose = () => {
    setShowModal(false);
    if (levelUp) {
      // Slight delay to ensure smooth transition
      setTimeout(() => {
        setIsLevelUpModalOpen(true);
      }, 100);
    }
  };

  const handleGuessChange = (value: string) => {
    setGuess(value.toUpperCase());
  };

  return (
    <div className='flex items-center mx-auto h-full w-full justify-center max-w-7xl p-2'>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="flex flex-col items-center px-4 pt-8 pb-6">
          <h1 className="w-full text-xl md:text-3xl font-bold text-center mb-6">
            {title}
          </h1>
          
          <div className="flex items-center justify-center gap-6 w-full relative">
            <div className="flex items-center">
              <CircularTimer timeLeft={timeLeft} />
            </div>

          <Button
            //   startContent={}
              isIconOnly
              variant="light"
              onPress={toggleHint}
              className={`transition-all p-2 duration-300 rounded-full shadow-defined`}
              size="lg"
            >
              <FcIdea size={28} />
            </Button>
          </div>
          
          {showHint && (
            <div className="bg-background p-2 rounded-2xl mt-4 shadow-defined">
              <p className="text-gradient-dark text-sm font-medium">
                💡 <span className="font-bold">Hint:</span> {hint}
              </p>
            </div>
          )}
        </CardHeader>

        <CardBody className="gap-6 px-6">
          <div className="relative w-full rounded-lg overflow-hidden">
            <Image
              src={image}
              width={1000}
              height={400}
              alt="Guess this"
              className="object-contain h-fit w-full"
            />
          </div>

         

          <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center">
           
             <Input
              type="text"
              value={guess}
              onChange={(e) => handleGuessChange(e.target.value)}
              placeholder="Type your answer here..."
              isDisabled={timeLeft === 0 || isCorrect}
              classNames={{
                input: "text-center text-lg font-semibold uppercase",
                inputWrapper: "max-w-md w-full",
                mainWrapper:"mx-auto w-full items-center justify-center"
              }}
              size="lg"
              variant="bordered"
              className="mb-4 mx-auto"
            />
            {message && (
              <div className="text-center text-sm font-medium text-default-700 mb-4 p-2 rounded-lg ">
                {message}
              </div>
            )}
            <Button 
              type="submit"
              color="primary"
              className="max-w-sm mb-4 mx-auto w-full text-white font-semibold"
              isDisabled={timeLeft === 0 || isCorrect}
              size="lg"
              radius="lg"
            >
              Submit Answer
            </Button>
          </form>
        </CardBody>
      </Card>

      <Modal 
        isOpen={showModal} 
        onClose={handleFirstModalClose}
        size="md"
        placement='center'
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-center">
            🎉 Congratulations, {username}! 🎉
          </ModalHeader>
          <ModalBody className="text-center py-2">
            <div className="space-y-4">
              <p className="text-xl font-medium">
                You solved it with {timeLeft} seconds left!
              </p>
              <p className="text-3xl mb-2 font-bold text-primary">
                Points earned: {points}
              </p>
            
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <LevelupModal
        levelUp={levelUp}
        beams={beams}
        isOpen={isLevelUpModalOpen}
        onClose={() => {
          setIsLevelUpModalOpen(false); 
        }}
        currentLevel={newLevel}
        pointsAdded={points}
      />
    </div>
  );
};

export default WordGuessGame;