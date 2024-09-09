'use client'; // Ensures the component is rendered on the client side in a Next.js application.

import React, { useState, useEffect } from 'react';
import { Button } from '@nextui-org/react'; // Button component from NextUI for UI styling.
import { Heart } from 'iconsax-react'; // Importing the Heart icon from the iconsax-react library.
import { toggleFavorite, isFavoriteBeamsToday } from '@/actions/beams-today/favoriteActions'; // Functions to handle favorite state.
import { motion } from 'framer-motion'; // Importing framer-motion for animation.

interface FavoriteButtonProps {
  beamsTodayId: string; // The unique ID of the item that can be favorited.
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ beamsTodayId }) => {
  const [isFavorite, setIsFavorite] = useState(false); // State to track whether the item is marked as favorite.
  const [isAnimating, setIsAnimating] = useState(false); // State to control the animation when toggling favorite.

  // Effect to check if the item is already marked as favorite when the component mounts.
  useEffect(() => {
    let isMounted = true; // Flag to prevent setting state if the component unmounts.

    const checkFavorite = async () => {
      const favorite = await isFavoriteBeamsToday(beamsTodayId); // Check the favorite status of the item.
      if (isMounted) {
        setIsFavorite(favorite); // Update the state if the component is still mounted.
      }
    };

    checkFavorite(); // Call the function to check the favorite status on mount.

    return () => {
      isMounted = false; // Clean up to avoid state update after component unmounts.
    };
  }, [beamsTodayId]); // Dependency on `beamsTodayId` to recheck the favorite status if the ID changes.

  // Handler function to toggle the favorite status when the button is clicked.
  const handleFavoriteToggle = async (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevents triggering any parent click events.
    event.preventDefault(); // Prevents default behavior (useful in forms or links).
    
    await toggleFavorite(beamsTodayId); // Toggle the favorite status via an API or action.
    
    setIsAnimating(true); // Start the animation for feedback.
    setIsFavorite((prev) => !prev); // Toggle the `isFavorite` state.
    
    // Stop the animation after 500ms.
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  return (
    <Button 
      size={"sm"} // Button size (small).
      isIconOnly // Button has only an icon.
      className={isFavorite ? 'bg-red-600' : 'bg-grey-1'} // Background color depends on favorite status.
      aria-label="Like" // Accessibility label for screen readers.
      onClick={handleFavoriteToggle} // Click handler to toggle the favorite status.
    >
      <motion.div
        initial={{ scale: 1 }} // Initial state of the scaling animation.
        animate={{ scale: isAnimating ? 1.4 : 1 }} // Scale up the icon when toggling favorite.
        transition={{ duration: 0.5, ease: "easeInOut" }} // Smooth transition over 0.5 seconds.
      >
        {/* Heart icon: changes its style depending on whether the item is favorited or not. */}
        <Heart 
          size={20} // Icon size.
          className={isFavorite ? "text-white" : "text-text"} // Icon color depends on favorite status.
          variant={isFavorite ? "Bold" : "Linear"} // Icon style (bold if favorited, linear if not).
        />
      </motion.div>
    </Button>
  );
};

export default FavoriteButton; // Export the component for use in other parts of the application.
