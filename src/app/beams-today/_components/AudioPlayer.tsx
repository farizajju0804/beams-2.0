'use client';
import Image from 'next/image';
import React, { useRef, useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import H5AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { markTopicAsCompleted } from '@/actions/beams-today/completedActions';
import { toast } from 'react-hot-toast'; // React Hot Toast
import { VolumeHigh, VolumeMute, Play, Pause, Forward, Backward } from 'iconsax-react';

interface AudioPlayerProps {
  beamsTodayId: string;
  audioUrl: string;
  thumbnailUrl: string;
}

// AudioPlayer component to play audio with custom controls
const AudioPlayer = forwardRef<any, AudioPlayerProps>(({ beamsTodayId, audioUrl, thumbnailUrl }, ref) => {
  const lastTimeRef = useRef(0);
  const playTimeRef = useRef(0);
  const audioElementRef = useRef<HTMLAudioElement | null>(null); // Reference to audio element
  const [isPlaying, setIsPlaying] = useState(false);
  const [completionMarked, setCompletionMarked] = useState(false); // Flag to avoid marking completion multiple times

  // Expose the elapsed play time for parent component via ref
  useImperativeHandle(ref, () => ({
    getElapsedTime: () => playTimeRef.current,
  }));

  // Track play time and handle completion at 95%
  const handlePlay = () => {
    setIsPlaying(true);
    lastTimeRef.current = new Date().getTime() / 1000;
    console.log('Playing audio');
  };

  const handlePause = () => {
    setIsPlaying(false);
    const currentTime = new Date().getTime() / 1000;
    playTimeRef.current += currentTime - lastTimeRef.current;
    console.log('Paused audio, playTime:', playTimeRef.current);
  };

  const handleSeeked = () => {
    if (isPlaying) {
      const currentTime = new Date().getTime() / 1000;
      playTimeRef.current += currentTime - lastTimeRef.current;
      console.log('Seeked audio, playTime:', playTimeRef.current);
    }
    lastTimeRef.current = new Date().getTime() / 1000;
  };

  const handleListen = async () => {
    if (isPlaying && audioElementRef.current) {
      const currentTime = new Date().getTime() / 1000;
      playTimeRef.current += currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      const totalDuration = audioElementRef.current.duration || 0;
      const listenedPercentage = (playTimeRef.current / totalDuration) * 100;
      console.log(`Listened Percentage: ${listenedPercentage}%, Duration: ${totalDuration}, PlayTime: ${playTimeRef.current}`);

      if (listenedPercentage >= 95 && !completionMarked) {
        setCompletionMarked(true); // Avoid multiple triggers
        console.log("Marking topic as completed");

        try {
          const { success } = await markTopicAsCompleted(beamsTodayId, 'audio');
          if (success) {
            toast.success('🎧 Topic completed! You have gained 100 beams!', {
              position: 'top-right',
              duration: 4000,
              icon: '🎉',
            });
          }
        } catch (error) {
          console.error('Error marking topic as completed:', error);
        }
      }
    }
  };

  // Ensure audio element ref is updated when H5AudioPlayer renders
  useEffect(() => {
    const audioElement = document.querySelector('audio');
    if (audioElement) {
      audioElementRef.current = audioElement as HTMLAudioElement;
      console.log('Audio element initialized', audioElement);
    }
  }, []);

  return (
    <div className="audio-player-card bg-grey-1 mx-auto shadow-lg rounded-3xl lg:w-3/6 w-full p-4 flex flex-col items-center mb-4">
      <div className="thumbnail-container mb-4">
        <Image src={thumbnailUrl} alt="Thumbnail" className="rounded-3xl" width={500} height={500} />
      </div>
      <H5AudioPlayer
        src={audioUrl}
        autoPlay={false}
        customIcons={{
          play: <Play size="24" color="gray" />,
          pause: <Pause size="24" color="gray" />,
          rewind: <Backward size="24" color="gray" />,
          forward: <Forward size="24" color="gray" />,
          volume: <VolumeHigh size="24" color="gray" />,
          volumeMute: <VolumeMute size="24" color="gray" />,
          loop: <div style={{ display: 'none' }} />, // Hide the loop icon
        }}
        customAdditionalControls={[]}
        showSkipControls={false}
        showJumpControls={true}
        style={{ width: '100%' }}
        onPlay={handlePlay}
        onPause={handlePause}
        onSeeked={handleSeeked}
        onListen={handleListen}
        listenInterval={1} // Set interval for `onListen` event
      />
    </div>
  );
});

AudioPlayer.displayName = 'AudioPlayer';
export default AudioPlayer;
