"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import UserStatus from './UserStatus';
import { announceLeaderboard, getLeaderboardData } from '@/actions/dashboard/getLeaderBoard';
import confetti from 'canvas-confetti';
import { UserType } from '@prisma/client';
import { recalculateLeaderboardRanks } from '@/actions/points/updateLeaderboardEntry';
import { Avatar, Spinner, Button, Modal, useDisclosure, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { getTop3EntriesForMostRecentWeek } from '@/actions/points/getPreviousLeaderboard';
import { CountdownTimer } from './CountdownTimer';
import { AiFillQuestionCircle, AiFillTrophy, AiFillClockCircle, AiFillStar } from "react-icons/ai";
import './style.css'
import LowerRanksCards from './LowerRanksCard';
import Image from 'next/image';

interface LeaderboardProps {
  userId: string;
  initialData: any;
  userType: UserType;
}

interface LeaderboardProps {
  userId: string;
  initialData: any;
  userType: UserType;
  previous?: any;
}

const getHeight = (position: number) => {
  switch (position) {
    case 1: return 'h-72 leaderboard-1 md:h-96';
    case 2: return 'h-64 leaderboard-2 md:h-80';
    case 3: return 'h-56 leaderboard-3 md:h-72';
    default: return 'h-48';
  }
};

const getClass = (position: number) => {
  switch (position) {
    case 1: return 'perspective-div-1';
    case 2: return 'perspective-div-2';
    case 3: return 'perspective-div-3';
    default: return 'right-0';
  }
};

const getColor = (position: number) => {
  switch (position) {
    case 1: return 'bg-secondary-2 text-background';
    case 2: return 'bg-secondary-2 text-background';
    case 3: return 'bg-secondary-2 text-background';
    default: return 'bg-secondary-2 text-background';
  }
};

const getSize = (position: number) => {
  switch (position) {
    case 1: return 'text-[80px]';
    case 2: return 'text-[60px]';
    case 3: return 'text-5xl';
    default: return 'text-4l';
  }
};


const Leaderboard: React.FC<LeaderboardProps> = ({ 
  userId, 
  initialData,
  userType,
  previous
}) => {
  const [timeRemaining, setTimeRemaining] = useState(initialData.remainingSeconds);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [lastWeekUsers, setLastWeekUsers] = useState<any[]>(previous);
  const [userPosition, setUserPosition] = useState<number | undefined>(initialData.userPosition);
  const [userPoints, setUserPoints] = useState<number | undefined>(initialData.userPoints);
  // const [leaderboardMessage, setLeaderboardMessage] = useState<string | null>(initialData.message || null);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(initialData.startDate);
  const [endDate, setEndDate] = useState(initialData.endDate);
  const lastWeekSectionRef = useRef<HTMLDivElement>(null);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
    // Client-side parsed dates
    const [formattedStartDate, setFormattedStartDate] = useState<string | null>(null);
    const [formattedEndDate, setFormattedEndDate] = useState<string | null>(null);
  
    useEffect(() => {
      // Ensure dates are only parsed client-side after hydration
      if (startDate && endDate) {
        setFormattedStartDate(new Date(startDate).toLocaleDateString());
        setFormattedEndDate(new Date(endDate).toLocaleDateString());
      }
    }, [startDate, endDate])

  const playConfetti = useCallback(() => {
    if (lastWeekSectionRef.current) {
      const rect = lastWeekSectionRef.current.getBoundingClientRect();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { 
          y: (rect.top + rect.height / 2) / window.innerHeight,
          x: 0.5
        },
        zIndex: 1000,
      });
    }
  }, []);

  const handleTimerEnd = useCallback(async () => {
    setIsLoading(true);
    setIsTimerActive(false);

    if (startDate && endDate) {
      await recalculateLeaderboardRanks(new Date(startDate), new Date(endDate), userType);
    }

    try {
      const [lastWeekData, nextWeekData]:any = await Promise.all([
        getTop3EntriesForMostRecentWeek(userType),
        // getLeaderboardData(userId, userType,'2024-09-24T18:00:00.413Z')
        getLeaderboardData(userId, userType)

      ]);

      setLastWeekUsers(lastWeekData);

      setUserPosition(nextWeekData.userPosition);
      setUserPoints(nextWeekData.userPoints);
      // setLeaderboardMessage(nextWeekData.message);
      setTimeRemaining(nextWeekData.remainingSeconds);
      setStartDate(nextWeekData.startDate);
      setEndDate(nextWeekData.endDate);
      setIsTimerActive(true);

      // announceLeaderboard(userType, new Date(startDate), new Date(endDate))
      //   .catch(error => console.error('Error announcing leaderboard:', error));

      playConfetti(); // Play confetti when timer ends and new data is loaded

    } catch (error) {
      console.error('Error updating leaderboard:', error);
      // setLeaderboardMessage("An error occurred while updating the leaderboard.");
    } finally {
      setIsLoading(false);
    }
  }, [userId, userType, startDate, endDate, playConfetti]);

  useEffect(() => {
    let timerInterval: NodeJS.Timeout;

    if (isTimerActive) {
      timerInterval = setInterval(() => {
        setTimeRemaining((prevTime:any) => {
          if (prevTime <= 1) {
            clearInterval(timerInterval);
            handleTimerEnd();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [isTimerActive, handleTimerEnd]);

  useEffect(() => {
    if (lastWeekUsers.length >= 3) {
   
      playConfetti();
    }
  }, [lastWeekUsers]);

  const renderLastWeekWinners = useCallback((users: any) => (
    <div ref={lastWeekSectionRef} className="">
     <div className='flex w-full items-center justify-center gap-4 mb-12'>
      <h1 className='font-poppins text-lg md:text-2xl font-semibold'>Last Week&apos;s Winners</h1>
      </div>
      <div className="flex max-w-2xl mb-4 justify-center items-end w-full">
        {[users[1], users[0], users[2]].map((user: any) => (
          <div key={user?.id} className="flex relative flex-col items-center">
             {user.rank === 1 && (
                <Image src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1727176494/achievements/crown-3d_hpf6hs.png" width={300} height={300} alt="Crown" className="w-12 h-12 absolute top-[-30px]" />
              )}
            <Avatar src={user?.user?.image || undefined} showFallback isBordered alt='profile' className="w-12 h-12 md:w-20 md:h-20 mb-4" />
            <div className="text-center text-text font-bold text-sm md:text-lg mb-6 text-wrap w-5/6">
              {user?.user?.firstName} {user?.user?.lastName}
            </div>
            <div className={`${getHeight(user?.rank)} ${getColor(user?.rank)} md:w-40 w-24 py-6 px-2 md:px-4 flex flex-col items-center justify-center transition-all duration-300 ease-in-out leaderboard-position`}>
            <div 
   className={`perspective-div ${getClass(user?.rank)}`}
  
  ></div>
             
              <div className={`${getSize(user?.rank)}  rounded-full text-5xl font-poppins flex flex-col items-center justify-center gap-4 font-bold`}>
                {user?.rank}
                <div className="text-center font-normal text-grey-1 text-xs md:text-lg">{user?.points} Beams</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {users.length > 3 && <LowerRanksCards users={users} />}
    </div>
  ), []);
  
  const RuleItem = ({ icon, title, description }:any) => (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm opacity-80">{description}</p>
      </div>
    </div>
  );
  const renderOverlay = () => {
    
    return (
      <Modal 
      size='2xl'
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        backdrop="blur"
        className="bg-background"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-text">Leaderboard Rules</h2>
              </ModalHeader>
              <ModalBody className="text-text">
                <div className="space-y-4">
                  <RuleItem 
                    icon={<AiFillClockCircle className="text-yellow-300" size={24} />}
                    title="Weekly Competition"
                    description="Starts every Saturday at 11:00 AM (US Pacific Time) and ends the following Saturday at 10:59 AM."
                  />
                  <RuleItem 
                    icon={<AiFillStar className="text-yellow-300" size={24} />}
                    title="Point Accumulation"
                    description="Only beams accumulated during the competition period will count."
                  />
                  <RuleItem 
                    icon={<AiFillTrophy className="text-yellow-300" size={24} />}
                    title="Tiebreakers"
                    description="In case of ties, the user who accumulated the beams first will be ranked higher."
                  />
                  <RuleItem 
                    icon={<AiFillStar className="text-yellow-300" size={24} />}
                    title="Leaderboard Display"
                    description="The top 10 users will be featured on the leaderboard each week."
                  />
                  <RuleItem 
                    icon={<AiFillTrophy className="text-yellow-300" size={24} />}
                    title="Special Recognition"
                    description="The top 3 users will earn special badges!"
                  />
                </div>
             
               
              </ModalBody>
              <ModalFooter>
                   <Button 
                  color="warning" 
                  variant="shadow"
                  onPress={onClose}
                  className="mt-4 w-full"
                >
                  Got it!
                </Button>
                </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  };

  
  return (
    <div className="relative">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <Spinner size="lg" color="primary" />
        </div>
      )}
      <div className='w-full flex justify-between pl-6 lg:pl-0 pr-6'>
        <div className="flex flex-col items-start">
          <h1 className="text-lg md:text-2xl text-text font-poppins font-semibold mb-[1px]">Leaderboard</h1>
          <div className="border-b-2 border-brand mb-3 w-[60px]" ></div>
        </div>
        <Button isIconOnly className='bg-transparent text-[#888888] cursor-pointer' onPress={onOpen}>
          <AiFillQuestionCircle size={24} />
        </Button>
        {renderOverlay()} 
      </div>
      {/* {leaderboardMessage && <p className="px-2 text-text text-center">{leaderboardMessage}</p>} */}
      
      <div className='px-4 w-full mx-auto'>
        <div className='w-full flex flex-col items-center justify-center'>
          {isTimerActive && (
            <div className='w-full max-w-xl'>
              <p className='my-4 mx-auto text-[#888888] font-medium text-center'>{`Leaders for this week ( ${formattedStartDate} to ${formattedEndDate}) will be announced in`}</p>
              <CountdownTimer timeRemaining={timeRemaining} />
            </div>
          )}
          {(userPosition && userPoints) ? (
            <UserStatus rank={userPosition} score={userPoints} />
          ) : (
            <p className="w-full mt-4 text-center mx-auto">Start acclaiming beams to position yourself in the leaderboard</p>
          )}
          {lastWeekUsers.length >= 3 && (
            <>
              <hr className="w-full my-8 border-t border-gray-300" />
              {renderLastWeekWinners(lastWeekUsers)}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;