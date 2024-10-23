"use client"
import React, { useEffect, useState } from 'react';

import RecentActivity from './RecentActivity';
import { Cup, Icon, InfoCircle, MessageQuestion, Share, TickCircle } from 'iconsax-react';
import { PointsSource } from '@prisma/client';


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
    source : PointsSource;
}




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
  ACHIEVEMENT : 'Victory Vault',
  REFERRAL : 'Referral',
  REFERRAL_BONUS : 'Welcome Bonus'
};

// Map sources to icons
const iconMap: { [key: string]: Icon } = {
  BEAMS_TODAY: TickCircle,
  POLL_PARTICIPATION: TickCircle,
  SHARE: TickCircle,
  ACHIEVEMENT : TickCircle
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
    <div className="w-full ">
   
    
     
      <RecentActivity activities={recentActivityData} />
      
    </div>
  );
};

export default LevelBeams;

