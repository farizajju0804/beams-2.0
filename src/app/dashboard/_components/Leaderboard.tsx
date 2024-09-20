"use client";
import React, { useEffect, useState } from 'react';
import UserStatus from './UserStatus';
import Heading from './Heading';
import { LeaderboardEntry } from '@/actions/dashboard/getLeaderBoard';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { UserType } from '@prisma/client';
import { recalculateLeaderboardRanks } from '@/actions/points/updateLeaderboardEntry';
import { getLeaderboardData } from '@/actions/dashboard/getLeaderBoard';
import { Avatar } from '@nextui-org/react';
import { getTop3EntriesForMostRecentWeek } from '@/actions/points/getPreviousLeaderboard';

interface LeaderboardProps {
  userId: string;
  users: LeaderboardEntry[];
  userPosition?: number;
  userPoints?: number;
  message?: string | null;
  startDate?: string;
  endDate?: string;
  userType: UserType;
  previous?: any; // This should hold last week users
}

const getHeight = (position: number) => {
  switch (position) {
    case 1: return 'h-72 md:h-96';
    case 2: return 'h-64 md:h-80';
    case 3: return 'h-56 md:h-72';
    default: return 'h-48';
  }
};

const getColor = (position: number) => {
  switch (position) {
    case 1: return 'bg-yellow';
    case 2: return 'bg-gray-300';
    case 3: return 'bg-orange-300';
    default: return 'bg-blue-200';
  }
};

const getBadgeImage = (position: number) => {
  switch (position) {
    case 1: return 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1726574962/achievements/silver-3d_ba5jkn.webp';
    case 2: return 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1726574962/achievements/silver-3d_ba5jkn.webp';
    case 3: return 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1726574962/achievements/bronze-3d_jephy6.webp';
    default: return 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1726574962/achievements/silver-3d_ba5jkn.webp';
  }
};

const CustomModal = ({ isOpen, onClose, children }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-background p-8 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Last Week&apos;s Top 3!</h2>
          <button onClick={onClose} className="text-text">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Leaderboard: React.FC<LeaderboardProps> = ({ userId, users, userPosition, userPoints, message, startDate, endDate, userType, previous }) => {
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentUsers, setCurrentUsers] = useState<LeaderboardEntry[]>(users);
  const [isPastCutoff, setIsPastCutoff] = useState(false);
  const [lastWeekUsers, setLastWeekUsers] = useState<any[]>(previous || []); // Initialize with previous prop
  const [userWatchedTimerEnd, setUserWatchedTimerEnd] = useState(false);
  const [updatedUserPosition, setUpdatedUserPosition] = useState<number | undefined>(userPosition);
  const [updatedUserPoints, setUpdatedUserPoints] = useState<number | undefined>(userPoints);

  useEffect(() => {
    if (!startDate || !endDate) {
      return;
    }
    const endDateLocale = new Date(endDate).toLocaleString(); 
    console.log("end",endDateLocale) 
    const endDateLocal = new Date(endDateLocale).getTime();
  
    const now2 = new Date().toLocaleString();
    const now =new Date(now2).getTime();
    console.log("now",now2)
    if (now > endDateLocal) {
      setIsPastCutoff(true);
      setIsTimerActive(false);
      fetchLastWeekData();
      return;
    }

    const timerInterval = setInterval(() => {
      const currentTime = new Date().getTime();
      const distance = endDateLocal - currentTime;

      if (distance < 0) {
        clearInterval(timerInterval);
        handleTimerEnd();
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [endDate, startDate, userType]);

  const handleTimerEnd = async () => {
    setIsTimerActive(false);
    setIsPastCutoff(true);
    setUserWatchedTimerEnd(true);
    if (startDate && endDate) {
      await recalculateLeaderboardRanks(new Date(startDate), new Date(endDate), userType);
    }
    await fetchLastWeekData(); // Call again to refresh last week data
    openResultsModal();

    // Fetch next week's leaderboard data using the endDate received
    const nextWeekData = await getLeaderboardData('', userId, userType);
    setCurrentUsers(nextWeekData.entries);
    
    // Update user position and points after the timer ends
    const updatedUser = nextWeekData.entries.find(user => user.id === userId);
    if (updatedUser) {
      setUpdatedUserPosition(updatedUser.rank);
      setUpdatedUserPoints(updatedUser.points);
    }

    resetTimer(nextWeekData.endDate);
    setIsTimerActive(true);
  };

  const resetTimer = (nextEndDate?: string) => {
    if (nextEndDate) {
      const endDateLocale = new Date(nextEndDate).toLocaleString();  
      const endDateLocal = new Date(endDateLocale).getTime();
      const now = new Date().getTime();
      const distance = endDateLocal - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
      setIsTimerActive(true);
    }
  };

  const fetchLastWeekData = async () => {
    const lastWeekData = await getTop3EntriesForMostRecentWeek('', userType);
    setLastWeekUsers(lastWeekData);
  };

  const openResultsModal = () => {
    setShowModal(true);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  const sortedUsers = [...currentUsers].sort((a, b) => a.rank - b.rank).slice(0, 3);
  const [firstPlace, secondPlace, thirdPlace] = sortedUsers;

  return (
    <div>
      <Heading heading={"Leaderboard"} />
      {message && <p className="text-text text-center">{message}</p>}
      
        <div>
          <div className='px-4 w-full mx-auto'>
            <div className='flex flex-col items-center justify-center'>
            {users.length >=3 && ( 
              <div className="flex max-w-2xl justify-center items-end w-full gap-2 md:gap-4">
                
                {[secondPlace, firstPlace, thirdPlace].map((user: any) => (
                  <div key={user?.id} className="flex flex-col items-center">
                    <Avatar src={user?.user?.image} showFallback isBordered alt='profile' className="w-12 h-12 md:w-20 md:h-20 mb-4" />
                    <div className={`${getHeight(user?.rank)} ${getColor(user?.rank)} md:w-40 w-24 rounded-t-lg py-6 px-2 md:px-4 flex flex-col items-center justify-between transition-all duration-300 ease-in-out`}>
                      <Image src={getBadgeImage(user?.rank)} alt={`Rank ${user?.rank} badge`} width={60} height={80} />
                      
                      <div className='flex flex-col items-center'>
                      
                        <div className="text-center font-bold text-sm md:text-xl mb-1 md:mb-2 text-wrap w-full">
                          {user?.user?.name}
                        </div>
                        
                        <div className="text-center text-xs md:text-lg">{user?.points}</div>
                      </div>
                      <div className="bg-black text-white rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-lg md:text-2xl font-bold">
                        {user?.rank}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              )}
              {updatedUserPosition !== undefined && updatedUserPoints !== undefined && (
                <UserStatus rank={updatedUserPosition} score={updatedUserPoints} />
              )}
              {users.length >=3 && isTimerActive && (
                <div className='w-full max-w-xl '>
                  <p className='my-4 mx-auto text-center'>Leaderboard will be reset in</p>
                  <div className="w-full max-w-xl flex justify-around p-4 border border-gray-300 rounded-lg bg-white shadow-lg">
                    <div className="flex flex-col items-center">
                      <div className="text-2xl font-bold">{timeRemaining.days}</div>
                      <div className="text-sm">Days</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-2xl font-bold">{timeRemaining.hours}</div>
                      <div className="text-sm">Hours</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-2xl font-bold">{timeRemaining.minutes}</div>
                      <div className="text-sm">Minutes</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-2xl font-bold">{timeRemaining.seconds}</div>
                      <div className="text-sm">Seconds</div>
                    </div>
                  </div>
                </div>
              )} 
              { lastWeekUsers.length >= 3 ? (
                <div className="mt-4 text-center">
                  <button 
                    onClick={openResultsModal} 
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  >
                    View Last Week Results
                  </button>
                  <p className="mt-4 text-lg font-semibold text-center">
                    Leaderboard for this week has ended. Check the results!
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
     
      <CustomModal isOpen={showModal} onClose={() => setShowModal(false)}>
        <p className="mb-4">Congratulations to our top performers!</p>
        {lastWeekUsers.slice(0, 3).map((user: any, index) => (
          <div key={user?.id} className="flex items-center mb-6">
            <Avatar src={user?.user?.image} showFallback isBordered alt='profile' size="lg" className="mr-4" />
            <span className="font-bold">{index + 1}. {user?.user?.firstName} {user?.user?.lastName}</span>
            <span className="ml-2">{user.points} points</span>
          </div>
        ))}
      </CustomModal>
    </div>
  );
};

export default Leaderboard;
