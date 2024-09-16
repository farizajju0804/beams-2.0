'use client';
import React, { useRef, useEffect } from "react";
import TabsComponent from "@/components/TabsComponent"; // Component to handle tab navigation
import VideoPlayer from "./VideoPlayer"; // Video player component
import ArticleComponent from "@/app/beams-today/_components/Article"; // Article component for displaying text format
import { Book1, VideoPlay, Headphone } from 'iconsax-react'; // Icons for each tab (Video, Audio, Text)
import { incrementViewCount, markTopicAsCompleted } from "@/actions/beams-today/completedActions"; // Action to mark topic as completed
import AudioPlayer from "@/app/beams-today/_components/AudioPlayer"; // Audio player component
import { updateWatchTime } from '@/actions/beams-today/analytics/updateWatchTime'; // Action to update watch time for analytics

interface BeamsTodayTabsProps {
  beamsToday: any; // The beamsToday object that contains information about the current topic (video, audio, article)
}

const BeamsTodayTabs: React.FC<BeamsTodayTabsProps> = ({ beamsToday }) => {
  // Refs to manage video, audio, and article components
  const videoPlayerRef = useRef<any>(null);
  const audioPlayerRef = useRef<any>(null);
  const articleRef = useRef<any>(null);

  /**
   * Handle when the user switches between tabs (video, audio, text).
   * This updates the watch time for the previous format and marks the topic as completed in the new format.
   * @param tabKey - The key representing the current tab (video, audio, text)
   */
  const handleTabChange = async (tabKey: string) => {
    let format: 'video' | 'audio' | 'text' = 'video';

    if (tabKey === 'audio') {
      format = 'audio'; // Change to audio format
    } else if (tabKey === 'text') {
      format = 'text'; // Change to text format
    }

    // Save video watch time when switching away from the video tab
    if (videoPlayerRef.current && format !== 'video') {
      const elapsedTime = videoPlayerRef.current.getElapsedTime();
      if (elapsedTime > 0) {
        await updateWatchTime(beamsToday.id, elapsedTime, 'video');
      }
    }

    // Save audio watch time when switching away from the audio tab
    if (audioPlayerRef.current && format !== 'audio') {
      const elapsedTime = audioPlayerRef.current.getElapsedTime();
      if (elapsedTime > 0) {
        await updateWatchTime(beamsToday.id, elapsedTime, 'audio');
      }
    }

    // Save article reading time when switching away from the text tab
    if (articleRef.current && format !== 'text') {
      const elapsedTime = articleRef.current.getElapsedTime();
      if (elapsedTime > 0) {
        await updateWatchTime(beamsToday.id, elapsedTime, 'text');
      }
    }

    // Mark the topic as completed for the current format
    await incrementViewCount(beamsToday.id, format);
  };

  /**
   * The tab data includes key (video/audio/text), title, icon, and the corresponding content.
   * The content corresponds to the video player, audio player, or article component.
   */
  const tabs = [
    {
      key: 'video',
      title: 'Video',
      icon: <VideoPlay size="24" />, // Video play icon
      content: <VideoPlayer ref={videoPlayerRef} id={beamsToday.id} videoId={beamsToday?.videoUrl} thumbnailUrl={beamsToday?.thumbnailUrl} />,
    },
    {
      key: 'audio',
      title: 'Audio',
      icon: <Headphone size="24" />, // Headphone icon for audio
      content: <AudioPlayer beamsTodayId={beamsToday.id} ref={audioPlayerRef} audioUrl={beamsToday?.audioUrl} thumbnailUrl={beamsToday?.thumbnailUrl} />,
    },
    {
      key: 'text',
      title: 'Text',
      icon: <Book1 size="24" />, // Book icon for text/article
      content: <ArticleComponent beamsTodayId={beamsToday.id} ref={articleRef} articleUrl={beamsToday?.articleUrl} />,
    },
  ];

  /**
   * Handle when the user leaves the page (unload event).
   * This function updates the watch time for the currently active format before the user leaves.
   */
  const handleUnload = async () => {
    if (videoPlayerRef.current) {
      const elapsedTime = videoPlayerRef.current.getElapsedTime();
      if (elapsedTime > 0) {
        await updateWatchTime(beamsToday.id, elapsedTime, 'video');
      }
    }

    if (audioPlayerRef.current) {
      const elapsedTime = audioPlayerRef.current.getElapsedTime();
      if (elapsedTime > 0) {
        await updateWatchTime(beamsToday.id, elapsedTime, 'audio');
      }
    }

    if (articleRef.current) {
      const elapsedTime = articleRef.current.getElapsedTime();
      if (elapsedTime > 0) {
        await updateWatchTime(beamsToday.id, elapsedTime, 'text');
      }
    }
  };

  /**
   * Set up the event listener for when the user tries to close or navigate away from the page.
   * This ensures that the watch time is saved before the user leaves.
   */
  useEffect(() => {
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  return (
    <div className="flex w-full items-center justify-center flex-col mt-4 ">
      {/* Render the TabsComponent with the defined tabs */}
      <TabsComponent tabs={tabs} onTabChange={handleTabChange} />
    </div>
  );
};

export default BeamsTodayTabs;
