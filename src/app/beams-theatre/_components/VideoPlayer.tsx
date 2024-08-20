'use client';
import React, { useEffect, useRef,useState } from 'react';
import 'cloudinary-video-player/cld-video-player.min.css';
import cloudinary from 'cloudinary-video-player';
import 'cloudinary-video-player/playlist';

interface VideoPlayerProps {
  id: string;
  videoId: string;
  thumbnailUrl: string;
  videoTitle: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ id, videoId, thumbnailUrl, videoTitle }) => {
  const videoElementId = `player-${id}`;
  const playerRef = useRef<any>(null);
  const lastTimeRef = useRef(0);
  const playTimeRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 767);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    const initializePlayer = () => {
      const videoElement = document.getElementById(videoElementId) as HTMLVideoElement;
      if (videoElement && videoElement.tagName === 'VIDEO') {
        const player = cloudinary.videoPlayer(videoElementId, {
          cloud_name: 'drlyyxqh9', 
          pictureInPictureToggle: true,
          playbackRates: [0.5, 1, 1.5, 2],
          seekThumbnails: true,
          floatingWhenNotVisible: isMobile ? false : 'right',
          controls: true,
          showLogo : false,
          colors: {
            base: '#181818',
            accent: '#F96F2E',
            text: '#ffffff'
          },
          fontFace: 'Quicksand',
          chaptersButton: true,
          
        });

        playerRef.current = player;
        // player.BigPlay
        const playlistSources = [
          { publicId: 'https://res.cloudinary.com/drlyyxqh9/video/upload/v1716889874/Beams%20today%20-%20videos/wireless_charging_1_ka8cwp.mp4', info: { title: 'Wireless charging' },   poster: 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1722598241/Beams%20today/Wireless%20Charging/Charging_the_future_thumbnail_wzwmzc.png'
          },
          { publicId: 'https://res.cloudinary.com/drlyyxqh9/video/upload/v1716878608/Beams%20today%20-%20videos/robot-compressed_ze0bxu.mp4', info: { title: 'Robot' }, poster: 
            'https://res.cloudinary.com/drlyyxqh9/image/upload/v1722598240/Beams%20today/Robot%20Transforming%20Family%20Life/Robot_Thumbnail_mg5m2j.png'
          },
          { publicId: 'https://res.cloudinary.com/drlyyxqh9/video/upload/v1716878241/Beams%20today%20-%20videos/ai_headphones_-compresssed_fbmo8e.mp4', info: { title: 'Ai Headphones' },
          poster: 'https://res.cloudinary.com/drlyyxqh9/image/upload/v1722598238/Beams%20today/AI%20Headphones/Ai_headphones_Thumbnail_v7zzwd.png'
          }
        ];
        console.log('Playlist Sources:', playlistSources);

        const playlistOptions = {
          autoAdvance: true,
          repeat: false,
          presentUpcoming: 10
        };
        console.log('Playlist Options:', playlistOptions);

        player.playlist(playlistSources, playlistOptions);
        console.log('Player initialized with playlist:', playlistSources);

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
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [videoElementId, videoId, videoTitle, thumbnailUrl,isMobile]);

  return (
    <div className='w-full mx-auto'>
      <video
        id={videoElementId}
        controls
        className="cld-video-playe cld-video-player-skin-light cld-fluid"
      >
      </video>
    </div>
  );
};

export default VideoPlayer;
