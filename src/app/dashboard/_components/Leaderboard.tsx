"use client";

import React from 'react';
import UserStatus from './UserStatus';
import Heading from './Heading';
import { LeaderboardEntry } from '@/actions/dashboard/getLeaderBoard';

interface LeaderboardProps {
  users: LeaderboardEntry[];
  userPosition?: number;
  userPoints?: number;
  message?: string | null;
  startDate?: string; // Change to string
  endDate?: string;   // Change to string
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

const Leaderboard: React.FC<LeaderboardProps> = ({ users, userPoints, userPosition, message, startDate, endDate }) => {
  const sortedUsers = [...users].sort((a, b) => a.rank - b?.rank).slice(0, 3);
  const [secondPlace, firstPlace, thirdPlace] = [sortedUsers[1], sortedUsers[0], sortedUsers[2]];

  return (
    <div>
      <Heading heading={"Leaderboard"} />
      {message && <p className="text-red-500 text-center">{message}</p>}
      {!message && (
        <div className=''>
        
        <div className='px-4 w-full mx-auto'>  
          <div className='flex flex-col items-center justify-center'>
            <div className="flex max-w-2xl justify-center items-end w-full gap-2 md:gap-4">
              {[secondPlace, firstPlace, thirdPlace].map((user: any) => (
                <div
                  key={user.id}
                  className={`${getHeight(user.rank)} ${getColor(user.rank)} rounded-t-lg p-2 md:p-4 flex flex-col items-center justify-end transition-all duration-300 ease-in-out ${user.rank === 1 ? 'w-1/3 md:w-1/3' : 'w-1/4 md:w-1/4'}`}
                >
                  <div className="text-center font-bold text-sm md:text-xl mb-1 md:mb-2 text-wrap w-full">
                    {user.user?.name} {/* Accessing user's full name */}
                  </div>
                  <div className="text-center text-xs md:text-lg">{user.points}</div>
                  <div className="text-center text-lg md:text-3xl font-bold mt-1 md:mt-2">
                    #{user.rank}
                  </div>
                </div>
              ))}
            </div>
            {
              (userPosition &&  userPoints) ?
            (<div className="mt-8 w-full">
              <UserStatus rank={userPosition} score={userPoints} />
            </div>) : (
              <p className='text-sm md:text-base mx-auto font-medium text-center py-4'> Start gaining beams to position yourself in the leaderboard.</p>
            )
            }
            {startDate && endDate && 
          <div className="my-2 text-xs md:text-sm w-full text-center flex items-center justify-center text-grey-2">
            {/* <span className="mr-1">🗓️</span> */}
            <span className='mx-auto w-full px-6'>This leaderboard is calculated based on Beams acclaimed from {new Date(startDate).toLocaleString()} to {new Date(endDate).toLocaleString()}.</span>
          </div>
        }
            <p className='mt-4 text-brand underline font-medium text-center mx-auto text-sm cursor-pointer'>
              View Full Leaderboard
            </p>
            
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
