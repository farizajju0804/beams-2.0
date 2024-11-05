"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import UserStatus from './UserStatus';
import {  getLeaderboardData } from '@/actions/dashboard/getLeaderBoard';
import confetti from 'canvas-confetti';
import { UserType } from '@prisma/client';
import { Avatar, Spinner, Button, Modal,Popover, PopoverTrigger, PopoverContent , useDisclosure, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { getTop3EntriesForMostRecentWeek } from '@/actions/points/getPreviousLeaderboard';
import { CountdownTimer } from './CountdownTimer';
import { AiFillQuestionCircle, AiFillClockCircle,  AiFillGift, AiFillCrown, AiFillThunderbolt, AiFillFire } from "react-icons/ai";
import { PiNumberCircleThreeDuotone } from "react-icons/pi";

import Image from 'next/image';
import LowerRanksTable from './LowerRanksCard';
import { updateAchievementsAfterLeaderboard } from '@/actions/points/updateAchievementsAfterLeaderboard';
import { finalizeLeaderboardPeriod } from '@/actions/points/updateLeaderboardEntry';

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
    case 1: return 'h-80 leaderboard-1 ';
    case 2: return 'h-64 leaderboard-2 ';
    case 3: return 'h-56 leaderboard-3';
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
    case 1: return 'bg-brand text-white';
    case 2: return 'bg-yellow text-white';
    case 3: return 'bg-purple text-white';
    default: return 'bg-purple text-white';
  }
};

const getSize = (position: number) => {
  switch (position) {
    case 1: return 'text-[70px]';
    case 2: return 'text-[70px]';
    case 3: return 'text-[70px]';
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
  const [lastWeekUsers, setLastWeekUsers] = useState<any[]>(previous.entries);
  const [userPosition, setUserPosition] = useState<number | undefined>(initialData.userPosition);
  const [userPoints, setUserPoints] = useState<number | undefined>(initialData.userPoints);
  const [lastWeekUserPosition, setLastWeekUserPosition] = useState<number | undefined>(previous.userPosition);
  const [lastWeekUserPoints, setLastWeekUserPoints] = useState<number | undefined>(previous.userPoints);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(initialData.startDate);
  const [endDate, setEndDate] = useState(initialData.endDate);
  const lastWeekSectionRef = useRef<HTMLDivElement>(null);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  // const achievementUpdateLock = useRef(false); 
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

    const markIsYou = (users: any[], userId: string) => {
      return users.map((user) => {
        if (user.userId === userId) {
          return { ...user, isYou: true };
        }
        return user;
      });
    };
    useEffect(() => {
      if (lastWeekUserPosition) {
        setLastWeekUsers((users) => markIsYou(users, userId));
      }
    }, [userId, lastWeekUserPosition]);
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
      // await recalculateLeaderboardRanks2(new Date(startDate), new Date(endDate), userType);
      await finalizeLeaderboardPeriod(new Date(startDate), new Date(endDate), userType);

    }

    try {
      const [lastWeekData, nextWeekData]:any = await Promise.all([
        getTop3EntriesForMostRecentWeek(userType,userId),
        getLeaderboardData(userId, userType)
      ]);

      setLastWeekUsers(markIsYou(lastWeekData.entries, userId));

      setUserPosition(nextWeekData.userPosition);
      setUserPoints(nextWeekData.userPoints);
      setTimeRemaining(nextWeekData.remainingSeconds);
      setStartDate(nextWeekData.startDate);
      setEndDate(nextWeekData.endDate);
      setLastWeekUserPosition(lastWeekData.userPosition); 
      setLastWeekUserPoints(lastWeekData.userPoints); 
      setIsTimerActive(true);

 

      playConfetti(); // Play confetti when timer ends and new data is loaded
      // if (!achievementUpdateLock.current) {
      //   achievementUpdateLock.current = true;  // Lock further execution
      //   await updateAchievementsAfterLeaderboard(userType);
      // }
    } catch (error) {
      console.error('Error updating leaderboard:', error);
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
      <div ref={lastWeekSectionRef}>
        <div className='flex w-full items-center justify-center gap-4 mb-[60px]  md:mb-[80px]'>
          <h1 className='font-poppins text-lg md:text-2xl font-semibold'>Last Week&apos;s Winners</h1>
        </div>
        <div className="flex max-w-2xl mb-4 justify-center items-end w-full">
          {[users[1], users[0], users[2]].map((user: any, index: number) => (
            <div key={user?.id} className={`flex relative flex-col items-center w-1/3`}>
              {user.rank === 1 && (
                <Image src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1727176494/achievements/crown-3d_hpf6hs.png" width={300} height={300} alt="Crown" className="w-10 h-10 md:h-16 md:w-16 absolute top-[-30px] md:top-[-40px]" />
              )}
                {user.rank === 2 && (
                <Image src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1727176494/achievements/crown-3d_hpf6hs.png" width={300} height={300} alt="Crown" className="w-10 h-10 md:h-16 md:w-16 absolute top-[-30px] md:top-[-40px]" />
              )}
                {user.rank === 3 && (
                <Image src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1727176494/achievements/crown-3d_hpf6hs.png" width={300} height={300} alt="Crown" className="w-10 h-10 md:h-16 md:w-16 absolute top-[-30px] md:top-[-40px]" />
              )}
              <Avatar src={user?.user?.image || undefined} showFallback isBordered alt="profile" className="w-12 h-12 md:w-20 md:h-20 mb-3" />
              <Popover showArrow placement="bottom">
            <PopoverTrigger>
              <div 
                className={`text-center text-text text-sm md:text-lg mb-3 text-wrap truncate max-w-20 w-full ${
                  user.isYou ? 'font-bold' : 'font-medium'
                } cursor-pointer hover:opacity-80`}
              >
                {`${user?.user?.firstName} ${user?.user?.lastName} ${user.isYou ? '(You)' : ''}`}
              </div>
            </PopoverTrigger>
            <PopoverContent className="p-2">
              <div className="text-sm text-center font-normal">
                {`${user?.user?.firstName} ${user?.user?.lastName} ${user.isYou ? '(You)' : ''}`}
              </div>
            </PopoverContent>
          </Popover>
              <div className="text-center  font-medium p-1 bg-text text-background text-xs md:text-sm">{user?.points} Beams</div>

              <div className={`${getHeight(user?.rank)}  ${getColor(user?.rank)} w-full py-6 px-2 md:px-4 flex flex-col items-center justify-center transition-all duration-300 ease-in-out leaderboard-position`}
              style={{
                boxShadow: '0 8px 10px rgba(0,0,0,0.3)',
                zIndex: 1
              }}
              >
                <div className={`perspective-div ${getClass(user?.rank)}`}></div>
                <div className={`${getSize(user?.rank)}  rounded-full text-5xl font-poppins flex flex-col items-center justify-center gap-4 font-bold`}>
                  {user?.rank}
                </div>
              </div>
            </div>
          ))}
        </div>
      {users.length > 3 && <LowerRanksTable userPosition={lastWeekUserPosition}  users={users} />}
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
  const renderUserPosition = useCallback(() => {
    if (lastWeekUserPosition && lastWeekUserPosition > 10 ) {
      return (
        <div className="w-full max-w-sm mx-auto mt-8 p-4 bg-yellow rounded-lg shadow-defined">
          <h2 className="text-lg mb-2 text-center md:text-xl font-bold">You are ranked #{lastWeekUserPosition}!</h2>
          <p className="text-sm text-center">Keep going! You&apos;ve earned <span className='font-semibold'>{lastWeekUserPoints} Beams</span> previous week.</p>
        </div>
      );
    }
    return null;
  }, [lastWeekUserPosition, lastWeekUserPoints]);
  const renderOverlay = () => {
    
    return (
      <Modal 
      size='2xl'
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        backdrop="blur"
        className="bg-background"
        classNames={{
          wrapper : 'z-[250]'
        }}
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
              icon={<AiFillClockCircle className="text-blue-500" size={24} />}
              title="Weekly Competition"
              description={`Starts every Saturday at 11:00 AM (US Pacific Time) and ends the following Saturday at 10:59 AM (US Pacific Time).`}
            />
            <RuleItem 
                  icon={<PiNumberCircleThreeDuotone className="text-green-500 text-2xl" />}
                  title="Minimum Participation"
                  description="Leaderboard results will only be announced when there are at least 3 entries in the current week."
                />
            <RuleItem 
              icon={<AiFillFire className="text-red-500" size={24} />}
              title="Point Accumulation"
              description="Only beams accumulated during the competition period will count."
            />
           <RuleItem 
            icon={<AiFillThunderbolt className="text-green-500" size={24} />}
            title="Tiebreakers"
            description="If there are ties in beam count, all users with the same beams will receive the same rank. However, for the weekly leaderboard display, the user who accumulated beams first will appear higher, showing only the top entry for each beam count."
          />

            <RuleItem 
              icon={<AiFillCrown className="text-yellow" size={24} />}
              title="Leaderboard Display"
              description="The top 10 users will be featured on the leaderboard each week."
            />
            {/* <RuleItem 
              icon={<AiFillGift className="text-pink-500" size={24} />}
              title="Special Recognition"
              description="The top 3 users will earn special badges!"
            /> */}
          </div>
               
             
               
              </ModalBody>
              <ModalFooter>
                   <Button 
                  color="warning" 
                  variant="shadow"
                  onPress={onClose}
                  className="mt-4 w-full text-black font-semibold text-lg"
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
            <p className="w-fit mt-4 text-center p-3 font-semibold rounded-2xl bg-yellow text-black mx-auto">Your current position will be shown here as you start gaining beams.</p>
          )}
          {lastWeekUsers.length >= 3 && (
            <>
              <hr className="w-full my-8 border-t border-gray-300" />
              {renderLastWeekWinners(lastWeekUsers)}
            </>
          )}
           {renderUserPosition()}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;