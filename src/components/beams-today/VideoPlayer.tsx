'use client';
import React, { useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-mobile-ui/dist/videojs-mobile-ui.css';
import 'videojs-mobile-ui';

interface VideoPlayerProps {
  options: any;
  onReady?: (player: any) => void;
  id: string; // Add videoId prop to uniquely identify the video
  posterUrl: string;
}

const VideoPlayer = forwardRef<any, VideoPlayerProps>(({ options, onReady, id, posterUrl }, ref) => {
  const videoRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any | null>(null);
  const lastTimeRef = useRef(0);
  const playTimeRef = useRef(0);

  useImperativeHandle(ref, () => ({
    getElapsedTime: () => playTimeRef.current
  }));

  const handleTimeUpdate = () => {
    const player = playerRef.current;
    if (player && !player.paused() && !player.seeking()) {
      const currentTime = player.currentTime();
      const elapsedTime = currentTime - lastTimeRef.current;
      playTimeRef.current += elapsedTime;
      lastTimeRef.current = currentTime;
    }
  };

  const handlePlay = () => {
    const player = playerRef.current;
    if (player) {
      lastTimeRef.current = player.currentTime();
    }
  };

  const handlePause = () => {
    handleTimeUpdate();
  };

  const handleSeeked = () => {
    const player = playerRef.current;
    if (player) {
      lastTimeRef.current = player.currentTime();
    }
  };
  const handleEnded = () => {
    const player = playerRef.current;
    if (player) {
      player.posterImage.show();
    }
  };

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement('video-js');
      videoElement.classList.add('vjs-big-play-centered');
      if (videoRef.current) {
        videoRef.current.appendChild(videoElement);
      }

      const player = (playerRef.current = videojs(videoElement, { ...options, poster: posterUrl }, () => {
        videojs.log('player is ready');
        if (onReady) {
          onReady(player);
        }
      }));

      // Attach event listeners
      player.on('timeupdate', handleTimeUpdate);
      player.on('play', handlePlay);
      player.on('pause', handlePause);
      player.on('seeked', handleSeeked);
      player.on('ended', handleEnded);

      player.on('waiting', () => {});

      player.on('dispose', () => {});
    } else {
      const player = playerRef.current;
      player.autoplay(options.autoplay || false);
      player.src(options.sources || []);
    }

    return () => {
      const player = playerRef.current;
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [options, onReady, id, posterUrl]);

  return (
    <div data-vjs-player className="">
      <div ref={videoRef} className="video-js vjs-default-skin" />
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';
export default VideoPlayer;
