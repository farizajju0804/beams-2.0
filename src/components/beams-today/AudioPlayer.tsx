'use client'
import Image from 'next/image';
import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import H5AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { VolumeHigh, VolumeMute, Play, Pause, Forward, Backward } from 'iconsax-react';

interface AudioPlayerProps {
  audioUrl: string;
  thumbnailUrl: string;
}

const AudioPlayer = forwardRef<any, AudioPlayerProps>(({ audioUrl, thumbnailUrl }, ref) => {
  const lastTimeRef = useRef(0);
  const playTimeRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useImperativeHandle(ref, () => ({
    getElapsedTime: () => playTimeRef.current
  }));

  const handlePlay = () => {
    setIsPlaying(true);
    lastTimeRef.current = new Date().getTime() / 1000;

  };

  const handlePause = () => {
    if (isPlaying) {
      const currentTime = new Date().getTime() / 1000;
      playTimeRef.current += currentTime - lastTimeRef.current;

    }
    setIsPlaying(false);
 
  };

  const handleSeeked = () => {
    if (isPlaying) {
      const currentTime = new Date().getTime() / 1000;
      playTimeRef.current += currentTime - lastTimeRef.current;
    }
    lastTimeRef.current = new Date().getTime() / 1000;
   
  };

  const handleListen = () => {
    if (isPlaying) {
      const currentTime = new Date().getTime() / 1000;
      playTimeRef.current += currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;
     
    }
  };

  return (
    <div className="audio-player-card bg-white shadow-lg rounded-3xl w-full p-4 flex flex-col items-center mb-4">
      <div className="thumbnail-container mb-4">
        <Image src={thumbnailUrl} alt="Thumbnail" className="rounded-3xl " width={500} height={500} />
      </div>
      <H5AudioPlayer
        
        src={audioUrl}
        autoPlay={false}
        customIcons={{
          play: <Play size="24" color="gray" />,
          pause: <Pause size="24" color="gray" />,
          rewind: <Backward size="24" color="gray" />,  // Custom backward icon
          forward: <Forward size="24" color="gray" />,  // Custom forward icon
          volume: <VolumeHigh size="24" color="gray" />,
          volumeMute: <VolumeMute size="24" color="gray" />,
          loop: <div style={{ display: 'none' }} /> // Hide the loop icon
        }}
        customAdditionalControls={[]}
        showSkipControls={false}
        showJumpControls={true}
        style={{ width: '100%' }}
        onPlay={handlePlay}
        onPause={handlePause}
        onSeeked={handleSeeked}
        onListen={handleListen}
        listenInterval={1} 
      />
    </div>
  );
});

AudioPlayer.displayName = 'AudioPlayer';
export default AudioPlayer;
