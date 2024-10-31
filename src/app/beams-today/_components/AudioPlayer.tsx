import React, { useRef, useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import H5AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { markTopicAsCompleted } from '@/actions/beams-today/completedActions';
import { toast } from 'react-hot-toast'; // Import toast for notifications
import { VolumeHigh, VolumeMute, Play, Pause, Forward, Backward } from 'iconsax-react'; // Import icons for player controls
import RewardsModal from '@/components/Rewards'; // Import Rewards modal for user feedback
import Image from 'next/image'; // Image component for better performance and optimization
import AchievementCompletionPopup from './AchievementPopup'; // Popup for showing achievement completion

// Define the props for the AudioPlayer component
interface AudioPlayerProps {
  beamsTodayId: string; // ID for the current audio topic
  audioUrl: string; // URL for the audio file
  thumbnailUrl: string; // URL for the thumbnail image
}

// Forward ref to expose certain methods to parent components
const AudioPlayer = forwardRef<any, AudioPlayerProps>(({ beamsTodayId, audioUrl, thumbnailUrl }, ref) => {
  // Refs to track play time and audio element
  const lastTimeRef = useRef(0); // Store the last play time in seconds
  const playTimeRef = useRef(0); // Total accumulated playtime in seconds
  const audioElementRef = useRef<HTMLAudioElement | null>(null); // Reference to the audio element

  // States for audio playback and completion tracking
  const [isPlaying, setIsPlaying] = useState(false);
  const [completionMarked, setCompletionMarked] = useState(false); // Flag to avoid multiple completion marks

  // States for managing modal and achievement displays
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pointsAdded, setPointsAdded] = useState(0);
  const [levelUp, setLevelUp] = useState(false);
  const [beams, setBeams] = useState<any>();
  const [newLevel, setNewLevel] = useState<any>();
  const [achievementToShow, setAchievementToShow] = useState<any>();
  const [showAchievementPopup, setShowAchievementPopup] = useState(false);

  // Expose the elapsed play time for parent component via ref
  useImperativeHandle(ref, () => ({
    getElapsedTime: () => playTimeRef.current, // Method to get total play time
  }));

  // Handle play event
  const handlePlay = () => {
    setIsPlaying(true); // Set playing state
    lastTimeRef.current = new Date().getTime() / 1000; // Track start time in seconds
    
  };

  // Handle pause event
  const handlePause = () => {
    setIsPlaying(false); // Set paused state
    const currentTime = new Date().getTime() / 1000;
    playTimeRef.current += currentTime - lastTimeRef.current; // Calculate playtime in seconds
 
  };

  // Handle seeking through audio
  const handleSeeked = () => {
    if (isPlaying) {
      const currentTime = new Date().getTime() / 1000;
      playTimeRef.current += currentTime - lastTimeRef.current; // Adjust playtime on seek in seconds

    }
    lastTimeRef.current = new Date().getTime() / 1000; // Update last time reference
  };

  // Track listening progress
  const handleListen = () => {
    if (isPlaying && audioElementRef.current) {
      const currentTime = new Date().getTime() / 1000;
      playTimeRef.current += currentTime - lastTimeRef.current; // Update play time
      lastTimeRef.current = currentTime; // Update last play time

      const totalDuration = audioElementRef.current.duration || 0; // Get total audio duration
      const listenedPercentage = (playTimeRef.current / totalDuration) * 100; // Calculate listened percentage
    }
  };

  // Mark topic as completed when audio ends
  const handleEnded = async () => {
    if (!completionMarked) {
      setCompletionMarked(true); // Avoid multiple triggers on completion

      try {
        // Call the function to mark the topic as completed
        const { success, leveledUp, beams, newLevel, pointsAdded, achievementUpdate } = await markTopicAsCompleted(beamsTodayId, 'audio');

        if (success) {
          setPointsAdded(pointsAdded); // Set points added
          setNewLevel(newLevel); // Set new level
          setBeams(beams); // Update beams

          if (leveledUp) {
            setLevelUp(leveledUp); // Check if leveled up
          }

          // Check for achievements
          if (achievementUpdate && achievementUpdate.achievementUpdates) {
            const firstTimeAchievements = Object.keys(achievementUpdate.achievementUpdates).filter(
              (achievementKey) => achievementUpdate.achievementUpdates[achievementKey].isFirstTimeCompletion
            );



            if (firstTimeAchievements.length > 0) {
              const firstAchievement = achievementUpdate.achievementUpdates[firstTimeAchievements[0]]; // Get the first achievement to show
              setAchievementToShow(firstAchievement); // Set the achievement to display
            }
          }
          setIsModalOpen(true); // Open the rewards modal
        }
      } catch (error) {
        console.error('Error marking topic as completed:', error); // Log error
        toast.error('Failed to mark topic as completed.'); // Notify user of error
      }
    }
  };

  // Ensure audio element ref is updated when H5AudioPlayer renders
  useEffect(() => {
    const audioElement = document.querySelector('audio');
    if (audioElement) {
      audioElementRef.current = audioElement as HTMLAudioElement; // Update ref to the audio element
    }
  }, []);

  return (
    <div className="audio-player-card bg-grey-1 mx-auto shadow-lg rounded-3xl lg:w-3/6 w-full p-4 flex flex-col items-center mb-4">
      <div className="thumbnail-container mb-4">
        <Image src={thumbnailUrl} alt="Thumbnail" className="rounded-3xl" width={500} height={500} /> {/* Thumbnail for audio */}
      </div>
      <H5AudioPlayer
        src={audioUrl} // Set the audio source
        autoPlay={false} // Do not autoplay
        customIcons={{
          play: <Play size="24" color="gray" />,
          pause: <Pause size="24" color="gray" />,
          rewind: <Backward size="24" color="gray" />,
          forward: <Forward size="24" color="gray" />,
          volume: <VolumeHigh size="24" color="gray" />,
          volumeMute: <VolumeMute size="24" color="gray" />,
          loop: <div style={{ display: 'none' }} />, // Hide the loop icon
        }}
        customAdditionalControls={[]} // No additional controls
        showSkipControls={false} // Skip controls are hidden
        showJumpControls={true} // Show jump controls
        style={{ width: '100%' }} // Full width style
        onPlay={handlePlay} // Event handler for play
        onPause={handlePause} // Event handler for pause
        onSeeked={handleSeeked} // Event handler for seek
        onListen={handleListen} // Event handler for listening progress
        onEnded={handleEnded} // Call markTopicAsCompleted when audio ends
        listenInterval={1000} // Listen event every second
      />

      {/* Rewards Modal to show points and level updates */}
      <RewardsModal
        levelUp={levelUp}
        beams={beams}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false); // Close modal
          if (achievementToShow) {
            setShowAchievementPopup(true); // Show achievement popup if applicable
          }
        }}
        currentLevel={newLevel}
        pointsAdded={pointsAdded}
      />

      {/* Popup for showing achievement completion */}
      {achievementToShow && (
        <AchievementCompletionPopup
          isOpen={showAchievementPopup}
          onClose={() => setShowAchievementPopup(false)} // Close achievement popup
          achievementName={achievementToShow?.achievement?.name} // Name of the achievement
          badgeImageUrl={achievementToShow?.achievement?.badgeImageUrl} // Badge image URL
          badgeColor={achievementToShow?.achievement?.color} // Badge color
        />
      )}
    </div>
  );
});

AudioPlayer.displayName = 'AudioPlayerComponent';
export default AudioPlayer; // Export the AudioPlayer component
