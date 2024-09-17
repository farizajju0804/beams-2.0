'use client'
import React from 'react';
import Heading from './Heading';
import UserStatus from './UserStatus';
import { useTheme } from 'next-themes';
import Image from 'next/image';

interface User {
  id: string;
  name: string;
  score: number;
  avatarUrl: string;
  rank: number;
}

interface LeaderboardProps {
  users: User[];
  currentUser: User;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ users, currentUser }) => {
  const sortedUsers = [...users].sort((a, b) => a.rank - b.rank);

  return (
    <div className='px-4'>
      <Heading heading='Leaderboard'/>
      <div className='flex flex-col items-center justify-center'>
        <div className="flex flex-col md:flex-row justify-center items-center md:items-end gap-6 md:gap-12 md:mt-8">
          {sortedUsers.slice(0, 3).map((user) => (
            <UserCard 
              key={user.id} 
              user={user} 
              extraClasses={`
                ${currentUser.id === user.id ? 'bg-yellow' : ''}
                ${user.rank === 1 ? 'md:scale-125 md:z-10 order-first md:order-2' : ''}
                ${user.rank === 2 ? 'md:order-1' : ''}
                ${user.rank === 3 ? 'md:order-3' : ''}
              `}
            />
          ))}
        </div>
        <UserStatus rank={currentUser.rank} score={currentUser.score}/>
        <p className='mt-4 text-brand underline font-medium text-center mx-auto text-sm'>View Full Leaderboard</p>
      </div>
    </div>
  );
};

const UserCard: React.FC<{ user: User, extraClasses?: string }> = ({ user, extraClasses }) => {
  const { theme } = useTheme()
  
  return (
    <div className={`p-4 bg-background rounded-3xl shadow-defined flex flex-col items-center ${theme === 'dark' ? 'border border-yellow' : ''} ${extraClasses}`}>
      <div className=" flex flex-col items-center">
        <Image src={user.avatarUrl} alt={user.name} width={1112} height={1112} className="rounded-full w-28 h-28" />
        <span className="-mt-4 w-6 h-6 flex items-center justify-center bg-text text-background text-xs font-bold rounded-full">{user.rank}</span>
      </div>
      <div className="mt-4 flex items-center justify-center flex-col">
        <p className="text-sm md:text-base font-semibold">{user.name}</p>
        <p className="text-secondary-2 font-poppins text-xl font-bold">{user.score}</p>
      </div>
    </div>
  );
};

export default Leaderboard;