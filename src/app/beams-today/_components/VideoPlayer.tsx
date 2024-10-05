import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { CldVideoPlayer } from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';
import { markTopicAsCompleted } from '@/actions/beams-today/completedActions';
import { Toaster, toast } from 'react-hot-toast';
import RewardsModal from '@/components/Rewards';
import { Spinner } from '@nextui-org/react';
import AchievementCompletionPopup from './AchievementCOmpletionPopup';

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
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [pointsAdded, setPointsAdded] = useState(0);
  const [levelUp, setLevelUp] = useState(false);
  const [beams, setBeams] = useState<any>();
  const [newLevel, setNewLevel] = useState<any>();
  const [achievement, setAchievement] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  useImperativeHandle(ref, () => ({
    getElapsedTime: () => playTimeRef.current
  }));
  const handleEnded = async () => {
    if (!completionMarked) {
      setCompletionMarked(true);
      try {
        console.log('Marking topic as completed for video ID:', videoId);
        const { success, leveledUp, beams,  newLevel, pointsAdded, achievementUpdate } = await markTopicAsCompleted(id, 'video');

        if (success) {
          setPointsAdded(pointsAdded);
          setNewLevel(newLevel);
          setBeams(beams)
          if (leveledUp) {
            setLevelUp(leveledUp);
          }
          setAchievement(achievementUpdate)
          setIsModalOpen(true);
        }
      } catch (error) {
        console.error("Error marking topic as completed:", error);
        toast.error('An error occurred while marking the topic as completed.');
      }
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;
  
    const handleTimeUpdate = () => {
      if (videoElement && !videoElement.paused && !videoElement.seeking) {
        // Calculate elapsed time only when video is playing
        const currentTime = videoElement.currentTime;
        const elapsedTime = currentTime - lastTimeRef.current;
  
        if (elapsedTime > 0) {
          playTimeRef.current += elapsedTime;
          lastTimeRef.current = currentTime;
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
      handleTimeUpdate(); // Update the playtime on pause
      console.log('Video paused, total playtime so far:', playTimeRef.current);
    };
  
    const handleSeeked = () => {
      if (videoElement) {
        lastTimeRef.current = videoElement.currentTime; // Update lastTimeRef after seeking
        console.log('Video seeked, new current time:', lastTimeRef.current);
      }
    };
  
    const handleLoadedData = () => {
      setIsLoading(false);
    };
  
    if (videoElement) {
      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      videoElement.addEventListener('ended', handleEnded);
      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('pause', handlePause);
      videoElement.addEventListener('seeked', handleSeeked);
      videoElement.addEventListener('loadeddata', handleLoadedData);
  
      return () => {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        videoElement.removeEventListener('ended', handleEnded);
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('pause', handlePause);
        videoElement.removeEventListener('seeked', handleSeeked);
        videoElement.removeEventListener('loadeddata', handleLoadedData);
      };
    }
  }, [id, completionMarked]);
  

  return (
    <>
      <Toaster position="top-center" />
      <div className="min-w-full w-full mx-auto relative">
      {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
                   <Spinner size="lg" color="primary" />
          </div>
        )}
        <CldVideoPlayer
          id="my-video"
          width="1920"
          height="1080"
          autoPlay={false}
          preload="metadata"
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
       levelUp={levelUp}
       beams={beams}
       isOpen={isModalOpen}
       onClose={()=>{
        setIsModalOpen(false);
        if(!achievement?.isAlreadyCompleted){
           setIsCompletionModalOpen(true);
        }
      }}
       currentLevel={newLevel}
       pointsAdded={pointsAdded}
      />
      <AchievementCompletionPopup
       isOpen={isCompletionModalOpen}
       onClose={()=>{
        setIsCompletionModalOpen(false);
      }}
      achievementName={achievement?.achievement.achievementName}
      completedTasks={achievement?.progress}
      totalTasks={achievement?.achievement.totalCount}
      badgeImageUrl={achievement?.achievement.badgeImageUrl}
      progressColor={achievement?.achievement.color}
      
      />
    </>
  );
});

VideoPlayer.displayName = 'VideoPlayer';
export default VideoPlayer;
