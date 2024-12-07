'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Spinner, PopoverTrigger, PopoverContent, Popover } from "@nextui-org/react";
import Image from 'next/image';
import { completeConnectionGame } from '@/actions/connection/connectionGame';
import LevelupModal from '@/components/LevelupModal';
import CelebrationModal from './CelebrationModal';
import toast, { Toaster } from 'react-hot-toast';
import TimeUpModal from './TimeupModal';
import { FaLightbulb } from 'react-icons/fa';
import { GameSolution } from './GameSolution';

interface WordGuessGameProps {
  id: string;
  firstImage: string;
  secondImage: string;
  thirdImage: string;
  referenceLink : string;
  answer: string;
  beamsTodayId: string;
  title: string;
  hint: string;
  username?: string;
  answerExplanation: string;
  solutionPoints: string[];
  isCompleted?: boolean;
  gameDate: Date;
}

const CircularTimer: React.FC<{ timeLeft: number }> = ({ timeLeft }) => {
  const radius = 16; // Ensure this matches the `r` attribute in the circle
  const circumference = 2 * Math.PI * radius;
  const percentage = (timeLeft / 60) * 100;

  return (
    <div className="relative w-16 h-16">
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="#f96f2e"
          strokeWidth="2"
          fill="none"
        />
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="#d2d2d2"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: circumference * (1 - percentage / 100),
            transition: 'all 1s linear',
          }}
        />
      </svg>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <span className="text-sm font-medium text-text tracking-tight">
          {timeLeft}
        </span>
      </div>
    </div>
  );
};


const getPointsForTime = (timeLeft: number, usedHint: boolean, isCurrentDay: boolean): number => {
  let points = 0;
  
  if (isCurrentDay) {
    // Full points for current day
    if (timeLeft > 45) points = 20;
    else if (timeLeft > 30) points = 16;
    else if (timeLeft > 15) points = 10;
    else points = 5;
  } else {
    // 50% points for past days
    if (timeLeft > 45) points = 10;
    else if (timeLeft > 30) points = 8;
    else if (timeLeft > 15) points = 5;
    else points = 2;
  }
  
  return usedHint ? Math.max(points - 2, 1) : points;
};



const isGameCurrentDay = (gameDate: Date): boolean => {
  try {
    // Get current date in YYYY-MM-DD format
    const today = new Date().toLocaleDateString('en-CA');
    
    // Convert game date to same YYYY-MM-DD format
    const formattedGameDate = new Date(gameDate).toLocaleDateString('en-CA');

    console.log({
      today,
      gameDate: formattedGameDate,
      isEqual: today === formattedGameDate
    });
    
    return today === formattedGameDate;
  } catch (error) {
    console.error('Error comparing dates:', error);
    return false;
  }
};

const getFeedbackMessage = (username: string, attempts: number): string => {
  const feedback = [
    { message: `Keep going ${username}! You're on the right track` },
    { message: `Almost there ${username}! Try a different approach` },
    { message: `Don't give up ${username}! The answer is within reach`},
    { message: `You're getting closer ${username}! Keep thinking` }
  ];
  
  const feedbackIndex = Math.floor(Math.random() * feedback.length);
  return `${feedback[feedbackIndex].message}`;
};

const generateRandomLetter = (): string => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return alphabet[Math.floor(Math.random() * alphabet.length)];
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const countLetterOccurrences = (str: string, letter: string): number => {
  return str.split('').filter(char => char === letter).length;
};

const ConnectionGame: React.FC<WordGuessGameProps> = ({ 
  id,
  firstImage,
  secondImage,
  thirdImage,
  referenceLink,
  answer, 
  beamsTodayId,
  title, 
  hint, 
  username = "Player" ,
  answerExplanation,
  solutionPoints,
  isCompleted = false,
  gameDate 
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [points, setPoints] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [levelUp, setLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState<any>();
  const [jumbledLetters, setJumbledLetters] = useState<string[]>([]);
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [showSolution, setShowSolution] = useState<boolean>(isCompleted);
  const words = answer.split(' ');

  useEffect(() => {
    if (!isFirstRender) {
    } else {
      setIsFirstRender(false);
    }
  }, [showHint]);

  useEffect(() => {
    if (isCompleted) {
      setShowSolution(true);
    }
  }, [isCompleted]);

  useEffect(() => {
    setUserInputs(Array(words.length).fill(''));
  }, [answer]);

  useEffect(() => {
    const answerLetters = answer.toUpperCase().replace(/\s/g, '').split('');
    const remainingSpaces = 15 - answerLetters.length;
    const randomLetters = Array(remainingSpaces).fill('').map(() => generateRandomLetter());
    const allLetters = shuffleArray([...answerLetters, ...randomLetters]);
    setJumbledLetters(allLetters);
  }, [answer]);

  const isValidInput = (input: string, allInputs: string[]): boolean => {
    const combinedInput = [...allInputs].join('').toUpperCase();
    const inputChars = input.toUpperCase().split('');
    
    for (const char of inputChars) {
      if (char === ' ') continue;
      
      const availableCount = countLetterOccurrences(jumbledLetters.join(''), char);
      const usedCount = countLetterOccurrences(combinedInput, char);
      
      if (usedCount > availableCount) {
        return false;
      }
    }
    
    return true;
  };

  const handleInputChange = (value: string, index: number) => {
    const newInputs = [...userInputs];
    const newValue = value.toUpperCase();
    
    if (isValidInput(newValue, [...userInputs.slice(0, index), newValue, ...userInputs.slice(index + 1)])) {
      newInputs[index] = newValue;
      setUserInputs(newInputs);
    }
  };

  const isLetterUsed = (letter: string, index: number): boolean => {
    const combinedInput = userInputs.join('');
    if (!combinedInput.includes(letter)) return false;

    const letterPositionsInJumbled = jumbledLetters
      .map((l, i) => l === letter ? i : -1)
      .filter(i => i !== -1);
    
    const positionIndex = letterPositionsInJumbled.indexOf(index);
    const usedCount = countLetterOccurrences(combinedInput, letter);
    
    return positionIndex < usedCount;
  };

  const handleSubmit = async () => {
    if (userInputs.some(input => !input) || isSubmitting) return;
    
    setIsSubmitting(true);
    setAttempts(prev => prev + 1);
    
    const combinedInput = userInputs.join(' ').toUpperCase();
    
    if (combinedInput === answer.toUpperCase()) {
      setIsCorrect(true);
      const isCurrentDay = isGameCurrentDay(gameDate);
      const earnedPoints = getPointsForTime(timeLeft, showHint, isCurrentDay);
      setPoints(earnedPoints);

      try {
        const result = await completeConnectionGame(id, earnedPoints);
        if (result.success && result.data) {
          const { leveledUp, newLevel } = result.data;
          setLevelUp(leveledUp);
          setNewLevel(newLevel);
          setIsSubmitting(false);
          setShowModal(true);
        }
      } catch (error) {
        console.error('Error saving game completion:', error);
      }
    } else {
      if (attempts >= 2 && !showHint) {
        setIsSubmitting(false);
        setMessage(`Hey ${username}, would you like to use a hint?`);
      } else {
        setIsSubmitting(false);
        setMessage(getFeedbackMessage(username, attempts));
      }
      setUserInputs(Array(words.length).fill(''));
    }
  };

  useEffect(() => {
    if (timeLeft > 0 && !isCorrect && !showSolution) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isCorrect && !showSolution) {
      setShowTimeUpModal(true);
      handleGameCompletion();
    }
  }, [timeLeft, isCorrect, showSolution]);



  const handleGameCompletion = async () => {
    if (!isCompleting) {
      setIsCompleting(true);
      try {
        await completeConnectionGame(id, 0);
       
      } catch (error) {
        console.error('Error completing game:', error);
      }
    }
  };
  const handleGameCompletion2 = async () => {
    if (!isCompleting) {
      setIsCompleting(true);
      try {
        await completeConnectionGame(id, 0);
        setShowSolution(true)
       
      } catch (error) {
        console.error('Error completing game:', error);
      }
    }
  };

  const toggleHint = () => {
    setShowHint(true);
  };

  const handleFirstModalClose = () => {
    setShowModal(false);
    if (levelUp) {
      setTimeout(() => {
        setIsLevelUpModalOpen(true);
      }, 100);
    } else {
      setShowSolution(true);
    }
  };



  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!isCorrect && !showSolution) {
        handleGameCompletion2();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isCorrect, showSolution]);

 

  if (showSolution) {
    return (
      <GameSolution
        firstImage={firstImage}
        secondImage={secondImage}
        thirdImage={thirdImage}
        referenceLink={referenceLink}
        answer={answer}
        title={title}
        hint={hint}
        answerExplanation={answerExplanation}
        solutionPoints={solutionPoints}
        showBackButton={false}
      />
    );
  }

  return (
    <div className="flex items-center mx-auto h-full w-full justify-center max-w-7xl p-2">
      <Toaster position="top-center" />
      {isSubmitting ? (
        <Spinner size='lg' />
      ) : (
        <>
          <Card className="w-full p-0 shadow-none outline-none border-none max-w-4xl mx-auto">
            <CardHeader className="flex flex-col items-center px-2 pt-2 pb-2">
              <h1 className="w-full text-xl md:text-3xl font-semibold mt-10 text-center">
                {title}
              </h1>
              <div className="flex absolute right-3 -top-3 items-center">
                <CircularTimer timeLeft={timeLeft} />
              </div>
            </CardHeader>

            <CardBody className="gap-6 px-4">
            <div className="relative w-full rounded-lg overflow-hidden grid grid-cols-3">
                  <Image
                    src={firstImage}
                    width={400}
                    height={360}
                    alt="First image"
                    className="object-contain h-fit w-full"
                  />
                  <Image
                    src={secondImage}
                    width={400}
                    height={360}
                    alt="Second image"
                    className="object-contain h-fit w-full"
                  />
                  <Image
                    src={thirdImage}
                    width={400}
                    height={360}
                    alt="Third image"
                    className="object-contain h-fit w-full"
                  />
                  
                  <Popover shouldBlockScroll showArrow placement='top' onOpenChange={toggleHint}>
                    <PopoverTrigger>
                      <Button
                        isIconOnly
                        className="transition-all w-5 h-5 md:w-8 md:h-8 text-primary absolute top-2 right-2 min-w-0 bg-white p-0 shadow-defined duration-300 rounded-full z-10"
                        size="sm"
                      >
                        <FaLightbulb className='md:text-lg text-sm' />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='p-0 border-none outline-none'>
                      <div className="bg-background px-4 py-4 rounded-2xl shadow-defined">
                        <p className="text-gradient-dark text-sm font-medium">
                          💡 <span className="font-bold">Hint:</span> {hint}
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

              <div className="flex flex-wrap justify-center gap-2 mb-2 text-lg font-semibold">
                {jumbledLetters.map((letter, index) => (
                  <span
                    key={index}
                    className={`transition-colors duration-200 ${
                      isLetterUsed(letter, index) ? 'text-default' : 'text-brand'
                    }`}
                  >
                    {letter}
                  </span>
                ))}
              </div>

              <div className="w-full flex items-center justify-center flex-col mb-4 max-w-md mx-auto gap-6">
                <div className="flex gap-2 justify-center flex-wrap">
                  {words.map((word, index) => (
                    <input
                      key={index}
                      type="text"
                      value={userInputs[index]}
                      onChange={(e) => handleInputChange(e.target.value, index)}
                      className="w-48 mx-auto p-2 text-center text-xl focus:outline-grey-2 font-semibold rounded-lg border-1"
                      placeholder={ words.length < 2 ? `Type the answer` : `Type Word ${index + 1}`}
                      disabled={isCorrect || timeLeft === 0}
                      style={{ textTransform: 'uppercase' }}
                    />
                  ))}
                  
                </div>
                <Button
                  className="w-60 mx-auto text-lg text-white font-semibold"
                  color="primary"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={ isCorrect || timeLeft === 0}
                >
                  Submit Answer
                </Button>
                {message && (
                <div className="text-center text-sm font-medium text-red-500 p-2 rounded-lg">
                  {message}
                </div>
              )}
              </div>

             
            </CardBody>
          </Card>

          <CelebrationModal
            isOpen={showModal}
            onClose={handleFirstModalClose}
            username={username}
            beams={points}
          />
          <TimeUpModal
            isOpen={showTimeUpModal}
            onClose={() => {
              setShowTimeUpModal(false);
              setShowSolution(true)
            }}
            username={username}
            answer={answer}
            beamsTodayId={beamsTodayId}
          />
          <LevelupModal
            levelUp={levelUp}
            beams={points}
            isOpen={isLevelUpModalOpen}
            onClose={() => {
              setIsLevelUpModalOpen(false);
              setShowSolution(true)

            }}
            currentLevel={newLevel}
            pointsAdded={points}
          />
        </>
      )}
    </div>
  );
};

export default ConnectionGame;