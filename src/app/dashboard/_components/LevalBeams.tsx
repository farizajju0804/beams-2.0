"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell } from 'recharts';
import RecentActivity from './RecentActivity';
import { Icon, MessageQuestion, Share, TickCircle } from 'iconsax-react';
import Heading from './Heading';

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
}


interface RecentActivityProps {
  activities: Activity[];
}

// LevelProgress component
const LevelProgress: React.FC<LevelProgressProps> = ({ level, progress, total }) => (
  <div className="mb-4 w-full flex flex-col ">
    <div className="flex mx-auto w-4/6 items-center justify-between mb-2">
      <span className="text-lg font-semibold">Level - {level}</span>
      <span className="text-sm text-gray-500">{progress}/{total}</span>
    </div>
    <div className="h-2 w-4/6 mx-auto bg-gray-200 rounded-full overflow-hidden">
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
    className="text-6xl font-bold text-orange-500 mb-4"
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
        <div className="flex flex-col space-y-4 ml-8">
          {data.map((item) => (
            <div key={item.name} className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-gray-600 mr-2">{item.name}</span>
              <span className="text-sm font-semibold">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };



// RecentActivity component


// Main Dashboard component
const LevelBeams: React.FC = () => {
  const pieChartData: ActivityData[] = [
    { name: 'Beams Today', value: 500, color: '#FFC107' },
    { name: 'Poll', value: 300, color: '#FF5722' },
    { name: 'Share', value: 200, color: '#673AB7' },
  ];

  const recentActivities: Activity[] = [
    { icon: TickCircle, text: 'Completed Topic', points: 50 },
    { icon: MessageQuestion, text: 'Participated in Poll', points: 30 },
    { icon: Share, text: 'Shared Topic', points: 10 },
  ];

  return (
    <div className="w-full py-4 px-4 bg-background">
        <Heading heading='My beams'/>
        <div className='w-full grid grid-cols-1 md:grid-cols-2'>
    <div className='w-full flex flex-col items-center md:items-start justify-center '>
      <div className="bg-yellow text-black px-3 py-1 rounded-full mb-4">Newbie</div>
      <LevelProgress level={1} progress={1000} total={2000} />
      <ScoreDisplay score={1000} />
      </div>
      <div>
      <ActivityPieChart data={pieChartData} />
      </div>
      </div>
      <RecentActivity activities={recentActivities} />
    </div>
  );
};

export default LevelBeams;
