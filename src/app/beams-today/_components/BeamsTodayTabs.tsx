'use client';
import React, { useRef, useEffect } from "react";
import TabsComponent from "@/components/TabsComponent";
import VideoPlayer from "./VideoPlayer";
import ArticleComponent from "@/app/beams-today/_components/Article";
import { Book1, VideoPlay, Headphone } from 'iconsax-react';
import { markTopicAsCompleted } from "@/actions/beams-today/completedActions";
import AudioPlayer from "@/app/beams-today/_components/AudioPlayer";
import { updateWatchTime } from '@/actions/beams-today/analytics/updateWatchTime';

interface BeamsTodayTabsProps {
  beamsToday: any;
}

const BeamsTodayTabs: React.FC<BeamsTodayTabsProps> = ({ beamsToday }) => {
  const videoPlayerRef = useRef<any>(null);
  const audioPlayerRef = useRef<any>(null);
  const articleRef = useRef<any>(null);

  const handleTabChange = async (tabKey: string) => {
    let format: 'video' | 'audio' | 'text' = 'video';

    if (tabKey === 'audio') {
      format = 'audio';
    } else if (tabKey === 'text') {
      format = 'text';
    }

    if (videoPlayerRef.current && format !== 'video') {
      const elapsedTime = videoPlayerRef.current.getElapsedTime();
      if (elapsedTime > 0) {
        await updateWatchTime(beamsToday.id, elapsedTime, 'video');
      }
    }

    if (audioPlayerRef.current && format !== 'audio') {
      const elapsedTime = audioPlayerRef.current.getElapsedTime();
      if (elapsedTime > 0) {
        await updateWatchTime(beamsToday.id, elapsedTime, 'audio');
      }
    }

    if (articleRef.current && format !== 'text') {
      const elapsedTime = articleRef.current.getElapsedTime();
      if (elapsedTime > 0) {
        await updateWatchTime(beamsToday.id, elapsedTime, 'text');
      }
    }

    await markTopicAsCompleted(beamsToday.id, format);
  };

  // const videoJsOptions = {
  //   autoplay: false,
  //   width: 1020,
  //   enableSmoothSeeking: true,
  //   height: 600,
  //   controls: true,
  //   responsive: true,
  //   poster : beamsToday.thumbnailUrl,
  //   fluid: true,
  //   playsinline: true,
  //   playbackRates: [0.5, 1, 1.5, 2],
  //   sources: [
  //     {
  //       src: beamsToday?.videoUrl,
  //       type: 'video/mp4',
  //     },
  //   ],
  // };

  const tabs = [
    {
      key: 'video',
      title: 'Video',
      icon: <VideoPlay size="24"  />,
      content: <VideoPlayer ref={videoPlayerRef} id={beamsToday.id} videoId={beamsToday?.videoUrl} />,
    },
    {
      key: 'audio',
      title: 'Audio',
      icon: <Headphone size="24"  />,
      content: <AudioPlayer ref={audioPlayerRef} audioUrl={beamsToday?.audioUrl} thumbnailUrl={beamsToday?.thumbnailUrl} />,
    },
    {
      key: 'text',
      title: 'Text',
      icon: <Book1 size="24"  />,
      content: <ArticleComponent ref={articleRef} articleUrl={beamsToday?.articleUrl} />,
    },
  ];

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

  useEffect(() => {
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  return (
    <div className="flex w-full items-center justify-center flex-col mt-4 ">
      <TabsComponent tabs={tabs} onTabChange={handleTabChange} />
    </div>
  );
};

export default BeamsTodayTabs;
