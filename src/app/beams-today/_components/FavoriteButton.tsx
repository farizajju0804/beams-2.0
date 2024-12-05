'use client';

import React, { useState } from 'react';
import { Button } from '@nextui-org/react';
import { Heart } from 'iconsax-react';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { toggleFavorite } from '@/actions/beams-today/favoriteActions';

interface FavoriteButtonMainProps {
  favoriteStatus: boolean; // Unique identifier for the beam item
  beamsTodayId : string
}

const FavoriteButton: React.FC<FavoriteButtonMainProps> = ({ favoriteStatus,beamsTodayId }) => {
  // Local state management
  const [isAnimating, setIsAnimating] = useState(false);         // Controls heart animation
  const [isFavoriteState, setIsFavoriteState] = useState(favoriteStatus); // Tracks favorite status
  const [isProcessing, setIsProcessing] = useState(false);       // Prevents double-clicks


  

  // Helper function to check for network connectivity
  const checkNetworkConnection = (): boolean => {
    if (!navigator.onLine) {
      toast.error('Unable to update favorite. Please check your internet connection.');
      return false;
    }
    return true;
  };

  // Handle the favorite/unfavorite action
  const handleFavoriteToggle = async (event: React.MouseEvent) => {
    // Prevent event bubbling and default behavior
    event.stopPropagation();
    event.preventDefault();

    // Prevent multiple simultaneous requests
    if (isProcessing) return;

    // Check internet connectivity
    if (!checkNetworkConnection()) return;

    setIsProcessing(true); // Lock the button while processing

    try {
      // Attempt to toggle the favorite status
      await toggleFavorite(beamsTodayId);

      // Toggle local favorite state
      setIsFavoriteState(!isFavoriteState);

      // Trigger heart animation
      setIsAnimating(true);

      // Show success message based on the new favorite state
      toast.success(isFavoriteState ? 'Removed from favorites' : 'Added to favorites');

      // Reset animation after 500ms
      setTimeout(() => {
        setIsAnimating(false);
      }, 500);
    } catch (error) {
      // Handle different types of errors
      if (!navigator.onLine) {
        toast.error('Unable to update favorite. Please check your internet connection.');
      } else {
        console.error('Failed to toggle favorite:', error);
        toast.error('Failed to update favorite. Please try again later.');
      }
    } finally {
      setIsProcessing(false); // Unlock the button after processing
    }
  };

  // if(isProcessing){
  //   return null
  // }
  return (
    <>
      {/* Toast container for notifications */}
      <Toaster position="top-center" />

      {/* Favorite toggle button */}
      <Button
        size="sm"
        isIconOnly
        className={ `hover:bg-none hover:opacity-none  ${isFavoriteState ? 'bg-red-600' : 'bg-grey-1'}`}
        aria-label={isFavoriteState ? "Unlike" : "Like"}
        onClick={handleFavoriteToggle}
        isDisabled={isProcessing} // Disable button while processing
      >
        {/* Animated heart icon container */}
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: isAnimating ? 1.4 : 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Heart icon with dynamic styling based on favorite state */}
          <Heart
            size={20}
            className={isFavoriteState ? "text-white" : "text-text"}
            variant={isFavoriteState ? "Bold" : "Linear"}
          />
        </motion.div>
      </Button>
    </>
  );
};

export default FavoriteButton;
