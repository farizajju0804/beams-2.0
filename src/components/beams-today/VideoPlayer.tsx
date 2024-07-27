// 'use client';
// import React, { useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
// import videojs from 'video.js';
// import 'video.js/dist/video-js.css';
// import 'videojs-mobile-ui/dist/videojs-mobile-ui.css';
// import 'videojs-mobile-ui';

// interface VideoPlayerProps {
//   options: any;
//   onReady?: (player: any) => void;
//   id: string; // Add videoId prop to uniquely identify the video
 
// }

// const VideoPlayer = forwardRef<any, VideoPlayerProps>(({ options, onReady, id }, ref) => {
//   const videoRef = useRef<HTMLDivElement | null>(null);
//   const playerRef = useRef<any | null>(null);
//   const lastTimeRef = useRef(0);
//   const playTimeRef = useRef(0);

//   useImperativeHandle(ref, () => ({
//     getElapsedTime: () => playTimeRef.current
//   }));

//   const handleTimeUpdate = () => {
//     const player = playerRef.current;
//     if (player && !player.paused() && !player.seeking()) {
//       const currentTime = player.currentTime();
//       const elapsedTime = currentTime - lastTimeRef.current;
//       playTimeRef.current += elapsedTime;
//       lastTimeRef.current = currentTime;
//     }
//   };

//   const handlePlay = () => {
//     const player = playerRef.current;
//     if (player) {
//       lastTimeRef.current = player.currentTime();
//     }
//   };

//   const handlePause = () => {
//     handleTimeUpdate();
//   };

//   const handleSeeked = () => {
//     const player = playerRef.current;
//     if (player) {
//       lastTimeRef.current = player.currentTime();
//     }
//   };
 

//   useEffect(() => {
//     if (!playerRef.current) {
//       const videoElement = document.createElement('video-js');
//       videoElement.classList.add('vjs-big-play-centered');
//       if (videoRef.current) {
//         videoRef.current.appendChild(videoElement);
//       }

//       const player = (playerRef.current = videojs(videoElement, { ...options }, () => {
//         videojs.log('player is ready');
//         if (onReady) {
//           onReady(player);
//         }
//       }));

//       // Attach event listeners
//       player.on('timeupdate', handleTimeUpdate);
//       player.on('play', handlePlay);
//       player.on('pause', handlePause);
//       player.on('seeked', handleSeeked);
  

//       player.on('waiting', () => {});

//       player.on('dispose', () => {});
//     } else {
//       const player = playerRef.current;
//       player.autoplay(options.autoplay || false);
//       player.src(options.sources || []);
//     }

//     return () => {
//       const player = playerRef.current;
//       if (player && !player.isDisposed()) {
//         player.dispose();
//         playerRef.current = null;
//       }
//     };
//   }, [options, onReady, id]);

//   return (
//     <div data-vjs-player className="">
//       <div ref={videoRef} className="video-js vjs-default-skin" />
//     </div>
//   );
// });

// VideoPlayer.displayName = 'VideoPlayer';
// export default VideoPlayer;


'use client';
import React, { useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { CldVideoPlayer } from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';

interface VideoPlayerProps {
  id: string;
  videoId: string;
}

const VideoPlayer = forwardRef<any, VideoPlayerProps>(({ id, videoId }, ref) => {
  const playerRef = useRef<any>(null);
  const lastTimeRef = useRef(0);
  const playTimeRef = useRef(0);

  useImperativeHandle(ref, () => ({
    getElapsedTime: () => playTimeRef.current
  }));

  const handleTimeUpdate = (event:any) => {
    const player = event.target;
    if (player && !player.paused && !player.seeking) {
      const currentTime = player.currentTime;
      const elapsedTime = currentTime - lastTimeRef.current;
      playTimeRef.current += elapsedTime;
      lastTimeRef.current = currentTime;
      console.log(`Elapsed time updated: ${playTimeRef.current}`);
    }
  };

  const handlePlay = (event:any) => {
    const player = event.target;
    if (player) {
      lastTimeRef.current = player.currentTime;
      console.log(`Last time updated: ${lastTimeRef.current}`);
    }
  };

  const handlePause = (event:any) => {
    handleTimeUpdate(event);
    console.log('Video paused');
  };

  const handleSeeked = (event:any) => {
    const player = event.target;
    if (player) {
      lastTimeRef.current = player.currentTime;
      console.log(`Seeked to: ${lastTimeRef.current}`);
    }
  };

  const handlePercentsPlayed = (event:any) => {
    console.log(`${event.eventData.percent} percents played`);
  };

  const handleTimePlayed = (event:any) => {
    console.log(`${event.eventData.time} seconds played`);
  };

  const handleSeek = (event:any) => {
    console.log(`Start: ${event.eventData.seekStart} End: ${event.eventData.seekEnd}`);
  };

  const handleQualityChanged = (event:any) => {
    console.log(`Quality changed from: ${event.eventData.from} to: ${event.eventData.to}`);
  };

  useEffect(() => {
    const player = playerRef.current?.getInternalPlayer();
    if (player) {
      player.on('timeupdate', handleTimeUpdate);
      player.on('play', handlePlay);
      player.on('pause', handlePause);
      player.on('seeked', handleSeeked);
      player.on('percentsplayed', handlePercentsPlayed);
      player.on('timeplayed', handleTimePlayed);
      player.on('seek', handleSeek);
      player.on('qualitychanged', handleQualityChanged);

      return () => {
        player.off('timeupdate', handleTimeUpdate);
        player.off('play', handlePlay);
        player.off('pause', handlePause);
        player.off('seeked', handleSeeked);
        player.off('percentsplayed', handlePercentsPlayed);
        player.off('timeplayed', handleTimePlayed);
        player.off('seek', handleSeek);
        player.off('qualitychanged', handleQualityChanged);
      };
    }
  }, []);

  return (
    <div className='min-w-[80vw] w-full  mx-auto'>
      <CldVideoPlayer
        id="my-video"
        width="1920"
        height="1080"
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
      />
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';
export default VideoPlayer;


