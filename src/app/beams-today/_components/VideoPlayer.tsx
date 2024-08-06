'use client';
import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { CldVideoPlayer } from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';

interface VideoPlayerProps {
  id: string;
  videoId: string;
  thumbnailUrl : string;
}

const VideoPlayer = forwardRef<any, VideoPlayerProps>(({ id, videoId, thumbnailUrl }, ref) => {
  const playerRef = useRef<any>(null);
  const videoRef = useRef<any>(null);
  const lastTimeRef = useRef(0);
  const playTimeRef = useRef(0);

  useImperativeHandle(ref, () => ({
    getElapsedTime: () => playTimeRef.current
  }));

  useEffect(() => {
    const videoElement = videoRef.current;

    const handleTimeUpdate = () => {
      if (videoElement && !videoElement.paused && !videoElement.seeking) {
        const currentTime = videoElement.currentTime;
        const elapsedTime = currentTime - lastTimeRef.current;
        playTimeRef.current += elapsedTime;
        lastTimeRef.current = currentTime;
      }
    };

    const handlePlay = () => {
      if (videoElement) {
        lastTimeRef.current = videoElement.currentTime;
      }
    };

    const handlePause = () => {
      handleTimeUpdate();
    };

    const handleSeeked = () => {
      if (videoElement) {
        lastTimeRef.current = videoElement.currentTime;
      }
    };

    if (videoElement) {
      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('pause', handlePause);
      videoElement.addEventListener('seeked', handleSeeked);

      return () => {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('pause', handlePause);
        videoElement.removeEventListener('seeked', handleSeeked);
      };
    }
  }, []);

  return (
    <div className='lg:min-w-5xl lg:px-8 min-w-[85vw] w-full mx-auto'>
      <CldVideoPlayer
        id="my-video"
        width="1920"
        height="1080"
        poster={thumbnailUrl}
        fluid={true}
        className='cld-fluid'
        src={videoId}
        colors={{
          accent: '#F9D42E',
          base: '#370075',
          text: '#fffff'
        }}
        playbackRates={[0.5, 1, 1.5, 2]}
        pictureInPictureToggle={true}
        logo={{
          imageUrl: 'https://example.com/logo.png',
          onClickUrl: 'https://example.com',
        }}
        playerRef={playerRef}
        videoRef={videoRef}
      />
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';
export default VideoPlayer;