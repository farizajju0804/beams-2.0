'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@nextui-org/react';
import { Heart } from 'iconsax-react';
import { motion } from 'framer-motion';
import { useFavoritesStore } from '@/store/favoritesStore';
import { toast, Toaster } from 'react-hot-toast'; // Import toast for error notifications

// Define the props interface for the FavoriteButton component
interface FavoriteButtonProps {
  beamsTodayId: string; // Unique identifier for the beam item
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ beamsTodayId }) => {
  // Destructure required methods from the favorites store
  const { toggleFavorite, initializeFavorites, isFavorite } = useFavoritesStore();

  // Local state management
  const [isAnimating, setIsAnimating] = useState(false);         // Controls heart animation
  const [isFavoriteState, setIsFavoriteState] = useState(false); // Tracks favorite status
  const [isProcessing, setIsProcessing] = useState(false);       // Prevents double-clicks

  // Initialize favorites data when component mounts
  useEffect(() => {
    try {
      initializeFavorites();
    } catch (error) {
      console.error('Failed to initialize favorites:', error);
      toast.error('Failed to load favorites. Please try again later.');
    }
  }, []);

  // Update local favorite state when beamsTodayId or isFavorite changes
  useEffect(() => {
    setIsFavoriteState(isFavorite(beamsTodayId));
  }, [beamsTodayId, isFavorite]);

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

    setIsProcessing(true);

    try {
      // Attempt to toggle the favorite status
      await toggleFavorite(beamsTodayId);
      
      // Update local state to reflect the new favorite status
      setIsFavoriteState(isFavorite(beamsTodayId));
      
      // Trigger heart animation
      setIsAnimating(true);
      
      // Show success message
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
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Toast container for notifications */}
      <Toaster position="top-center" />

      {/* Favorite toggle button */}
      <Button
        size="sm"
        isIconOnly
        className={isFavoriteState ? 'bg-red-600' : 'bg-grey-1'}
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