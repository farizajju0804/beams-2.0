'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardBody, CardHeader, Button, Spinner, PopoverTrigger, PopoverContent, Popover } from "@nextui-org/react";
import Image from 'next/image';
import { completeConnectionGame } from '@/actions/connection/connectionGame';
import LevelupModal from '@/components/LevelupModal';
import CelebrationModal from './CelebrationModal';
import toast, { Toaster } from 'react-hot-toast';
import TimeUpModal from './TimeupModal';
import { FaLightbulb } from 'react-icons/fa';
import { GameSolution } from './GameSolution';
import { useCurrentUser } from '@/hooks/use-current-user';

interface WordGuessGameProps {
  id: string;
  firstImage: string;
  secondImage: string;
  thirdImage: string;
  referenceLink: string;
  answer: string;
  beamsTodayId: string;
  title: string;
  hint: string;
  letterChoiceStudent: string[];
  letterChoiceNonStudent: string[];
  username?: string;
  answerExplanation: string;
  solutionPoints: string[];
  isCompleted?: boolean;
  gameDate: Date;
}

const CircularTimer: React.FC<{ timeLeft: number }> = ({ timeLeft }) => {
  const radius = 16;
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
    if (timeLeft > 45) points = 20;
    else if (timeLeft > 30) points = 16;
    else if (timeLeft > 15) points = 10;
    else points = 5;
  } else {
    if (timeLeft > 45) points = 10;
    else if (timeLeft > 30) points = 8;
    else if (timeLeft > 15) points = 5;
    else points = 2;
  }
  
  return usedHint ? Math.max(points - 2, 1) : points;
};

const isGameCurrentDay = (gameDate: Date): boolean => {
  const today = new Date().toLocaleDateString('en-CA');
  const formattedGameDate = new Date(gameDate).toLocaleDateString('en-CA');
  return today === formattedGameDate;
};

const ConnectionGame: React.FC<WordGuessGameProps> = ({ 
  id,
  firstImage,
  secondImage,
  thirdImage,
  referenceLink,
  answer, 
  beamsTodayId,
  letterChoiceStudent,
  letterChoiceNonStudent,
  title, 
  hint, 
  username = "Player",
  answerExplanation,
  solutionPoints,
  isCompleted = false,
  gameDate 
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [points, setPoints] = useState<number>(0);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [levelUp, setLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState<any>();
  const [isCompleting, setIsCompleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [showSolution, setShowSolution] = useState<boolean>(isCompleted);
  const [gridInputs, setGridInputs] = useState<string[][]>([]);
  const [isAnswerWrong, setIsAnswerWrong] = useState(false);
  const [initializedGrid, setInitializedGrid] = useState(false);
  const words = answer.split(' ');
  const user: any = useCurrentUser();
  const userType = user?.userType;

 

  useEffect(() => {
    if (isCompleted) {
      setShowSolution(true);
    }
  }, [isCompleted]);

  const initializeGrid = () => {
    if (initializedGrid) return;
    
    const newGrid = words.map(word => Array(word.length).fill(''));
    const letterChoices = userType === 'STUDENT' ? letterChoiceStudent : letterChoiceNonStudent;
    
    let searchIndex = 0;
    const fullText = words.join(' ').toUpperCase();
    
    // Pre-fill letters one by one
    letterChoices.forEach(letter => {
      const foundIndex = fullText.indexOf(letter.toUpperCase(), searchIndex);
      if (foundIndex !== -1) {
        // Convert flat index to row and column
        let remainingIndex = foundIndex;
        let currentRow = 0;
        
        while (remainingIndex >= words[currentRow].length) {
          remainingIndex -= words[currentRow].length + 1; // +1 for space
          currentRow++;
        }
        
        newGrid[currentRow][remainingIndex] = letter.toUpperCase();
        searchIndex = foundIndex + 1;
      }
    });
    
    setGridInputs(newGrid);
    setInitializedGrid(true);
  };

  useEffect(() => {
    initializeGrid();
  }, [words, userType, letterChoiceStudent, letterChoiceNonStudent]);

  const isPreFilled = (rowIndex: number, colIndex: number): boolean => {
    const letterChoices = userType === 'STUDENT' ? letterChoiceStudent : letterChoiceNonStudent;
    const currentLetter = words[rowIndex]?.[colIndex]?.toUpperCase();
    let searchIndex = 0;
    const fullText = words.join(' ').toUpperCase();
    
    for (const letter of letterChoices) {
      const foundIndex = fullText.indexOf(letter.toUpperCase(), searchIndex);
      if (foundIndex !== -1) {
        let remainingIndex = foundIndex;
        let currentRow = 0;
        
        while (remainingIndex >= words[currentRow].length) {
          remainingIndex -= words[currentRow].length + 1;
          currentRow++;
        }
        
        if (currentRow === rowIndex && remainingIndex === colIndex) {
          return true;
        }
        searchIndex = foundIndex + 1;
      }
    }
    return false;
  };
  const handleInputChange = (rowIndex: number, colIndex: number, value: string) => {
    if (!isPreFilled(rowIndex, colIndex)) {
      const newGrid = [...gridInputs];
      
      // Handle input
      if (value) {
        newGrid[rowIndex][colIndex] = value.toUpperCase();
        
        // Move to next empty input
        let nextRow = rowIndex;
        let nextCol = colIndex + 1;
        
        // If we're at the end of current word
        if (nextCol >= words[rowIndex].length) {
          nextRow++;
          nextCol = 0;
        }
        
        // Find next empty non-prefilled cell
        while (
          nextRow < words.length && 
          isPreFilled(nextRow, nextCol)
        ) {
          nextCol++;
          if (nextCol >= words[nextRow].length) {
            nextRow++;
            nextCol = 0;
          }
        }
        
        // Focus next input if available
        if (nextRow < words.length) {
          const nextInput = document.querySelector(
            `input[data-row="${nextRow}"][data-col="${nextCol}"]`
          ) as HTMLInputElement;
          if (nextInput) nextInput.focus();
        }
      }
      
      setGridInputs(newGrid);
    }
  };
  
  const handleKeyDown = (rowIndex: number, colIndex: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !isPreFilled(rowIndex, colIndex)) {
      const newGrid = [...gridInputs];
      const currentValue = newGrid[rowIndex][colIndex];
      
      if (!currentValue) {
        // Move to previous input if current is empty
        let prevRow = rowIndex;
        let prevCol = colIndex - 1;
        
        // If we're at the start of current word
        if (prevCol < 0) {
          prevRow--;
          if (prevRow >= 0) {
            prevCol = words[prevRow].length - 1;
          }
        }
        
        // Find previous non-prefilled cell
        while (
          prevRow >= 0 && 
          prevCol >= 0 && 
          isPreFilled(prevRow, prevCol)
        ) {
          prevCol--;
          if (prevCol < 0) {
            prevRow--;
            if (prevRow >= 0) {
              prevCol = words[prevRow].length - 1;
            }
          }
        }
        
        // Focus and clear previous input if available
        if (prevRow >= 0 && prevCol >= 0) {
          const prevInput = document.querySelector(
            `input[data-row="${prevRow}"][data-col="${prevCol}"]`
          ) as HTMLInputElement;
          if (prevInput) {
            prevInput.focus();
            newGrid[prevRow][prevCol] = '';
          }
        }
      } else {
        newGrid[rowIndex][colIndex] = '';
      }
      
      setGridInputs(newGrid);
    }
  };

  const isGridComplete = () => {
    return gridInputs.every(row => row.every(cell => cell !== ''));
  };

  const checkAnswer = () => {
    const userAnswer = gridInputs
      .map(row => row.join(''))
      .join(' ')
      .toUpperCase();
    return userAnswer === answer.toUpperCase();
  };
  useEffect(() => {
    if (!isCorrect && !showSolution) {
      const handleBeforeUnload = () => {
        handleGameCompletion2();
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [isCorrect, showSolution]);


  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (checkAnswer()) {
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
          setShowModal(true);
        }
      } catch (error) {
        console.error('Error saving game completion:', error);
      }
    } else {
      setIsAnswerWrong(true);
      await handleGameCompletion();
    }
    setIsSubmitting(false);
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

  useEffect(() => {
    if (isCompleted) {
      setShowSolution(true);
    }
  }, [isCompleted]);

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
        setShowSolution(true);
      } catch (error) {
        console.error('Error completing game:', error);
      }
    }
  };

  useEffect(() => {
    if (isAnswerWrong) {
      setShowTimeUpModal(true);
    }
  }, [isAnswerWrong]);

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
                
                <Popover shouldBlockScroll showArrow placement='top' onOpenChange={() => setShowHint(true)}>
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

              <div className="flex flex-col items-center gap-4 mt-4">
                {words.map((word, rowIndex) => (
                  <div key={rowIndex} className="flex gap-1">
                    {word.split('').map((_, colIndex) => {
                      const isPrefilled = isPreFilled(rowIndex, colIndex);
                      return (
                        <input
                        key={colIndex}
                        type="text"
                        maxLength={1}
                        value={gridInputs[rowIndex]?.[colIndex] || ''}
                        onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(rowIndex, colIndex, e)}
                        data-row={rowIndex}
                        data-col={colIndex}
                        className={`w-7 custom-font-size h-7 md:w-8 md:h-8 font-medium text-center rounded-md
                          ${isPrefilled ? 'bg-brand text-white' : 'bg-default-100 text-text border-default-200'}
                          border-2 focus:outline-none focus:border-primary transition-colors`}
                        disabled={isPrefilled}
                      />
                      );
                    })}
                  </div>
                ))}
              </div>
              <Button
                className="w-60 mx-auto text-lg text-white font-semibold"
                color="primary"
                size="lg"
                onClick={handleSubmit}
                isDisabled={!isGridComplete() || isCorrect || timeLeft === 0}
              >
                Submit Answer
              </Button>
            </CardBody>
          </Card>

          {/* Keep all modals the same */}
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
              setShowSolution(true);
            }}
            isAnswerWrong={isAnswerWrong}
            username={username}
            answer={answer}
          />
          <LevelupModal
            levelUp={levelUp}
            beams={points}
            isOpen={isLevelUpModalOpen}
            onClose={() => {
              setIsLevelUpModalOpen(false);
              setShowSolution(true);
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