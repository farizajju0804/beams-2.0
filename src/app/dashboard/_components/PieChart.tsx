'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';



// Props for the LevelBeams component
interface LevelBeamsProps {
  beams: number; // Total beams earned
  accumulatedPoints: { [key: string]: number }; // Points accumulated from various sources
}

// Mapping source codes to their descriptive names
const sourceMap: { [key: string]: string } = {
  BEAMS_TODAY: 'Beams Today',
  POLL_PARTICIPATION: 'Poll',
  ACHIEVEMENT: 'Victory Vault',
  REFERRAL: 'Referral',
  REFERRAL_BONUS: 'Welcome Bonus',
  NETWORK_POINTS: "Network Points",
  CONNECTION_GAME : "Beams Connect"
};

// Mapping source codes to their representative colors
const colorMap: { [key: string]: string } = {
  BEAMS_TODAY: '#FF6B6B',        
  POLL_PARTICIPATION: '#FFA00F',  
  ACHIEVEMENT: '#1E90FF',          
  REFERRAL: '#FF1493',            
  REFERRAL_BONUS: '#7344EB',       
  NETWORK_POINTS: '#17cd92',   
  CONNECTION_GAME : "#14b8a6"    
};

// Component to display the score in an animated manner
const ScoreDisplay: React.FC<{ score: number }> = ({ score }) => (
  <motion.div
    className="text-center p-4 rounded-xl bg-gradient-to-r from-yellow to-brand text-white shadow-lg"
    initial={{ opacity: 0, y: -20 }} // Initial animation state
    animate={{ opacity: 1, y: 0 }} // Final animation state
    transition={{ duration: 0.5 }} // Animation duration
  >
    <span className="text-lg md:text-2xl">You&apos;ve earned</span>
    <br />
    <span className="text-3xl md:text-5xl font-bold">{score} Beams</span>
  </motion.div>
);

// Main component for displaying the beams breakdown
const VibrantBeamsBreakdown: React.FC<LevelBeamsProps> = ({ beams, accumulatedPoints }) => {
  const [isClient, setIsClient] = useState(false); // State to check if component is mounted

  // Effect to set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Return null if the component hasn't mounted yet to prevent server-side rendering issues
  if (!isClient) {
    return null;
  }

  // Prepare pie chart data from accumulated points
  const pieChartData = Object.keys(accumulatedPoints).map(source => ({
    name: sourceMap[source] || source, // Use mapped name or fallback to source key
    value: accumulatedPoints[source], // Get the value from accumulated points
    color: colorMap[source] || '#888888' // Use mapped color or default to grey
  }));

  // Sort the data by value in descending order
  const sortedPieChartData = pieChartData.sort((a, b) => b.value - a.value);

  // Calculate total points from the sorted data
  const totalPoints = sortedPieChartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-background rounded-2xl shadow-defined">
      {beams > 0 ? ( // Check if any beams were earned
        <>
          <ScoreDisplay score={beams} /> {/* Display the total beams earned */}
          <motion.div 
            className="mt-8 space-y-6"
            initial={{ opacity: 0 }} // Initial animation state for breakdown list
            animate={{ opacity: 1 }} // Final animation state
            transition={{ duration: 0.5, delay: 0.2 }} // Animation duration and delay
          >
            {sortedPieChartData.map((item, index) => {
              const percentage = (item.value / totalPoints) * 100; // Calculate the percentage of each item
              const isShortBar = percentage < 10; // Determine if the bar is short for possible styling

              return (
                <motion.div 
                  key={item.name} 
                  className="relative"
                  initial={{ opacity: 0, x: -20 }} // Initial animation state for each item
                  animate={{ opacity: 1, x: 0 }} // Final animation state
                  transition={{ duration: 0.5, delay: index * 0.1 }} // Animation duration and delay based on index
                >
                  <div className="flex mb-2 items-center justify-between text-sm">
                    <span className="font-bold" style={{ color: item.color }}>{item.name}</span> {/* Source name */}
                    <span className="font-bold" style={{ color: item.color }}>{item.value}</span> {/* Source value */}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </>
      ) : (
        <motion.div 
          className="text-center text-grey-2 py-8 text-lg font-medium"
          initial={{ opacity: 0, y: 20 }} // Initial animation state for the empty state message
          animate={{ opacity: 1, y: 0 }} // Final animation state
          transition={{ duration: 0.5 }} // Animation duration
        >
          A blank slate today, a victory tomorrow. Time to make it happen! {/* Empty state message */}
        </motion.div>
      )}
    </div>
  );
};

export default VibrantBeamsBreakdown; // Exporting the component for use in other parts of the application
