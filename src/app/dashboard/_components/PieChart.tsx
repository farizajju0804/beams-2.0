"use client"
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import {motion} from 'framer-motion'
interface ActivityData {
  name: string;
  value: number;
  color: string;
}

interface ActivityPieChartProps {
  data: ActivityData[];
}



interface ScoreDisplayProps {
    score: number;
  }


const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => (
    <motion.div
      className="text-xl md:text-3xl my-auto mx-auto font-semibold text-center bg-brand shadow-defined text-white p-2 rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {score} Beams
    </motion.div>
  );

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

  beams: number;

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



const colorMap: { [key: string]: string } = {
  BEAMS_TODAY: '#F96f2e', // Yellow
  POLL_PARTICIPATION: '#F9d24e', // Orange
  SHARE: '#673AB7', // Purple
  ACHIEVEMENT: '#4CAF50', // Green
  REFERRAL: '#00BCD4' // Cyan
};
// Main Dashboard component
const PieChartBeams: React.FC<LevelBeamsProps> = ({  beams, accumulatedPoints }) => {
  // Generate pie chart data from accumulated points
  const pieChartData = Object.keys(accumulatedPoints).map(source => ({
    name: sourceMap[source] || source,
    value: accumulatedPoints[source],
    color: colorMap[source] || '#888888'
  }));



  return (
    <div className="rounded-2xl p-3 py-4 bg-background">
   
       

       {beams > 0 ?(
        <div className='w-full flex flex-col gap-4 md:flex-row justify-between'>
            <ScoreDisplay score={beams}/>
          <ActivityPieChart data={pieChartData} />
          
        </div>
       ) : (
        <div className="text-center text-grey-2 py-2">
            A blank slate today, a victory tomorrow. Time to make it happen!
       </div>
       )
}
   
    </div>
  );
};

export default PieChartBeams;

