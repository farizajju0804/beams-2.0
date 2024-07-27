// 'use client'
// import React, { useRef, useEffect } from 'react';
// import { CldVideoPlayer } from 'next-cloudinary';
// import 'next-cloudinary/dist/cld-video-player.css';
// import Breadcrumb from '@/components/Breadcrumbs';
// import { Home } from 'iconsax-react';

// const VideoPage = () => {
//   const playerRef = useRef(null);

//   useEffect(() => {
//     const player = playerRef.current;

//     if (player) {
//       const handlePlay = () => {
//         console.log('Video played');
//       };

//       const handlePause = () => {
//         console.log('Video paused');
//       };

//       const handleSeeked = () => {
//         console.log('Video seeked');
//       };

//       player.on('play', handlePlay);
//       player.on('pause', handlePause);
//       player.on('seeked', handleSeeked);

//       return () => {
//         player.off('play', handlePlay);
//         player.off('pause', handlePause);
//         player.off('seeked', handleSeeked);
//       };
//     }
//   }, []);

//   return (
//     <div className='min-w-[80vw] w-full min-h-screen mx-auto'>
//         <Breadcrumb
//         items={[
//           { name: "Home", href: "/", icon: <Home size="20" /> },
//           { name: "Beams Today", href: "/beams-today" }
//         ]}
     
//       />
//       <CldVideoPlayer
//         id="my-video"
//         playerRef={playerRef}
//         width="4096"
//         height="2160"
//         src="Beams today - videos/robot-compressed_ze0bxu"
//         colors={{
//           accent: '#F9D42E',
//           base: '#370075',
//           text: '#fffff'
//         }}
//         playbackRates={[0.5, 1, 1.5, 2]}
//         pictureInPictureToggle={true}
//         logo={{
//           imageUrl: 'https://example.com/logo.png',
//           onClickUrl: 'https://example.com',
//         }}
//       />
//     </div>
//   );
// };

// export default VideoPage;
import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page