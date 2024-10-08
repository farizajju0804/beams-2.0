"use client"
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell } from 'recharts';
import RecentActivity from './RecentActivity';
import { Cup, Icon, InfoCircle, MessageQuestion, Share, TickCircle } from 'iconsax-react';
import Heading from './Heading';
import Link from 'next/link';
import { FaTrophy } from 'react-icons/fa';
import IconFillingEffect from '@/components/IconFillingEffect';
import LevelName from '@/components/LevelName';
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';

// Define interfaces for props
interface LevelProgressProps {
  level: number;
  progress: number;
  total: number;
}

interface ScoreDisplayProps {
  score: number;
}

interface ActivityData {
  name: string;
  value: number;
  color: string;
}

interface ActivityPieChartProps {
  data: ActivityData[];
}

interface Activity {
    icon: Icon;
    text: string;
    points: number;
    createdAt : Date;
    source : string;
}


interface RecentActivityProps {
  activities: Activity[];
}

// LevelProgress component
const LevelProgress: React.FC<LevelProgressProps> = ({ level, progress, total }) => (
  <div className="mb-4 w-full flex flex-col ">
    <div className="flex mx-auto md:mx-0 w-4/6 items-center justify-between mb-2">
      <span className="text-lg font-semibold">Level - {level}</span>
      <span className="text-sm text-grey-2">{progress}/{total}</span>
    </div>
    <div className="h-2 w-4/6 md:mx-0 mx-auto bg-gray-200 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-brand"
        initial={{ width: 0 }}
        animate={{ width: `${(progress / total) * 100}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  </div>
);

// ScoreDisplay component
const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => (
  <motion.div
    className="text-6xl my-4 font-bold text-orange-500 mb-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    {score}
  </motion.div>
);

// ActivityPieChart component




const ActivityPieChart: React.FC<ActivityPieChartProps> = ({ data }) => {
    const chartSize = 200; // Increased size
    const outerRadius = chartSize / 2 - 10; // Slightly smaller to ensure it's not cut off
    const innerRadius = outerRadius - 30; // Adjust for desired thickness
    const [isClient, setIsClient] = useState(false); 
    useEffect(() => {
      setIsClient(true); // Set to true only after the component mounts on the client-side
    }, []);
    if (!isClient) {
      return null; // Return null during SSR to prevent hydration mismatch
    }
    return (
      <div className="flex flex-col md:flex-row items-center gap-8 justify-center w-full max-w-2xl">
        <PieChart width={chartSize} height={chartSize}>
          <Pie
            data={data}
            cx={chartSize / 2}
            cy={chartSize / 2}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={3}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
        <div className="flex flex-col space-y-4 md:ml-8">
          {data.map((item) => (
            <div key={item.name} className="flex justify-center md:justify-start items-center">
              <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-grey-2 mr-2">{item.name}</span>
              <span className="text-sm font-semibold">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };





// Define interfaces for props
interface LevelBeamsProps {
  userLevel: any;
  beams: number;
  recentActivities: any[];
  accumulatedPoints: { [key: string]: number }; // Accumulated points by source
}

// Map sources to display names
const sourceMap: { [key: string]: string } = {
  BEAMS_TODAY: 'Beams Today',
  POLL_PARTICIPATION: 'Poll',
  SHARE: 'Share',
  ACHIEVEMENT : 'Badges',
  REFERRAL : 'Referral'
};

// Map sources to icons
const iconMap: { [key: string]: Icon } = {
  BEAMS_TODAY: TickCircle,
  POLL_PARTICIPATION: TickCircle,
  SHARE: Share,
  ACHIEVEMENT : Cup
};

const colorMap: { [key: string]: string } = {
  BEAMS_TODAY: '#F96f2e', // Yellow
  POLL_PARTICIPATION: '#F9d24e', // Orange
  SHARE: '#673AB7', // Purple
  ACHIEVEMENT: '#4CAF50', // Green
  REFERRAL: '#00BCD4' // Cyan
};
// Main Dashboard component
const LevelBeams: React.FC<LevelBeamsProps> = ({ userLevel, beams, recentActivities, accumulatedPoints }) => {
  // Generate pie chart data from accumulated points
  const pieChartData = Object.keys(accumulatedPoints).map(source => ({
    name: sourceMap[source] || source,
    value: accumulatedPoints[source],
    color: colorMap[source] || '#888888'
  }));

  // Map recent activities
  const recentActivityData: Activity[] = recentActivities.map(activity => ({
    icon: iconMap[activity.source] || TickCircle,
    text: activity.description,
    points: activity.points,
    createdAt: new Date(activity.createdAt), // Assuming `activity.createdAt` is provided as a timestamp
    source: sourceMap[activity.source] || activity.source,
  }));

  return (
    <div className="w-full bg-background">
      <Heading heading={`My Beams`} />
      <div className='px-6 md:px-0 w-full grid grid-cols-1 md:grid-cols-2'>
        <div className='w-full gap-2 flex flex-col items-center md:items-start justify-center '>
        <div className="w-full flex items-center md:justify-start justify-center ">
    <div className="flex items-center gap-2 md:gap-4">
      <div className="flex items-start flex-col gap-1">
        <p className="text-xs md:mx-0 mx-auto  md:text-base text-grey-2">Level {userLevel.levelNumber}</p>
        <div className="flex items-center gap-2">
          <p className="text-sm md:text-lg uppercase font-medium font-poppins text-text relative">
            <span className="inline-block" >
            {userLevel.name}
              <sup className="absolute -top-1 -right-3">
                <Popover showArrow>
                  <PopoverTrigger>
                    <InfoCircle size={10} color="#808080" className="cursor-pointer" />
                  </PopoverTrigger>
                  <PopoverContent className="w-fit text-left p-4">
                    <p className="text-xs w-full font-medium mb-2">Level {userLevel.levelNumber} - {userLevel.name}</p>
                    <p className="text-xs w-full text-grey-2">Beams Range: {userLevel.minPoints} - {userLevel.maxPoints}</p>
                  </PopoverContent>
                </Popover>
              </sup>
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>

        
          <IconFillingEffect
                    icon={userLevel.icon}
                    filledColor={userLevel.bgColor}
                    beams={beams}  
                    minPoints={userLevel.minPoints}
                    maxPoints={userLevel.maxPoints}
                  />
          <ScoreDisplay score={beams} />
          <Link
        href='/achievements'
        className='w-full mb-6 text-brand underline font-medium md:text-left text-center md:mx-0 mx-auto text-sm'
      >
        View Levels progress here
      </Link>
        </div>
        {beams > 0 && 
        <div>
          <ActivityPieChart data={pieChartData} />
        </div>
        }
      </div>
      {recentActivities.length > 0 && 
      <RecentActivity activities={recentActivityData} />
      }
    </div>
  );
};

export default LevelBeams;

