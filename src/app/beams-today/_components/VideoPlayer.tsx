import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { CldVideoPlayer } from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';
import { markTopicAsCompleted } from '@/actions/beams-today/completedActions';
import { Toaster, toast } from 'react-hot-toast';
import RewardsModal from '@/components/Rewards';

interface VideoPlayerProps {
  id: string;
  videoId: string;
  thumbnailUrl: string;
}

interface Level {
  levelNumber: number;
  maxPoints: number;
}

const VideoPlayer = forwardRef<any, VideoPlayerProps>(({ id, videoId, thumbnailUrl }, ref) => {
  const playerRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastTimeRef = useRef(0);
  const playTimeRef = useRef(0);
  const [completionMarked, setCompletionMarked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [newPoints, setNewPoints] = useState(0);
  const [currentLevel2, setCurrentLevel] = useState<any>();
  const [levelUp, setLevelUp] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<any>();
  const [newLevel, setnewLevel] = useState<any>();

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

    const handleEnded = async () => {
      if (!completionMarked) {
        setCompletionMarked(true);
        try {
          console.log('Marking topic as completed for video ID:', videoId);
          const { success, leveledUp, currentLevel, currentPoints, newLevel, pointsAdded } = await markTopicAsCompleted(id, 'video');


          if (success) {
            setUserPoints(prevPoints => prevPoints + 100);
            setNewPoints(prevPoints => prevPoints + 100);
            setCurrentLevel(currentLevel);
            setCurrentPoints(currentPoints)
            if (leveledUp) {
              setLevelUp(leveledUp);
              setnewLevel(newLevel);
              console.log('Level Up! Current Level:', currentLevel, 'New Level:', newLevel);
            }
            setIsModalOpen(true);
          }
        } catch (error) {
          console.error("Error marking topic as completed:", error);
          toast.error('An error occurred while marking the topic as completed.');
        }
      }
    };

    const handlePlay = () => {
      if (videoElement) {
        lastTimeRef.current = videoElement.currentTime;
        console.log('Video playing, current time:', lastTimeRef.current);
      }
    };

    const handlePause = () => {
      handleTimeUpdate();
      console.log('Video paused, total playtime so far:', playTimeRef.current);
    };

    const handleSeeked = () => {
      if (videoElement) {
        lastTimeRef.current = videoElement.currentTime;
        console.log('Video seeked, new current time:', lastTimeRef.current);
      }
    };

    if (videoElement) {
      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      videoElement.addEventListener('ended', handleEnded);
      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('pause', handlePause);
      videoElement.addEventListener('seeked', handleSeeked);

      return () => {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        videoElement.removeEventListener('ended', handleEnded);
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('pause', handlePause);
        videoElement.removeEventListener('seeked', handleSeeked);
      };
    }
  }, [id, completionMarked]);

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-w-full w-full mx-auto">
        <CldVideoPlayer
          id="my-video"
          width="1920"
          height="1080"
          poster={thumbnailUrl}
          fluid={true}
          className="cld-fluid"
          src={videoId}
          colors={{
            accent: '#F9D42E',
            base: '#370075',
            text: '#ffffff'
          }}
          playbackRates={[0.5, 1, 1.5, 2]}
          pictureInPictureToggle={true}
          playerRef={playerRef}
          videoRef={videoRef}
        />
      </div>
      <RewardsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        points={userPoints - 100} 
        newPoints={newPoints}
        levelUp={levelUp}
        currentLevel={currentLevel2}
        nextLevel={newLevel}
        caption={newLevel?.caption}
        currentPoints={currentPoints}
      />
    </>
  );
});

VideoPlayer.displayName = 'VideoPlayer';
export default VideoPlayer;
