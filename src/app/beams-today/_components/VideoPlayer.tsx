'use client';
import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { CldVideoPlayer } from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';
import { markTopicAsCompleted } from '@/actions/beams-today/completedActions';
import { toast } from 'react-hot-toast'; // React Hot Toast for notifications

interface VideoPlayerProps {
  id: string;
  videoId: string;
  thumbnailUrl: string;
}

// VideoPlayer component to play video using Cloudinary's CldVideoPlayer
const VideoPlayer = forwardRef<any, VideoPlayerProps>(({ id, videoId, thumbnailUrl }, ref) => {
  const playerRef = useRef<any>(null);
  const videoRef = useRef<any>(null);
  const lastTimeRef = useRef(0);
  const playTimeRef = useRef(0);
  const [completionMarked, setCompletionMarked] = useState(false); // Flag to avoid multiple triggers

  // Expose the elapsed time for parent component via ref
  useImperativeHandle(ref, () => ({
    getElapsedTime: () => playTimeRef.current
  }));

  // Track video play time to calculate elapsed time and handle 95% completion
  useEffect(() => {
    const videoElement = videoRef.current;

    const handleTimeUpdate = () => {
      if (videoElement && !videoElement.paused && !videoElement.seeking) {
        const currentTime = videoElement.currentTime;
        const elapsedTime = currentTime - lastTimeRef.current;
        playTimeRef.current += elapsedTime;
        lastTimeRef.current = currentTime;

        // Check if the user has watched 95% of the video and the completion hasn't been marked
        if (!completionMarked && currentTime / videoElement.duration >= 0.15) {
          setCompletionMarked(true); // Mark as completed to prevent multiple triggers

          // Mark the topic as completed for the video format
          markTopicAsCompleted(id, 'video').then(({ success }) => {
            if (success) {
              // Show a notification if it's the first time the topic has been completed
              toast.success('🎉 You have completed the video and earned 100 beams!', {
                duration: 4000,
              });
            }
          });
        }
      }
    };

    const handlePlay = () => {
      if (videoElement) {
        lastTimeRef.current = videoElement.currentTime;
      }
    };

    const handlePause = () => {
      handleTimeUpdate(); // Update time on pause
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
  }, [id, completionMarked]);

  return (
    <div className='min-w-full w-full mx-auto'>
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
        playerRef={playerRef}
        videoRef={videoRef}
      />
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';
export default VideoPlayer;
