
import React from 'react';
import Plyr from 'plyr-react';
import 'plyr/dist/plyr.css';

const VideoPlayerComponent = ({beamsTodayId, videoUrl, type }:any) => {
  return (
    <div className="relative w-full">
      <Plyr
        source={{
          type: type,
          sources: [
            {
              src: videoUrl,
              type: type === 'video' ? 'video/mp4' : 'audio/mp3',
              size: 720,
            },
          ],
        }}
        options={{
          controls: [
            'play',
            'progress',
            'current-time',
            'mute',
            'volume',
            'captions',
            'settings',
            'pip',
            'airplay',
            'fullscreen',
          ],
          settings: ['captions', 'quality', 'speed'],
          quality: { default: 720, options: [1080, 720, 480, 360] },
          speed: { selected: 1, options: [0.5, 1, 1.5, 2] },
          autoplay: true,
        }}
      />
    </div>
  );
};

export default VideoPlayerComponent;