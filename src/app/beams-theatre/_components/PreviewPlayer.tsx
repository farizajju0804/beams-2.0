'use client';
import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import 'cloudinary-video-player/cld-video-player.min.css';
import cloudinary from 'cloudinary-video-player';

interface VideoPlayerProps {
  id: string;
  videoId: string;
  thumbnailUrl: string;
}

const PreviewPlayer = forwardRef<any, VideoPlayerProps>(({ id, videoId, thumbnailUrl }, ref) => {
  const videoElementId = `player-${id}`;
  const playerRef = useRef<any>(null);
  const lastTimeRef = useRef(0);
  const playTimeRef = useRef(0);

  useImperativeHandle(ref, () => ({
    getElapsedTime: () => playTimeRef.current,
  }));

  useEffect(() => {
    const initializePlayer = () => {
      const videoElement = document.getElementById(videoElementId) as HTMLVideoElement;
      if (videoElement && videoElement.tagName === 'VIDEO') {
        const player = cloudinary.videoPlayer(videoElementId, {
          cloud_name: 'drlyyxqh9', 
          floatingWhenNotVisible: 'right',
          controls: true,
          colors: {
            base: '#181818',
            accent: '#F96F2E',
            text: '#ffffff'
          },
          fontFace: 'Quicksand',
          publicId: videoId,
          poster: thumbnailUrl
        });

        playerRef.current = player;
       

        const handleTimeUpdate = () => {
          if (videoElement && !videoElement.paused && !videoElement.seeking) {
            const currentTime = videoElement.currentTime;
            const elapsedTime = currentTime - lastTimeRef.current;
            playTimeRef.current += elapsedTime;
            lastTimeRef.current = currentTime;
            console.log('Time Update:', { currentTime, elapsedTime, playTime: playTimeRef.current });
          }
        };

        const handlePlay = () => {
          if (videoElement) {
            lastTimeRef.current = videoElement.currentTime;
            console.log('Video Play:', videoElement.currentTime);
          }
        };

        const handlePause = () => {
          handleTimeUpdate();
          console.log('Video Pause:', videoElement.currentTime);
        };

        const handleSeeked = () => {
          if (videoElement) {
            lastTimeRef.current = videoElement.currentTime;
            console.log('Video Seeked:', videoElement.currentTime);
          }
        };

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
      } else {
        console.error('Element is not a video tag or not found');
      }
    };

    initializePlayer();
  }, [videoElementId, videoId, thumbnailUrl]);

  return (
    <div className=''>
      <video
        id={videoElementId}
        poster={thumbnailUrl}
        className="cld-video-player cld-fluid"
      >
      </video>
    </div>
  );
});

PreviewPlayer.displayName = 'PreviewPlayer';
export default PreviewPlayer;
