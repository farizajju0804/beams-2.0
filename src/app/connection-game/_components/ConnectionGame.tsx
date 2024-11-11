'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Modal, ModalContent, ModalHeader, ModalBody, Spinner } from "@nextui-org/react";
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
  beamsTodayId : string;
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
    if (timeLeft > 30) return '#22c55e';
    if (timeLeft > 15) return '#fbbf24';
    return '#ef4444';
  };

  const getTrailColor = () => {
    if (timeLeft > 30) return '#dcfce7';
    if (timeLeft > 15) return '#fef3c7';
    return '#fee2e2';
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
    { message: `Keep going ${username}! You're on the right track`, emoji: "🎯" },
    { message: `Almost there ${username}! Try a different approach`, emoji: "💫" },
    { message: `Don't give up ${username}! The answer is within reach`, emoji: "✨" },
    { message: `You're getting closer ${username}! Keep thinking`, emoji: "💭" }
  ];
  
  const feedbackIndex = Math.floor(Math.random() * feedback.length);
  return `${feedback[feedbackIndex].message} ${feedback[feedbackIndex].emoji}`;
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

const AnswerBoxes: React.FC<{
  answer: string;
  selectedLetters: string[];
  onLetterRemove: (index: number) => void;
  onBoxClick: (index: number) => void;
  replaceMode: number | null;
}> = ({ answer, selectedLetters, onLetterRemove, onBoxClick, replaceMode }) => {
  const words = answer.split(' ');
  let letterIndex = 0;

  return (
    <div className="w-full max-w-full flex flex-col items-center gap-8 mb-4">
      {words.map((word, wordIndex) => (
        <div key={`word-${wordIndex}`} className="flex justify-center w-full flex-wrap gap-2">
          {Array(word.length).fill(0).map((_, index) => {
            const currentIndex = letterIndex++;
            return (
              <div
                key={`answer-${currentIndex}`}
                onClick={() => selectedLetters[currentIndex] ? onBoxClick(currentIndex) : null}
                className={`w-8 h-8 border-2 ${replaceMode === currentIndex ? 'border-yellow-500 bg-yellow-100' : 'border-primary'} 
                  rounded-lg flex items-center justify-center text-sm font-bold cursor-pointer
                  ${selectedLetters[currentIndex] ? 'bg-primary/10' : 'bg-background'}`}
              >
                {selectedLetters[currentIndex] || ''}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
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
  const [isHintVisible, setIsHintVisible] = useState<boolean>(false);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [levelUp, setLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState<any>();
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [letterBoxes, setLetterBoxes] = useState<{ letter: string; disabled: boolean }[]>([]);
  const [replaceMode, setReplaceMode] = useState<number | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);

  const router = useRouter();
  // Initialize letter boxes
  useEffect(() => {
    const answerLetters = answer.toUpperCase().replace(/\s/g, '').split('');
    const remainingSpaces = 16 - answerLetters.length;
    const randomLetters = Array(remainingSpaces).fill('').map(() => generateRandomLetter());
    const allLetters = shuffleArray([...answerLetters, ...randomLetters]);
    
    setLetterBoxes(allLetters.map(letter => ({
      letter,
      disabled: false
    })));
  }, [answer]);

  useEffect(() => {
    if (timeLeft > 0 && !isCorrect) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isCorrect) {
      setMessage(`Time's up, ${username}! The answer is "${answer}"`);
      setShowTimeUpModal(true);
      handleGameCompletion2();
    }
  }, [timeLeft, isCorrect, username, answer, beamsTodayId, router]);


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

  const handleLetterClick = (letter: string, index: number) => {
    if (replaceMode !== null) {
      // Handle replacement
      const newSelectedLetters = [...selectedLetters];
      const oldLetter = selectedLetters[replaceMode];
      
      // Replace the letter at the replace mode index
      newSelectedLetters[replaceMode] = letter;
      setSelectedLetters(newSelectedLetters);
      
      // Re-enable old letter and disable new letter
      setLetterBoxes(prev => prev.map((box, i) => {
        if (box.letter === oldLetter) return { ...box, disabled: false };
        if (i === index) return { ...box, disabled: true };
        return box;
      }));
      
      // Exit replace mode
      setReplaceMode(null);

      // Check if answer is complete after replacement
      const guess = newSelectedLetters.join('');
      if (newSelectedLetters.length === answer.replace(/\s/g, '').length) {
        checkAnswer(guess);
      }
    } else {
      // Normal selection mode
      if (selectedLetters.length < answer.replace(/\s/g, '').length) {
        const newSelectedLetters = [...selectedLetters, letter];
        setSelectedLetters(newSelectedLetters);
        setLetterBoxes(prev => prev.map((box, i) => 
          i === index ? { ...box, disabled: true } : box
        ));

        // Check if answer is complete after adding new letter
        if (newSelectedLetters.length === answer.replace(/\s/g, '').length) {
          const guess = newSelectedLetters.join('');
          checkAnswer(guess);
        }
      }
    }
  };

  const handleAnswerBoxClick = (index: number) => {
    if (replaceMode === index) {
      // If clicking the same box again, exit replace mode
      setReplaceMode(null);
    } else {
      // Enter replace mode for the clicked box
      setReplaceMode(index);
    }
  };

  const checkAnswer = async (guess: string) => {
    setIsSubmitting(true)
    setAttempts(prev => prev + 1);
    const normalizedGuess = guess.toUpperCase();
    const normalizedAnswer = answer.replace(/\s/g, '').toUpperCase();

    if (normalizedGuess === normalizedAnswer) {
      setIsCorrect(true);
      const earnedPoints = getPointsForTime(timeLeft, showHint);
      setPoints(earnedPoints);

      try {
        const result = await completeConnectionGame(id, earnedPoints);
        if (result.success && result.data) {
          const { leveledUp,newLevel } = result.data;
          setLevelUp(leveledUp);
          setNewLevel(newLevel);
          setIsSubmitting(false)
          setShowModal(true);
        }
      } catch (error) {
        console.error('Error saving game completion:', error);
      }
    } else {
      if (attempts >= 2 && !showHint) {
    setIsSubmitting(false)
    toast.error(`Hey ${username}, would you like to use a hint? 💡`);
      } else {
    setIsSubmitting(false)
        toast.error(getFeedbackMessage(username, attempts));
      }
      // Clear selected letters on wrong guess
      setSelectedLetters([]);
      setLetterBoxes(prev => prev.map(box => ({ ...box, disabled: false })));
      setReplaceMode(null);
    }
  };



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

  const handleGameCompletion2 = async () => {
    if (!isCompleting) {
      setIsCompleting(true);
      try {
        // Complete game without points
        await completeConnectionGame(id, 0);
        // Redirect to beams-today page
        // router.push(`/beams-today/${beamsTodayId}`);
      } catch (error) {
        console.error('Error completing game:', error);
      }
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

  const toggleHint = () => {
    setIsHintVisible(!isHintVisible);
    setShowHint(true);
  };

  const handleFirstModalClose = () => {
    setShowModal(false);
    if (levelUp) {
      setTimeout(() => {
        setIsLevelUpModalOpen(true);
      }, 100);
    }
    else{
      setIsRedirecting(true)
      router.push(`/beams-today/${beamsTodayId}`);
    }
  };


  if(isRedirecting){
    return (
      <RedirectMessage username={username}/> 
    )
  }

  
 
    return (
      <div className="flex items-center mx-auto h-full w-full justify-center max-w-7xl p-2">
        <Toaster position="top-center" />
      {isSubmitting ? 
       <Spinner size='lg'/>
       :
       (
        <>
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader className="flex flex-col items-center px-2 pt-8 pb-6">
            <h1 className="w-full text-xl md:text-3xl font-bold text-center mb-6">
              {title}
            </h1>
            
            <div className="flex items-center justify-center gap-6 w-full relative">
              <div className="flex items-center">
                <CircularTimer timeLeft={timeLeft} />
              </div>
              <Button
                isIconOnly
                variant="light"
                onPress={toggleHint}
                className="transition-all p-2 duration-300 rounded-full shadow-defined"
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
  
          <CardBody className="gap-6 px-4">
            <div className="relative w-full rounded-lg overflow-hidden">
              <Image
                src={image}
                width={1000}
                height={400}
                alt="Guess this"
                className="object-contain h-fit w-full"
              />
            </div>
  
            {/* Answer boxes */}
            <AnswerBoxes 
            answer={answer}
            selectedLetters={selectedLetters}
            onLetterRemove={() => {}}
            onBoxClick={handleAnswerBoxClick}
            replaceMode={replaceMode}
          />
  
                {/* Letter boxes */}
                <div className="w-full mx-auto max-w-md items-center grid grid-cols-8 gap-2 mb-4">
                  {letterBoxes.slice(0, 8).map((box, index) => (
                    <Button
                      key={`letter1-${index}`}
                      isDisabled={box.disabled || isCorrect || timeLeft === 0}
                      onClick={() => handleLetterClick(box.letter, index)}
                      className={`w-8 min-w-0 mx-auto h-8 p-2 text-sm font-semibold ${
                        box.disabled 
                          ? 'bg-grey-1' 
                          : replaceMode !== null 
                            ? 'bg-yellow text-black' 
                            : 'bg-primary text-white hover:bg-primary-500'
                      }`}
                    >
                      {box.letter}
                    </Button>
                  ))}
                </div>
                <div className="w-full mx-auto max-w-md items-center justify-center grid grid-cols-8 gap-2">
                  {letterBoxes.slice(8).map((box, index) => (
                    <Button
                      key={`letter2-${index}`}
                      isDisabled={box.disabled || isCorrect || timeLeft === 0}
                      onClick={() => handleLetterClick(box.letter, index + 8)}
                      className={`w-8 h-8 mx-auto min-w-0 p-2 text-sm font-semibold ${
                        box.disabled 
                          ? 'bg-grey-1' 
                          : replaceMode !== null 
                            ? 'bg-yellow text-black' 
                            : 'bg-primary text-white hover:bg-primary-500'
                      }`}
                    >
                      {box.letter}
                    </Button>
                  ))}
                </div>

                {message && (
                  <div className="text-center text-sm font-medium text-red-500 mt-4 p-2 rounded-lg">
                    {message}
                  </div>
                )}
          </CardBody>
        </Card>
  
        <CelebrationModal
          isOpen={showModal}
          onClose={handleFirstModalClose}
          username={username}
          points={points}
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
        setIsRedirecting(true)
          router.push(`/beams-today/${beamsTodayId}`);

        }}
        currentLevel={newLevel}
        pointsAdded={points}
      />
      </>
    
    )
  }
    </div>
  );
};

export default ConnectionGame;