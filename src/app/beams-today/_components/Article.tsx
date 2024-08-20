import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { Viewer, SpecialZoomLevel, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { useTheme } from "next-themes";

interface ArticleProps {
  articleUrl: string | undefined;
}

const Article = forwardRef<any, ArticleProps>(({ articleUrl }, ref) => {
  const startTimeRef = useRef<number | null>(null);
  const elapsedTimeRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);

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

    intervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const currentTime = Date.now();
        const elapsed = currentTime - startTimeRef.current;
        elapsedTimeRef.current += elapsed;
        startTimeRef.current = currentTime;
      }
    }, 1000);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 767);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (startTimeRef.current) {
        const elapsedTime = Date.now() - startTimeRef.current;
        elapsedTimeRef.current += elapsedTime;
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  if (!articleUrl) {
    return (
      <div className="mt-4 p-4 bg-grey-1 rounded-lg">
        <h2 className="text-2xl font-bold my-2">Article</h2>
        <p className="text-lg text-gray-800">No article available</p>
      </div>
    );
  }

  return (
    <div className="my-4 rounded-lg w-[80vw]">
      <div style={{ height: '750px' }}>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer
            theme={theme}
            fileUrl={articleUrl}
            defaultScale={isMobile ? SpecialZoomLevel.PageFit : 1.0}
          />
        </Worker>
      </div>
    </div>
  );
});

Article.displayName = 'Article';

export default Article;