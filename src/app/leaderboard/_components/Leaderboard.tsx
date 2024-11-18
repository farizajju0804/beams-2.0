"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {  getLeaderboardData } from '@/actions/dashboard/getLeaderBoard';
import confetti from 'canvas-confetti';
import { UserType } from '@prisma/client';
import { Avatar, Spinner, Button,Popover, PopoverTrigger, PopoverContent , useDisclosure } from '@nextui-org/react';
import { getTop3EntriesForMostRecentWeek } from '@/actions/points/getPreviousLeaderboard';
import { CountdownTimer } from './CountdownTimer';
import { AiFillQuestionCircle } from "react-icons/ai";
import Image from 'next/image';
import LowerRanksTable from './LowerRanksCard';
import { finalizeLeaderboardPeriod } from '@/actions/points/updateLeaderboardEntry';
import WeeklyDisplay from './WeeklyDisplay';
import { LeaderboardRules } from './LeaderBoardRules';

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
  const [weekData,setWeekData] = useState(initialData);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [lastWeekUsers, setLastWeekUsers] = useState<any[]>(previous.entries);
  const [lastWeekUserPosition, setLastWeekUserPosition] = useState<number | undefined>(previous.userPosition);
  const [lastWeekUserPoints, setLastWeekUserPoints] = useState<number | undefined>(previous.userPoints);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(initialData.startDate);
  const [endDate, setEndDate] = useState(initialData.endDate);
  const lastWeekSectionRef = useRef<HTMLDivElement>(null);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  // const achievementUpdateLock = useRef(false); 
    // Client-side parsed dates
 

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
      setWeekData(nextWeekData)
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
        <LeaderboardRules isOpen={isOpen} onOpenChange={onOpenChange}/>
      </div>      
      <div className='px-4 py-2 w-full mx-auto'>
        <div className='w-full flex flex-col gap-6 items-center justify-center'>
         
          <WeeklyDisplay data={weekData} currentUserId={userId}/>
          {isTimerActive && (
            <div className='w-full  max-w-xl'>
              <p className='text-base font-semibold mx-auto text-grey-2 text-center'>{`Winners will be announced in`}</p>
              <CountdownTimer timeRemaining={timeRemaining} />
            </div>
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