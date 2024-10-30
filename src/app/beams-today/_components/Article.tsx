import React, { useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { Viewer, SpecialZoomLevel, Worker } from '@react-pdf-viewer/core';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';
import { useTheme } from 'next-themes';
import toast from 'react-hot-toast';
import { markTopicAsCompleted } from '@/actions/beams-today/completedActions';
import RewardsModal from '@/components/Rewards';
import AchievementCompletionPopup from './AchievementPopup';

interface ArticleProps {
  articleUrl: string | undefined; // URL of the article to display
  beamsTodayId: string; // ID associated with the beams today entry
}

/**
 * ArticleComponent renders a PDF viewer for an article and handles 
 * completion logic for the article, including displaying achievements and rewards.
 *
 * @param {ArticleProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered component.
 */
const ArticleComponent = forwardRef<any, ArticleProps>(({ articleUrl, beamsTodayId }, ref) => {
  console.log('ArticleComponent rendered');

  const { theme } = useTheme(); // Get the current theme from Next.js themes
  const [completed, setCompleted] = useState(false); // State to track if the article is completed
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control rewards modal visibility
  const [pointsAdded, setPointsAdded] = useState(0); // State to track points added upon completion
  const [levelUp, setLevelUp] = useState(false); // State to track if the user leveled up
  const [beams, setBeams] = useState<any>(); // State to track beams earned
  const [newLevel, setNewLevel] = useState<any>(); // State to track the new level after completion
  const [totalPages, setTotalPages] = useState(0); // Total number of pages in the article
  const [currentPage, setCurrentPage] = useState(0); // Current page being viewed
  const [hasScrolled, setHasScrolled] = useState(false); // State to track if the user has scrolled past the first page
  const [achievementToShow, setAchievementToShow] = useState<any>(); // State to track achievements to show
  const [showAchievementPopup, setShowAchievementPopup] = useState(false); // State to control achievement popup visibility

  // Expose a method to get elapsed time from the parent component
  useImperativeHandle(ref, () => ({
    getElapsedTime: () => 0 // Placeholder implementation
  }));

  const pageNavigationPluginInstance = pageNavigationPlugin(); // Initialize page navigation plugin

  // Handler for when the PDF document is loaded
  const handleDocumentLoad = (e: any) => {
    console.log('Document loaded', e);
    setTotalPages(e.doc.numPages); // Set the total number of pages
    console.log(`Number of pages: ${e.doc.numPages}`);
  };

  // Handler for page change events
  const handlePageChange = (e: any) => {
    console.log('Page changed', e);
    setCurrentPage(e.currentPage); // Update current page state
    
    // Mark as scrolled if the user has gone past the first page
    if (e.currentPage > 1 && !hasScrolled) {
      setHasScrolled(true);
    }
    
    // Check if we've reached the last page and user has scrolled
    if (e.currentPage === totalPages - 1 && hasScrolled && !completed) {
      console.log('Reached last page after scrolling, marking as completed');
      setCompleted(true); // Mark article as completed
      markCompleted(); // Call the function to handle completion logic
    }
  };

  // Function to mark the topic as completed
  const markCompleted = async () => {
    console.log('Marking as completed');
    try {
      // Call the API to mark the topic as completed
      const { success, leveledUp, beams, newLevel, pointsAdded, achievementUpdate } = await markTopicAsCompleted(beamsTodayId, 'text');
      if (success) {
        setPointsAdded(pointsAdded); // Update state with points added
        setNewLevel(newLevel); // Update state with new level
        setBeams(beams); // Update state with beams earned
        if (leveledUp) {
          setLevelUp(leveledUp); // Update state if the user leveled up
        }
        // Check for achievement updates
        if (achievementUpdate && achievementUpdate.achievementUpdates) {
          const firstTimeAchievements = Object.keys(achievementUpdate.achievementUpdates).filter(
            (achievementKey) => achievementUpdate.achievementUpdates[achievementKey].isFirstTimeCompletion
          );


          // Show the first achievement found
          if (firstTimeAchievements.length > 0) {
            const firstAchievement = achievementUpdate.achievementUpdates[firstTimeAchievements[0]];
            setAchievementToShow(firstAchievement); // Set the achievement to show in the popup
          }
        }
        setIsModalOpen(true); // Open the rewards modal
      }
    } catch (error) {
      console.error('Error marking as completed:', error);
      toast.error('Failed to mark article as completed'); // Show error toast if API call fails
    }
  };

  // Effect to log when the completion state changes
  useEffect(() => {
  }, [completed]);

  // Render nothing if no article URL is provided
  if (!articleUrl) {

    return <div>No article available</div>;
  }

  return (
    <div>
      <div style={{ border: '1px solid rgba(0, 0, 0, 0.3)', height: '750px' }}>
        {/* PDF viewer with worker and page navigation */}
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer
            theme={theme} // Set the viewer theme
            fileUrl={articleUrl} // URL of the article
            defaultScale={SpecialZoomLevel.PageFit} // Default zoom level
            onDocumentLoad={handleDocumentLoad} // Handler for document load
            plugins={[pageNavigationPluginInstance]} // Add page navigation plugin
            onPageChange={handlePageChange} // Handler for page change
          />
        </Worker>
      </div>
      {/* Rewards modal to show after completion */}
      <RewardsModal
        levelUp={levelUp}
        beams={beams}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false); // Close the modal
          if (achievementToShow) {
            setShowAchievementPopup(true); // Show achievement popup if applicable
            console.log("Showing achievement popup for:", achievementToShow);
          }
        }}
        currentLevel={newLevel} // Current level after completion
        pointsAdded={pointsAdded} // Points added upon completion
      />
      {/* Achievement completion popup */}
      {achievementToShow && (
        <AchievementCompletionPopup
          isOpen={showAchievementPopup} // Control visibility of the popup
          onClose={() => setShowAchievementPopup(false)} // Close the popup
          achievementName={achievementToShow?.achievement?.name} // Name of the achievement
          badgeImageUrl={achievementToShow?.achievement?.badgeImageUrl} // Badge image URL
          badgeColor={achievementToShow?.achievement?.color} // Badge color
        />
      )}
    </div>
  );
});

// Set display name for debugging purposes
ArticleComponent.displayName = 'ArticleComponent';
export default ArticleComponent;
