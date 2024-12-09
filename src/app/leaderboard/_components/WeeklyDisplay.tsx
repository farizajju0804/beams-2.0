'use client'
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Button,
} from "@nextui-org/react";
import {
  Lock1,
  TrendUp,
  Cup
} from "iconsax-react";
import { LeaderboardData } from '@/actions/dashboard/getLeaderBoard';
import Link from 'next/link';
import { useCurrentUser } from '@/hooks/use-current-user';

interface LeaderboardDisplayProps {
  data: LeaderboardData;
  currentUserId: string;
}

const WeeklyDisplay: React.FC<LeaderboardDisplayProps> = ({
  data,
  currentUserId
}) => {

    const [formattedStartDate, setFormattedStartDate] = useState<string | null>(null);
    const [formattedEndDate, setFormattedEndDate] = useState<string | null>(null);
    const currentUser = useCurrentUser()
    useEffect(() => {
      // Ensure dates are only parsed client-side after hydration
      if (data.startDate && data.endDate) {
        const formatDate = (date: Date) => {
          return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          });
        };
        
        setFormattedStartDate(formatDate(new Date(data.startDate)));
        setFormattedEndDate(formatDate(new Date(data.endDate)));
      }
    }, [data.startDate, data.endDate]);
  const getRankDisplay = (rank: number) => {
    const colors = {
      1: "bg-primary text-white",
      2: "bg-yellow text-black",
      3: "bg-purple text-white",
      default: "bg-default-100 text-default-600"
    };

    const colorClass = colors[rank as keyof typeof colors] || colors.default;

    return (
      <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center`}>
        <span className="text-sm font-bold">{rank}</span>
      </div>
    );
  };

  // Check if user is not in top 10
  const userNotInTop10 = !data.topEntries.some(entry => entry.userId === currentUserId);
  const hasUserPosition = data.userPosition !== null && data.userPosition !== undefined;

  return (
    <Card className="max-w-md w-full mx-auto">
      <CardHeader className="flex flex-col p-0 px-3 pt-3 m-0 gap-1 items-center justify-center">
        <h4 className="text-xl md:text-2xl font-bold">Weekly Ranking</h4>
        <p className='text-sm text-grey-2 mt-2'>{` From ${formattedStartDate} to ${formattedEndDate}`}</p>
      </CardHeader>
      
      <CardBody>
        <div className="flex flex-col gap-6">
          {data.topEntries.map((entry) => {
            const isCurrentUser = entry.userId === currentUserId;
            
            return (
              <div
                key={entry.userId}
                className={`flex items-center p-2 rounded-xl transition-all ${
                  isCurrentUser
                    ? 'bg-primary-50 border border-primary shadow-defined'
                    : ''
                }`}
              >
                {/* Rank */}
                <div className="w-12 flex justify-center">
                  {getRankDisplay(entry.rank)}
                </div>

                {/* Name/Lock Section */}
                <div className=" w-full  mx-3">
                  {isCurrentUser ? (
                    <span className="text-sm text-wrap font-semibold">
                      {currentUser?.firstName} {currentUser?.lastName} (You)
                    </span>
                  ) : (
                    <div className="w-28 mx-3 h-8 rounded-full bg-default-100 flex items-center justify-center shadow-md">
                      Anonymous 
                    </div>
                  )}
                </div>

                {/* Points */}
                <div className="text-right">
                  <span className="font-mono font-semibold text-lg">
                    {entry.points}
                  </span>
                  <span className="text-default-500 text-sm ml-1">Beams</span>
                </div>

                {/* Current User Indicator */}
                {isCurrentUser && (
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse ml-2" />
                )}
              </div>
            );
          })}
          {data.topEntries.length < 3 && (
            <p className='text-sm px-2 text-grey-2 text-center'>Ranking will be updated here as soon as there are at least 3 entries.</p>
          )}
        </div>

        {/* User Position (when not in top 10) or Empty State */}
        {(userNotInTop10 || !hasUserPosition) && (
          <>
            <Divider className="my-2" />
            
            {hasUserPosition ? (
              // User's position when not in top 10
              <div className="p-4 rounded-xl bg-primary-50/50 border border-primary shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-default-100 flex items-center justify-center shadow-lg">
                      <span className="text-sm font-bold">{data.userPosition}</span>
                    </div>
                    <span className="text-sm font-semibold">You</span>
                  </div>
                  <div>
                    <span className="font-mono font-semibold text-lg">
                      {data.userPoints}
                    </span>
                    <span className="text-default-500 text-sm ml-1">Beams</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-default-500">
                  <TrendUp variant='Bold' size={16} className='text-green-500' />
                  <span>Keep going! You&apos;re getting closer!</span>
                </div>
              </div>
            ) : (
              // Empty state when user has no position
              <div className="px-6 py-3 text-center space-y-4">
                <div className="flex justify-center">
                  <Cup 
                    size={48} 
                    className="text-primary" 
                    variant="Bold"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-default-700">
                    Start Your Journey!
                  </h3>
                  <p className="text-sm text-default-500">
                    Start earning beams and climb up the leaderboard.
                  </p>
                </div>
                <div className="pt-2">
                  <Button
                    as={Link}
                    href='/beams-today'
                    prefetch
                    color="primary"
                    className='text-white font-semibold'
                  >
                    Start Beaming
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default WeeklyDisplay;