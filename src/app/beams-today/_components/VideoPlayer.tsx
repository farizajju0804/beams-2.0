'use client'
import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react'; // Import necessary hooks and components from React
import { CldVideoPlayer } from 'next-cloudinary'; // Import the Cloudinary video player
import 'next-cloudinary/dist/cld-video-player.css'; // Import the Cloudinary video player CSS styles
import { markTopicAsCompleted } from '@/actions/beams-today/completedActions'; // Import the function to mark a topic as completed
import { Toaster, toast } from 'react-hot-toast'; // Import toast notifications
import RewardsModal from '@/components/Rewards'; // Import the rewards modal component
import { Spinner } from '@nextui-org/react'; // Import the Spinner component for loading states
import AchievementCompletionPopup from './AchievementPopup'; // Import the achievement completion popup component

// Define the props for the VideoPlayer component
interface VideoPlayerProps {
  id: string; // Unique identifier for the video
  videoId: string; // Video source identifier
  thumbnailUrl: string; // URL of the thumbnail image for the video
}

// Define the structure of the level information
interface Level {
  levelNumber: number; // Current level number
  maxPoints: number; // Maximum points for the level
}

// Create the VideoPlayer component using forwardRef to allow parent components to access child methods
const VideoPlayer = forwardRef<any, VideoPlayerProps>(({ id, videoId, thumbnailUrl }, ref) => {
  // Create refs to access DOM elements and store state
  const playerRef = useRef<any>(null); // Reference to the video player
  const videoRef = useRef<HTMLVideoElement>(null); // Reference to the video element
  const lastTimeRef = useRef(0); // Ref to store the last playtime for calculating elapsed time
  const playTimeRef = useRef(0); // Ref to accumulate total playtime
  const [completionMarked, setCompletionMarked] = useState(false); // State to track if the topic has been marked as completed
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage the rewards modal visibility
  const [pointsAdded, setPointsAdded] = useState(0); // State to store the points awarded upon completion
  const [levelUp, setLevelUp] = useState(false); // State to track if the user leveled up
  const [beams, setBeams] = useState<any>(); // State to store the beams awarded
  const [newLevel, setNewLevel] = useState<any>(); // State to store the new level information
  const [isLoading, setIsLoading] = useState(true); // State to manage loading state
  const [showAchievementPopup, setShowAchievementPopup] = useState(false); // State to manage achievement popup visibility
  const [achievementToShow, setAchievementToShow] = useState<any>(); // State to store achievement information to display

  // Expose getElapsedTime method to parent components
  useImperativeHandle(ref, () => ({
    getElapsedTime: () => playTimeRef.current // Returns the total elapsed playtime
  }));

  // Function to handle video end event
  const handleEnded = async () => {
    if (!completionMarked) {
      setCompletionMarked(true); // Mark completion to prevent duplicate submissions
      try {
        // Mark the topic as completed and handle rewards/achievements
        const { success, leveledUp, beams, newLevel, pointsAdded, achievementUpdate }: any = await markTopicAsCompleted(id, 'video');
        
        if (success) {
          setPointsAdded(pointsAdded); // Update the points awarded
          setNewLevel(newLevel); // Update the new level
          setBeams(beams); // Update the beams awarded

          // Check if the user has leveled up
          if (leveledUp) {
            setLevelUp(leveledUp);
          }

          // Check for achievement updates
          if (achievementUpdate && achievementUpdate.achievementUpdates) {
            const firstTimeAchievements = Object.keys(achievementUpdate.achievementUpdates).filter(
              (achievementKey) => achievementUpdate.achievementUpdates[achievementKey].isFirstTimeCompletion
            );

            if (firstTimeAchievements.length > 0) {
              const firstAchievement = achievementUpdate.achievementUpdates[firstTimeAchievements[0]];
              setAchievementToShow(firstAchievement); // Set the first achievement to show
            }
          }

          setIsModalOpen(true); // Open the rewards modal
        }
      } catch (error) {
        // Handle errors and show notification
        toast.error('An error occurred while marking the topic as completed.');
      }
    }
  };

  // Effect to handle video events and state updates
  useEffect(() => {
    const videoElement = videoRef.current; // Get the video element reference

    // Function to handle time updates during video playback
    const handleTimeUpdate = () => {
      if (videoElement && !videoElement.paused && !videoElement.seeking) {
        const currentTime = videoElement.currentTime; // Get the current playback time
        const elapsedTime = currentTime - lastTimeRef.current; // Calculate elapsed time

        if (elapsedTime > 0) {
          playTimeRef.current += elapsedTime; // Update the total playtime
          lastTimeRef.current = currentTime; // Update last time
        }
      }
    };

    // Function to handle video play event
    const handlePlay = () => {
      if (videoElement) {
        lastTimeRef.current = videoElement.currentTime; // Store the current time on play
      }
    };

    // Function to handle video pause event
    const handlePause = () => {
      handleTimeUpdate(); // Update the playtime on pause
    };

    // Function to handle video seek event
    const handleSeeked = () => {
      if (videoElement) {
        lastTimeRef.current = videoElement.currentTime; // Update the last time after seeking
      }
    };

    // Function to handle video data load event
    const handleLoadedData = () => {
      setIsLoading(false); // Set loading to false when video data is loaded
    };

    // Attach event listeners to the video element
    if (videoElement) {
      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      videoElement.addEventListener('ended', handleEnded);
      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('pause', handlePause);
      videoElement.addEventListener('seeked', handleSeeked);
      videoElement.addEventListener('loadeddata', handleLoadedData);

      // Cleanup function to remove event listeners
      return () => {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        videoElement.removeEventListener('ended', handleEnded);
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('pause', handlePause);
        videoElement.removeEventListener('seeked', handleSeeked);
        videoElement.removeEventListener('loadeddata', handleLoadedData);
      };
    }
  }, [id, completionMarked]); // Re-run effect when id or completionMarked changes

  // Function to handle closing of the rewards modal
  const handleRewardsModalClose = () => {
    setIsModalOpen(false); // Close the rewards modal
    if (achievementToShow) {
      setShowAchievementPopup(true); // Show achievement popup if there is an achievement to show
    }
  };

  return (
    <>
      <Toaster position="top-center" /> {/* Notification toaster for feedback messages */}
      <div className="min-w-full w-full mx-auto relative"> {/* Container for video player */}
        {isLoading && ( // Show loading spinner while the video is loading
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
          poster={thumbnailUrl} // Set the thumbnail as the poster image
          fluid={true} // Enable fluid width
          className="cld-fluid" // CSS class for styling
          src={videoId} // Video source
          colors={{
            accent: '#F9D42E', // Accent color for player controls
            base: '#370075', // Base color for player background
            text: '#ffffff' // Text color for player controls
          }}
          playbackRates={[0.5, 1, 1.5, 2]} // Available playback rates
          pictureInPictureToggle={true} // Enable picture-in-picture mode
          playerRef={playerRef} // Reference to the video player
          videoRef={videoRef} // Reference to the video element
        />
      </div>
      <RewardsModal
        levelUp={levelUp} // Prop to indicate if the user leveled up
        beams={beams} // Prop to pass the beams awarded
        isOpen={isModalOpen} // Prop to control modal visibility
        onClose={handleRewardsModalClose} // Prop for closing the modal
        currentLevel={newLevel} // Prop to show the new level achieved
        pointsAdded={pointsAdded} // Prop to show points awarded
      />
      {achievementToShow && ( // Render achievement popup if there's an achievement to show
       <AchievementCompletionPopup
       isOpen={showAchievementPopup}
       onClose={() => setShowAchievementPopup(false)}
       achievementName={achievementToShow?.achievement?.name}
       badgeImageUrl={achievementToShow?.achievement?.badgeImageUrl}
       badgeColor={achievementToShow?.achievement?.color}
     />     
      )}
    </>
  );
});

VideoPlayer.displayName = 'VideoPlayer'; // Set display name for debugging
export default VideoPlayer; // Export the VideoPlayer component
