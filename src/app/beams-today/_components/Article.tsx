import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { Viewer, SpecialZoomLevel, Worker } from '@react-pdf-viewer/core';
import { pageNavigationPlugin} from '@react-pdf-viewer/page-navigation';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';
import { useTheme } from 'next-themes';
import toast from 'react-hot-toast';
import { markTopicAsCompleted } from '@/actions/beams-today/completedActions';
import RewardsModal from '@/components/Rewards';
import AchievementCompletionPopup from './AchievementPopup';



interface ArticleProps {
  articleUrl: string | undefined;
  beamsTodayId: string;
}

const ArticleComponent = forwardRef<any, ArticleProps>(({ articleUrl, beamsTodayId }, ref) => {
  console.log('ArticleComponent rendered');

  const { theme } = useTheme();
  const [completed, setCompleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pointsAdded, setPointsAdded] = useState(0);
  const [levelUp, setLevelUp] = useState(false);
  const [beams, setBeams] = useState<any>();
  const [newLevel, setNewLevel] = useState<any>();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [achievementToShow, setAchievementToShow] = useState<any>();
  const [showAchievementPopup, setShowAchievementPopup] = useState(false);

  useImperativeHandle(ref, () => ({
    getElapsedTime: () => 0
  }));

  const pageNavigationPluginInstance = pageNavigationPlugin();

  const handleDocumentLoad = (e: any) => {
    console.log('Document loaded', e);
    setTotalPages(e.doc.numPages);
    console.log(`Number of pages: ${e.doc.numPages}`);
  };

  const handlePageChange = (e: any) => {
    console.log('Page changed', e);
    setCurrentPage(e.currentPage);
    
    // Mark as scrolled if the user has gone past the first page
    if (e.currentPage > 1 && !hasScrolled) {
      setHasScrolled(true);
    }
    
    // Check if we've reached the last page and user has scrolled
    if (e.currentPage === totalPages-1 && hasScrolled && !completed) {
      console.log('Reached last page after scrolling, marking as completed');
      setCompleted(true);
      markCompleted();
    }
  };

  const markCompleted = async () => {
    console.log('Marking as completed');
    try {
      const { success, leveledUp, beams,  newLevel, pointsAdded, achievementUpdate } = await markTopicAsCompleted(beamsTodayId, 'text');
      if (success) {
        setPointsAdded(pointsAdded);
        setNewLevel(newLevel);
        setBeams(beams)
        if (leveledUp) {
          setLevelUp(leveledUp);
        }
        if (achievementUpdate && achievementUpdate.achievementUpdates) {
          const firstTimeAchievements = Object.keys(achievementUpdate.achievementUpdates).filter(
            (achievementKey) => achievementUpdate.achievementUpdates[achievementKey].isFirstTimeCompletion
          );
        
          console.log("First-time achievements found:", firstTimeAchievements);
        
          if (firstTimeAchievements.length > 0) {
            const firstAchievement = achievementUpdate.achievementUpdates[firstTimeAchievements[0]];
            console.log("First achievement to show:", firstAchievement);
            setAchievementToShow(firstAchievement);
          }
        }
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error marking as completed:', error);
      toast.error('Failed to mark article as completed');
    }
  };

  useEffect(() => {
    console.log('useEffect running, completed:', completed);
  }, [completed]);

  if (!articleUrl) {
    console.log('No article URL provided');
    return <div>No article available</div>;
  }

  return (
    <div>
      <div style={{ border: '1px solid rgba(0, 0, 0, 0.3)', height: '750px' }}>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer
            theme={theme}
            
            fileUrl={articleUrl}
            defaultScale={SpecialZoomLevel.PageFit}
            onDocumentLoad={handleDocumentLoad}
            plugins={[pageNavigationPluginInstance]}
            // pageScrollMode={PageScrollMode.Vertical}
            onPageChange={handlePageChange}
          />
        </Worker>
      </div>
      <RewardsModal
       levelUp={levelUp}
       beams={beams}
       isOpen={isModalOpen}
       onClose={()=>{
        setIsModalOpen(false);
        if (achievementToShow) {
          setShowAchievementPopup(true);
          console.log("Showing achievement popup for:", achievementToShow);
        }
      }}
       currentLevel={newLevel}
       pointsAdded={pointsAdded}
      />
       {achievementToShow && (
        <AchievementCompletionPopup
          isOpen={showAchievementPopup}
          onClose={() => setShowAchievementPopup(false)}
          achievementName={achievementToShow?.achievement?.name}
          badgeImageUrl={achievementToShow?.achievement?.badgeImageUrl}
          badgeColor={achievementToShow?.achievement?.color}
        />
      )}
    </div>
  );
});

ArticleComponent.displayName = 'ArticleComponent';
export default ArticleComponent;