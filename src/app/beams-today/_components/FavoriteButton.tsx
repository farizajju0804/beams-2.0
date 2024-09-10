// FavoriteButton.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@nextui-org/react';
import { Heart } from 'iconsax-react';
import { motion } from 'framer-motion';
import { useFavoritesStore } from '@/store/favoritesStore';

interface FavoriteButtonProps {
  beamsTodayId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ beamsTodayId }) => {
  const { toggleFavorite, initializeFavorites, isFavorite } = useFavoritesStore();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isFavoriteState, setIsFavoriteState] = useState(false);

  useEffect(() => {
    initializeFavorites();
  }, []);

  useEffect(() => {
    setIsFavoriteState(isFavorite(beamsTodayId));
  }, [beamsTodayId, isFavorite]);

  const handleFavoriteToggle = async (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    
    await toggleFavorite(beamsTodayId);
    setIsFavoriteState(isFavorite(beamsTodayId));
    
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  return (
    <Button 
      size="sm"
      isIconOnly
      className={isFavoriteState ? 'bg-red-600' : 'bg-grey-1'}
      aria-label={isFavoriteState ? "Unlike" : "Like"}
      onClick={handleFavoriteToggle}
    >
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: isAnimating ? 1.4 : 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Heart 
          size={20}
          className={isFavoriteState ? "text-white" : "text-text"}
          variant={isFavoriteState ? "Bold" : "Linear"}
        />
      </motion.div>
    </Button>
  );
};

export default FavoriteButton;