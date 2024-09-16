'use client';
import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { Viewer, SpecialZoomLevel, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css'; // Core styles for PDF viewer
import { useTheme } from 'next-themes'; // Importing the theme hook for dark/light mode switching
import toast from 'react-hot-toast'; // Using react-hot-toast for notifications
import { markTopicAsCompleted } from '@/actions/beams-today/completedActions'; // Action to mark topic as completed

interface ArticleProps {
  articleUrl: string | undefined;
  beamsTodayId: string; // Added for marking completion
}

// Article component to display PDF articles
const ArticleComponent = forwardRef<any, ArticleProps>(({ articleUrl, beamsTodayId }, ref) => {
  const startTimeRef = useRef<number | null>(null);
  const elapsedTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { theme } = useTheme(); // Access theme
  const [isMobile, setIsMobile] = useState(false);
  const [completed, setCompleted] = useState(false); // Track if the article has been marked as complete

  // Expose the elapsed reading time for parent component via ref
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

  // Track reading time of the PDF
  useEffect(() => {
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(async () => {
      if (startTimeRef.current) {
        const currentTime = Date.now();
        const elapsed = currentTime - startTimeRef.current;
        elapsedTimeRef.current += elapsed;
        startTimeRef.current = currentTime;

        // If the user spends more than 60 seconds on the article, mark it as complete
        const totalTimeSpent = Math.round(elapsedTimeRef.current / 1000);
        if (totalTimeSpent >= 10 && !completed) {
          setCompleted(true); // Mark as completed

          try {
            // Mark the topic as completed in the backend only once
            await markTopicAsCompleted(beamsTodayId, 'text');

            // Show a success toast notification
            toast.success('You have completed reading the article!', {
              position: 'top-right',
              duration: 3000, // Auto close after 3 seconds
            });
          } catch (error) {
            toast.error('Failed to mark article as completed');
          }
        }
      }
    }, 1000);

    // Handle resizing to set `isMobile`
    const handleResize = () => {
      setIsMobile(window.innerWidth < 767);
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [completed, beamsTodayId]);

  // Return when there is no article URL
  if (!articleUrl) {
    return (
      <div className="mt-4 p-4 bg-grey-1 rounded-lg">
        <h2 className="text-2xl font-bold my-2">Article</h2>
        <p className="text-lg text-gray-800">No article available</p>
      </div>
    );
  }

  return (
    <div className="my-4 rounded-lg mx-auto w-[80vw]">
      <div style={{ height: '750px' }}>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer
            theme={theme} // Apply theme (light/dark)
            fileUrl={articleUrl}
            defaultScale={isMobile ? SpecialZoomLevel.PageFit : 1.0} // Adjust scaling based on screen size
          />
        </Worker>
      </div>
    </div>
  );
});

ArticleComponent.displayName = 'ArticleComponent';
export default ArticleComponent;
