import React, { forwardRef } from 'react';
import Plyr, { APITypes } from 'plyr-react';
import 'plyr/dist/plyr.css';

interface VideoPlayerComponentProps {
  videoUrl: string;
  type: 'video' | 'audio';
}

const VideoPlayerComponent = forwardRef<APITypes, VideoPlayerComponentProps>(
  ({ videoUrl, type }, ref) => {
    const source = {
      type: type,
      sources: [
        {
          src: videoUrl,
          type: type === 'video' ? 'video/mp4' : 'audio/mp3',
          size: 720,
        },
      ],
    };

    const options = {
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
      listeners: {
        play: () => console.log('played'),
        pause: () => console.log('paused'),
        seeked: () => console.log('seeked'),
        timeupdate: () => console.log('time updated'),
      },
    };

    return (
      <div className="relative w-full rounded-3xl">
        <Plyr ref={ref} source={source} options={options} />
      </div>
    );
  }
);

VideoPlayerComponent.displayName = 'VideoPlayerComponent';

export default VideoPlayerComponent;
