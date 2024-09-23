"use client";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import UserStatus from './UserStatus';
import Heading from './Heading';
import { announceLeaderboard, LeaderboardEntry } from '@/actions/dashboard/getLeaderBoard';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { UserType } from '@prisma/client';
import { recalculateLeaderboardRanks } from '@/actions/points/updateLeaderboardEntry';
import { getLeaderboardData } from '@/actions/dashboard/getLeaderBoard';
import { Avatar, Spinner, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';
import { getTop3EntriesForMostRecentWeek } from '@/actions/points/getPreviousLeaderboard';

interface LeaderboardProps {
  userId: string;
  initialData: any;
  userType: UserType;
  previous?: any;
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

const Leaderboard: React.FC<LeaderboardProps> = ({ 
  userId, 
  initialData,
  userType, 
  previous 
}) => {
  const [timeRemaining, setTimeRemaining] = useState(initialData.remainingSeconds);
  const [isTimerActive, setIsTimerActive] = useState(timeRemaining > 0);
  const [currentUsers, setCurrentUsers] = useState<LeaderboardEntry[]>(initialData.entries);
  const [lastWeekUsers, setLastWeekUsers] = useState<any[]>(previous || []);
  const [updatedUserPosition, setUpdatedUserPosition] = useState<number | undefined>(initialData.userPosition);
  const [updatedUserPoints, setUpdatedUserPoints] = useState<number | undefined>(initialData.userPoints);
  const [leaderboardMessage, setLeaderboardMessage] = useState<string | null>(initialData.message || null);
  const [isLoading, setIsLoading] = useState(false);
  const lastWeekSectionRef = useRef<HTMLDivElement>(null);

  const handleTimerEnd = useCallback(async () => {
    setIsLoading(true);
    setIsTimerActive(false);

    if (initialData.startDate && initialData.endDate) {
      await recalculateLeaderboardRanks(new Date(initialData.startDate), new Date(initialData.endDate), userType);
    }

    try {
      // First, fetch the data needed for immediate UI update
      const [lastWeekData, nextWeekData] = await Promise.all([
        getTop3EntriesForMostRecentWeek(userType),
        getLeaderboardData(userId, userType, '2024-09-23T18:00:00.413Z')
      ]);

      setLastWeekUsers(lastWeekData);

      if (nextWeekData.entries && nextWeekData.entries.length > 0) {
        setCurrentUsers(nextWeekData.entries);
        setUpdatedUserPosition(nextWeekData.userPosition);
        setUpdatedUserPoints(nextWeekData.userPoints);
        setLeaderboardMessage(null);
        setTimeRemaining(nextWeekData.remainingSeconds);
        setIsTimerActive(true);
      } else {
        setCurrentUsers([]);
        setUpdatedUserPosition(undefined);
        setUpdatedUserPoints(undefined);
        setLeaderboardMessage(nextWeekData.message || "No data available for the next week yet.");
      }

      // After updating the UI, run the heavy operation asynchronously
      announceLeaderboard(userType, new Date(initialData.startDate), new Date(initialData.endDate))
        .catch(error => console.error('Error announcing leaderboard:', error));

    } catch (error) {
      console.error('Error updating leaderboard:', error);
      setLeaderboardMessage("An error occurred while updating the leaderboard.");
    } finally {
      setIsLoading(false);
    }
  }, [userId, userType, initialData.startDate, initialData.endDate]);

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
    if (lastWeekUsers.length > 0 && lastWeekSectionRef.current) {
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
  }, [lastWeekUsers]);

  const renderCurrentWeekTable = useCallback((users: LeaderboardEntry[]) => (
    <Table aria-label="Current Week Leaderboard" className="max-w-2xl mx-auto">
      <TableHeader>
        <TableColumn>Rank</TableColumn>
        <TableColumn>Name</TableColumn>
        <TableColumn>Beams</TableColumn>
      </TableHeader>
      <TableBody>
        {users.slice(0, 3).map((user: LeaderboardEntry) => (
          <TableRow key={user?.id}>
            <TableCell>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold">
                {user?.rank}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                <Avatar src={user?.user?.image || undefined} showFallback alt='profile' className="mr-2" />
                <span>{user?.user?.name}</span>
              </div>
            </TableCell>
            <TableCell className='flex items-center'>{user?.points}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ), []);

  const renderLastWeekWinners = useCallback((users: LeaderboardEntry[]) => (
    <div ref={lastWeekSectionRef} className="relative">
      <h2 className="text-2xl font-bold text-center mb-4">Last Week&apos;s Winners</h2>
      <div className="flex max-w-2xl mb-4 justify-center items-end w-full gap-2 md:gap-4">
        {[users[1], users[0], users[2]].map((user: LeaderboardEntry) => (
          <div key={user?.id} className="flex flex-col items-center">
            <Avatar src={user?.user?.image || undefined} showFallback isBordered alt='profile' className="w-12 h-12 md:w-20 md:h-20 mb-4" />
            <div className={`${getHeight(user?.rank)} ${getColor(user?.rank)} md:w-40 w-24 rounded-t-lg py-6 px-2 md:px-4 flex flex-col items-center justify-between transition-all duration-300 ease-in-out`}>
              <Image src={getBadgeImage(user?.rank)} alt={`Rank ${user?.rank} badge`} width={40} height={60} />
              <div className='flex flex-col items-center'>
                <div className="text-center text-black font-bold text-sm md:text-xl mb-1 md:mb-2 text-wrap w-full">
                  {user?.user?.firstName} {user?.user?.lastName}
                </div>
                <div className="text-center text-black text-xs md:text-lg">{user?.points}</div>
              </div>
              <div className="bg-black text-white rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-lg md:text-2xl font-bold">
                {user?.rank}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ), []);

  const formatTime = useCallback((seconds: number) => {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return { days, hours, minutes, seconds: remainingSeconds };
  }, []);

  return (
    <div className="relative">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <Spinner size="lg" color="primary" />
        </div>
      )}
      <Heading heading="Leaderboard" />
      {leaderboardMessage && <p className="px-2 text-text text-center">{leaderboardMessage}</p>}
      
      <div className='px-4 w-full mx-auto'>
        <div className='w-full flex flex-col items-center justify-center'>
          {currentUsers.length >= 3 && (
            <div className="w-full mb-8">
              <h2 className="text-2xl font-bold text-center mb-4">Current Week Top 3</h2>
              {renderCurrentWeekTable(currentUsers)}
            </div>
          )}
          {(updatedUserPosition && updatedUserPoints) ? (
            <UserStatus rank={updatedUserPosition} score={updatedUserPoints} />
          ) : (
            <p className="w-full mt-4 text-center mx-auto">Start acclaiming beams to position yourself in the leaderboard</p>
          )}
          {currentUsers.length >= 3 && isTimerActive && (
            <div className='w-full max-w-xl'>
              <p className='my-4 mx-auto text-center'>Leaderboard will be reset in</p>
              <div className="w-full max-w-xl flex justify-around p-4 border border-gray-300 rounded-lg bg-background shadow-lg">
                {Object.entries(formatTime(timeRemaining)).map(([unit, value]) => (
                  <div key={unit} className="flex flex-col items-center">
                    <div className="text-2xl font-bold">{value}</div>
                    <div className="text-sm">{unit.charAt(0).toUpperCase() + unit.slice(1)}</div>
                  </div>
                ))}
              </div>
            </div>
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