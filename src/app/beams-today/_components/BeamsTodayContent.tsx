import React from 'react';
import VideoPlayer from "./VideoPlayer";
import ArticleComponent from "./Article";
import AudioPlayer from "./AudioPlayer";
import ClientTabs from './ClientTabs';

interface BeamsTodayContentProps {
  beamsToday: any;
}

export default function BeamsTodayContent({ beamsToday }: BeamsTodayContentProps) {
  const contentSections = {
    video: (
      <div id="video-section" className="w-full">
        <VideoPlayer 
          id={beamsToday.id} 
          videoId={beamsToday?.videoUrl} 
          thumbnailUrl={beamsToday?.thumbnailUrl} 
        />
      </div>
    ),
    audio: (
      <div id="audio-section" className="w-full">
        <AudioPlayer 
          beamsTodayId={beamsToday.id} 
          audioUrl={beamsToday?.audioUrl} 
          thumbnailUrl={beamsToday?.thumbnailUrl}
        />
      </div>
    ),
    text: (
      <div id="text-section" className="w-full">
        <ArticleComponent 
          beamsTodayId={beamsToday.id} 
          articleUrl={beamsToday?.articleUrl}
        />
      </div>
    )
  };

  return (
    <div className="flex w-full items-center justify-center flex-col mt-4">
      <ClientTabs 
        beamsTodayId={beamsToday.id}
        contentSections={contentSections}
      />
    </div>
  );
}