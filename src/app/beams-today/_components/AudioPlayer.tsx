import React, { useRef, useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import H5AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { markTopicAsCompleted } from '@/actions/beams-today/completedActions';
import { toast } from 'react-hot-toast'; // React Hot Toast
import { VolumeHigh, VolumeMute, Play, Pause, Forward, Backward } from 'iconsax-react';
import RewardsModal from '@/components/Rewards'; // Import the RewardsModal
import Image from 'next/image';

interface AudioPlayerProps {
  beamsTodayId: string;
  audioUrl: string;
  thumbnailUrl: string;
}

const AudioPlayer = forwardRef<any, AudioPlayerProps>(({ beamsTodayId, audioUrl, thumbnailUrl }, ref) => {
  const lastTimeRef = useRef(0); // Store the last play time in seconds
  const playTimeRef = useRef(0); // Total accumulated playtime in seconds
  const audioElementRef = useRef<HTMLAudioElement | null>(null); // Reference to audio element
  const [isPlaying, setIsPlaying] = useState(false);
  const [completionMarked, setCompletionMarked] = useState(false); // Flag to avoid marking completion multiple times

  // New states for RewardsModal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [newPoints, setNewPoints] = useState(0);
  const [currentLevel, setCurrentLevel] = useState<any>();
  const [levelUp, setLevelUp] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<any>();
  const [newLevel, setNewLevel] = useState<any>();

  // Expose the elapsed play time for parent component via ref
  useImperativeHandle(ref, () => ({
    getElapsedTime: () => playTimeRef.current,
  }));

  const handlePlay = () => {
    setIsPlaying(true);
    lastTimeRef.current = new Date().getTime() / 1000; // Track start time in seconds
    console.log('Playing audio');
  };

  const handlePause = () => {
    setIsPlaying(false);
    const currentTime = new Date().getTime() / 1000;
    playTimeRef.current += currentTime - lastTimeRef.current; // Calculate playtime in seconds
    console.log('Paused audio, playTime (seconds):', playTimeRef.current);
  };

  const handleSeeked = () => {
    if (isPlaying) {
      const currentTime = new Date().getTime() / 1000;
      playTimeRef.current += currentTime - lastTimeRef.current; // Adjust playtime on seek in seconds
      console.log('Seeked audio, playTime (seconds):', playTimeRef.current);
    }
    lastTimeRef.current = new Date().getTime() / 1000; // Update last time reference
  };

  // Track listening progress
  const handleListen = () => {
    if (isPlaying && audioElementRef.current) {
      const currentTime = new Date().getTime() / 1000;
      playTimeRef.current += currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      const totalDuration = audioElementRef.current.duration || 0;
      const listenedPercentage = (playTimeRef.current / totalDuration) * 100;
      console.log(`Listened Percentage: ${listenedPercentage.toFixed(2)}%, Duration: ${totalDuration}, PlayTime (seconds): ${playTimeRef.current}`);
    }
  };

  // Mark topic as completed when the audio ends
  const handleEnded = async () => {
    if (!completionMarked) {
      setCompletionMarked(true); // Avoid multiple triggers

      try {
        const { success, leveledUp, currentLevel, newLevel, currentPoints, pointsAdded } = await markTopicAsCompleted(beamsTodayId, 'audio');
        if (success) {
          setUserPoints(prevPoints => prevPoints + 100);
          setNewPoints(prevPoints => prevPoints + 100);
          setCurrentLevel(currentLevel);
          setCurrentPoints(currentPoints);
          if (leveledUp) {
            setLevelUp(leveledUp);
            setNewLevel(newLevel);
          }
          setIsModalOpen(true); // Open the RewardsModal
        }
      } catch (error) {
        console.error('Error marking topic as completed:', error);
        toast.error('Failed to mark topic as completed.');
      }
    }
  };

  // Ensure audio element ref is updated when H5AudioPlayer renders
  useEffect(() => {
    const audioElement = document.querySelector('audio');
    if (audioElement) {
      audioElementRef.current = audioElement as HTMLAudioElement;
      console.log('Audio element initialized', audioElement);
    }
  }, []);

  return (
    <div className="audio-player-card bg-grey-1 mx-auto shadow-lg rounded-3xl lg:w-3/6 w-full p-4 flex flex-col items-center mb-4">
      <div className="thumbnail-container mb-4">
        <Image src={thumbnailUrl} alt="Thumbnail" className="rounded-3xl" width={500} height={500} />
      </div>
      <H5AudioPlayer
        src={audioUrl}
        autoPlay={false}
        customIcons={{
          play: <Play size="24" color="gray" />,
          pause: <Pause size="24" color="gray" />,
          rewind: <Backward size="24" color="gray" />,
          forward: <Forward size="24" color="gray" />,
          volume: <VolumeHigh size="24" color="gray" />,
          volumeMute: <VolumeMute size="24" color="gray" />,
          loop: <div style={{ display: 'none' }} />, // Hide the loop icon
        }}
        customAdditionalControls={[]}
        showSkipControls={false}
        showJumpControls={true}
        style={{ width: '100%' }}
        onPlay={handlePlay}
        onPause={handlePause}
        onSeeked={handleSeeked}
        onListen={handleListen}
        onEnded={handleEnded} // Call markTopicAsCompleted when the audio ends
        listenInterval={1000} // Listen event every second
      />

      <RewardsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        points={userPoints - 100}
        newPoints={newPoints}
        levelUp={levelUp}
        currentLevel={currentLevel}
        nextLevel={newLevel}
        caption={newLevel?.caption}
        currentPoints={currentPoints}
      />
    </div>
  );
});

AudioPlayer.displayName = 'AudioPlayer';
export default AudioPlayer;
