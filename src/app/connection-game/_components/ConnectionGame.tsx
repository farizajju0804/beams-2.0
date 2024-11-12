'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Spinner, Input, PopoverTrigger, PopoverContent, Popover } from "@nextui-org/react";
import { FcIdea } from 'react-icons/fc';
import Image from 'next/image';
import { completeConnectionGame } from '@/actions/beams-today/connectionGame';
import LevelupModal from '@/components/LevelupModal';
import { useRouter } from 'next/navigation';
import CelebrationModal from './CelebrationModal';
import RedirectMessage from '@/components/Redirection';
import toast, { Toaster } from 'react-hot-toast';
import TimeUpModal from './TimeupModal';

interface WordGuessGameProps {
  id: string;
  image: string;
  answer: string;
  beamsTodayId: string;
  title: string;
  hint: string;
  username?: string;
}

const CircularTimer: React.FC<{ timeLeft: number }> = ({ timeLeft }) => {
  const percentage = (timeLeft / 60) * 100;
  
  return (
    <div className="relative w-16 h-16">
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx="32"
          cy="32"
          r="24"
          stroke="#f1f5f9"
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx="32"
          cy="32"
          r="24"
          stroke="#334155"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: `${2 * Math.PI * 24}`,
            strokeDashoffset: `${2 * Math.PI * 24 * (1 - percentage / 100)}`,
            transition: 'all 1s linear'
          }}
        />
      </svg>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <span className="text-lg font-medium text-text font-mono tracking-tight">
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
  const feedback = [
    { message: `Keep going ${username}! You're on the right track` },
    { message: `Almost there ${username}! Try a different approach` },
    { message: `Don't give up ${username}! The answer is within reach`},
    { message: `You're getting closer ${username}! Keep thinking` }
  ];
  
  const feedbackIndex = Math.floor(Math.random() * feedback.length);
  return `${feedback[feedbackIndex].message}}`;
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

const ConnectionGame: React.FC<WordGuessGameProps> = ({ 
  id,
  image, 
  answer, 
  beamsTodayId,
  title, 
  hint, 
  username = "Player" 
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
  const [userInput, setUserInput] = useState<string>('');
  const [isCompleting, setIsCompleting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);
  
  useEffect(() => {
    // Skip the first render to avoid logging initial state
    if (!isFirstRender) {
    } else {
      setIsFirstRender(false);
    }
  }, [showHint])
  const router = useRouter();

  useEffect(() => {
    const answerLetters = answer.toUpperCase().replace(/\s/g, '').split('');
    const remainingSpaces = 16 - answerLetters.length;
    const randomLetters = Array(remainingSpaces).fill('').map(() => generateRandomLetter());
    const allLetters = shuffleArray([...answerLetters, ...randomLetters]);
    setJumbledLetters(allLetters);
  }, [answer]);

  const countLetterOccurrences = (str: string, letter: string): number => {
    return str.split('').filter(char => char === letter).length;
  };

  const isValidInput = (input: string): boolean => {
    const inputChars = input.toUpperCase().split('');
    
    for (const char of inputChars) {
      if (char === ' ') continue;
      
      const availableCount = countLetterOccurrences(jumbledLetters.join(''), char);
      const usedCount = countLetterOccurrences(input, char);
      
      if (usedCount > availableCount) {
        return false;
      }
    }
    
    return true;
  };

  const isLetterUsed = (letter: string, index: number): boolean => {
    if (!userInput.includes(letter)) return false;

    const letterPositionsInJumbled = jumbledLetters
      .map((l, i) => l === letter ? i : -1)
      .filter(i => i !== -1);
    
    const positionIndex = letterPositionsInJumbled.indexOf(index);
    const usedCount = countLetterOccurrences(userInput, letter);
    
    return positionIndex < usedCount;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = event.target.value.toUpperCase();
    
    if (isValidInput(newInput)) {
      setUserInput(newInput);
    }
  };

  const handleSubmit = async () => {
    if (!userInput || isSubmitting) return;
    
    setIsSubmitting(true);
    setAttempts(prev => prev + 1);
    
    if (userInput.toUpperCase() === answer.toUpperCase()) {
      setIsCorrect(true);
      const earnedPoints = getPointsForTime(timeLeft, showHint);
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
      setUserInput('');
    }
  };

  useEffect(() => {
    if (timeLeft > 0 && !isCorrect) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isCorrect) {
      setMessage(`Time's up, ${username}! The answer is "${answer}"`);
      setShowTimeUpModal(true);
      handleGameCompletion();
    }
  }, [timeLeft, isCorrect, username, answer]);

  // const handleGameCompletion2 = async () => {
  //   if (!isCompleting) {
  //     setIsCompleting(true);
  //     try {
  //       await completeConnectionGame(id, 0);
  //     } catch (error) {
  //       console.error('Error completing game:', error);
  //     }
  //   }
  // };

  const handleGameCompletion = async () => {
    if (!isCompleting) {
      setIsCompleting(true);
      try {
        // Complete game without points
        await completeConnectionGame(id, 0);
        setIsRedirecting(true)
        // Redirect to beams-today page
        router.push(`/beams-today/${beamsTodayId}`);
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
      setIsRedirecting(true);
      router.push(`/beams-today/${beamsTodayId}`);
    }
  };

  useEffect(() => {
    // Store a flag in sessionStorage when component mounts
    if (!sessionStorage.getItem('gameStarted')) {
      sessionStorage.setItem('gameStarted', 'true');
    } else {
      setIsRedirecting(true)
      // If flag exists, it means page was refreshed
      router.push(`/beams-today/${beamsTodayId}`);
    }

    // Cleanup on component unmount
    return () => {
      sessionStorage.removeItem('gameStarted');
    };
  }, [beamsTodayId, router]);



  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!isCorrect) {
        handleGameCompletion();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isCorrect]);




  if (isRedirecting) {
    return <RedirectMessage username={username} />;
  }

  return (
    <div className="flex items-center mx-auto h-full w-full justify-center max-w-7xl p-2">
      <Toaster position="top-center" />
      {isSubmitting ? (
        <Spinner size='lg' />
      ) : (
        <>
          <Card className="w-full max-w-4xl mx-auto">
         
            <CardHeader className="flex flex-col items-center px-2 pt-4 pb-6">
              <h1 className="w-full text-xl md:text-3xl font-bold mt-20 text-center ">
                {title}
              </h1>
              <Popover shouldBlockScroll showArrow placement='top' onOpenChange={toggleHint} >
                <PopoverTrigger>
                <Button
                  isIconOnly
                  variant="light"
                  
                  className="transition-all absolute top-3 right-3 p-2 duration-300 rounded-full shadow-defined"
                  size="lg"
                >
                  <FcIdea size={28} />
                </Button>
                </PopoverTrigger>
                <PopoverContent className='p-0 border-none outline-none'>
             
                <div className="bg-background px-4 py-4 rounded-2xl shadow-defined">
                  <p className="text-gradient-dark  text-sm font-medium">
                    💡 <span className="font-bold">Hint:</span> {hint}
                  </p>
                </div>
              
               </PopoverContent>
               </Popover>
           
              
              {/* <div className="flex items-center justify-center gap-6 w-full relative"> */}
                <div className="flex absolute left-3 top-3 items-center">
                  <CircularTimer timeLeft={timeLeft}  />
                </div>
              
              {/* </div> */}
              
            </CardHeader>

            <CardBody className="gap-6 px-4">
              <div className="relative w-full rounded-lg overflow-hidden">
                <Image
                  src={image}
                  width={1000}
                  height={500}
                  alt="Guess this"
                  className="object-contain h-fit w-full"
                />
              </div>

              <div className="flex flex-wrap justify-center gap-[6px] mb-2 text-lg font-semibold">
                {jumbledLetters.map((letter, index) => (
                  <span
                    key={index}
                    className={`transition-colors duration-200 ${
                      isLetterUsed(letter, index) ? 'text-default' : 'text-text'
                    }`}
                  >
                    {letter}
                  </span>
                ))}
              </div>

              <div className="w-full mb-4 max-w-md mx-auto space-y-4">
                <input
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  className="w-full p-2 text-center text-xl focus:outline-grey-2  font-semibold rounded-lg border-1"
                  placeholder="Type your answer"
                  disabled={isCorrect || timeLeft === 0}
                  style={{ textTransform: 'uppercase' }}
                />
                
                <Button
                  className="w-full text-lg text-white font-medium"
                  color="primary"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={!userInput || isCorrect || timeLeft === 0}
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
              setIsRedirecting(true);
              router.push(`/beams-today/${beamsTodayId}`);
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
              setIsRedirecting(true);
              router.push(`/beams-today/${beamsTodayId}`);
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