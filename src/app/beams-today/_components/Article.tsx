'use client';
import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { Viewer, SpecialZoomLevel, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { useTheme } from 'next-themes';
import toast from 'react-hot-toast';
import { markTopicAsCompleted } from '@/actions/beams-today/completedActions';
import RewardsModal from '@/components/Rewards'; // Import the RewardsModal

interface ArticleProps {
  articleUrl: string | undefined;
  beamsTodayId: string;
}

const ArticleComponent = forwardRef<any, ArticleProps>(({ articleUrl, beamsTodayId }, ref) => {
  const startTimeRef = useRef<number | null>(null);
  const elapsedTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { theme } = useTheme();
  const [completed, setCompleted] = useState(false);

  // New states for RewardsModal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [newPoints, setNewPoints] = useState(0);
  const [currentLevel, setCurrentLevel] = useState<any>();
  const [levelUp, setLevelUp] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<any>();
  const [newLevel, setNewLevel] = useState<any>();

  useImperativeHandle(ref, () => ({
    getElapsedTime: () => {
      if (startTimeRef.current) {
        const currentTime = Date.now();
        const elapsed = currentTime - startTimeRef.current;
        elapsedTimeRef.current += elapsed;
        startTimeRef.current = currentTime;
      }
      return Math.round(elapsedTimeRef.current / 1000);
    }
  }));

  useEffect(() => {
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(async () => {
      if (startTimeRef.current) {
        const currentTime = Date.now();
        const elapsed = currentTime - startTimeRef.current;
        elapsedTimeRef.current += elapsed;
        startTimeRef.current = currentTime;

        const totalTimeSpent = Math.round(elapsedTimeRef.current / 1000);
        if (totalTimeSpent >= 10 && !completed) { // After 60 seconds
          setCompleted(true);

          try {
            const { success, leveledUp, currentLevel,  currentPoints, newLevel } = await markTopicAsCompleted(beamsTodayId, 'text');
            if (success) {
              setUserPoints(prevPoints => prevPoints + 100);
              setNewPoints(prevPoints => prevPoints + 100);
              setCurrentLevel(currentLevel);
              setCurrentPoints(currentPoints);
              if (leveledUp) {
                setLevelUp(leveledUp);
                setNewLevel(newLevel);
              }
              setIsModalOpen(true); // Open the RewardsModal
            }
          } catch (error) {
            toast.error('Failed to mark article as completed');
          }
        }
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [completed, beamsTodayId]);

  if (!articleUrl) {
    return <div>No article available</div>;
  }

  return (
    <div>
      <div style={{ height: '750px' }}>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer
            theme={theme}
            fileUrl={articleUrl}
            defaultScale={SpecialZoomLevel.PageFit}
          />
        </Worker>
      </div>
      <RewardsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        points={userPoints - 100}
        newPoints={newPoints}
        levelUp={levelUp}
        currentLevel={currentLevel}
        nextLevel={newLevel}
        caption={newLevel?.caption}
        currentPoints={currentPoints}
      />
    </div>
  );
});

ArticleComponent.displayName = 'ArticleComponent';
export default ArticleComponent;
