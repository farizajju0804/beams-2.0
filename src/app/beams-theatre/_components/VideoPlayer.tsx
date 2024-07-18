import React, { useEffect, useRef } from 'react';

const VideoPlayer: React.FC<{ url: string }> = ({ url }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load(); 
    }
  }, [url]);

  return (
    <div className="video-player w-full ">
      <video controls className="w-full" ref={videoRef} key={url}>
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
