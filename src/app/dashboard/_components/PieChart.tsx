'use client'
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ActivityData {
  name: string;
  value: number;
  color: string;
}

interface LevelBeamsProps {
  beams: number;
  accumulatedPoints: { [key: string]: number };
}

const sourceMap: { [key: string]: string } = {
  BEAMS_TODAY: 'Beams Today',
  POLL_PARTICIPATION: 'Poll',

  ACHIEVEMENT: 'Victory Vault',
  REFERRAL: 'Referral',
  REFERRAL_BONUS: 'Welcome Bonus',
  NETWORK_POINTS: "Network Points",
};

const colorMap: { [key: string]: string } = {
  BEAMS_TODAY: '#FF6B6B',        
  POLL_PARTICIPATION: '#8A2BE2',  
                
  ACHIEVEMENT: '#1E90FF',          
  REFERRAL: '#FF1493',            
  REFERRAL_BONUS: '#FFA00F',       
  NETWORK_POINTS: '#17cd92',       
};

const ScoreDisplay: React.FC<{ score: number }> = ({ score }) => (
  <motion.div
    className="text-center p-4 rounded-xl bg-gradient-to-r from-yellow to-brand text-white shadow-lg"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <span className="text-lg md:text-2xl">You&apos;ve earned</span>
    <br />
    <span className="text-3xl md:text-5xl font-bold">{score} Beams</span>
  </motion.div>
);

const VibrantBeamsBreakdown: React.FC<LevelBeamsProps> = ({ beams, accumulatedPoints }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const pieChartData = Object.keys(accumulatedPoints).map(source => ({
    name: sourceMap[source] || source,
    value: accumulatedPoints[source],
    color: colorMap[source] || '#888888'
  }));

  // Sort the data by value in descending order
  const sortedPieChartData = pieChartData.sort((a, b) => b.value - a.value);

  const totalPoints = sortedPieChartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-background rounded-2xl shadow-defined">
      {beams > 0 ? (
        <>
          <ScoreDisplay score={beams} />
          <motion.div 
            className="mt-8 space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {sortedPieChartData.map((item, index) => {
              const percentage = (item.value / totalPoints) * 100;
              const isShortBar = percentage < 10;

              return (
                <motion.div 
                  key={item.name} 
                  className="relative"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex mb-2 items-center justify-between text-sm">
                    <span className="font-bold" style={{ color: item.color }}>{item.name}</span>
                    <span className="font-bold" style={{ color: item.color }}>{item.value}</span>
                  </div>
                  {/* Uncomment the below code if you want to display progress bars */}
                  {/* <div className="h-10 w-full bg-grey-1 rounded-full overflow-hidden shadow-inner relative">
                    <motion.div
                      className="h-full rounded-full flex items-center justify-end pr-2 text-xs font-bold"
                      style={{ 
                        backgroundColor: item.color,
                        boxShadow: `inset 3px 3px 6px rgba(0,0,0,0.2), inset -3px -3px 6px rgba(255,255,255,0.1)`
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.2, ease: "easeInOut" }}
                    >
                      {!isShortBar && (
                        <span className="text-white drop-shadow-md">{percentage.toFixed(1)}%</span>
                      )}
                    </motion.div>
                    {isShortBar && (
                      <span 
                        className="absolute right-[5%] top-1/2 transform -translate-y-1/2 ml-2 text-xs font-bold"
                        style={{ color: item.color }}
                      >
                        {percentage.toFixed(1)}%
                      </span>
                    )}
                  </div> */}
                </motion.div>
              );
            })}
          </motion.div>
        </>
      ) : (
        <motion.div 
          className="text-center text-grey-2 py-8 text-lg font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          A blank slate today, a victory tomorrow. Time to make it happen!
        </motion.div>
      )}
    </div>
  );
};

export default VibrantBeamsBreakdown;
