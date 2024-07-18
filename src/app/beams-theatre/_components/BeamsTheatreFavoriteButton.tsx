// src/components/BeamsTheatreFavoriteButton.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@nextui-org/react';
import { Heart } from 'iconsax-react';
import { toggleFavoriteBeamsTheatre, isFavoriteBeamsTheatre } from '@/actions/beams-theatre/favoriteActions';
import { motion } from 'framer-motion';

interface FavoriteButtonProps {
  beamsTheatreId: string;
}

const BeamsTheatreFavoriteButton: React.FC<FavoriteButtonProps> = ({ beamsTheatreId }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if the item is already a favorite
    const checkFavorite = async () => {
      const favorite = await isFavoriteBeamsTheatre(beamsTheatreId);
      setIsFavorite(favorite);
    };
    checkFavorite();
  }, [beamsTheatreId]);

  const handleFavoriteToggle = async (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    await toggleFavoriteBeamsTheatre(beamsTheatreId);
    setIsAnimating(true);
    setIsFavorite((prev) => !prev);
    setTimeout(() => {
      setIsAnimating(false);
    }, 500); // End animation after 500ms
  };

  return (
    <Button size={"sm"} isIconOnly className={isFavorite ? 'bg-red-600' : 'bg-white' } aria-label="Like" onClick={handleFavoriteToggle}>
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: isAnimating ? 1.4 : 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Heart size={20} color={isFavorite ? "white" : "black"} variant={isFavorite ? "Bold" : "Linear"} />
      </motion.div>
    </Button>
  );
};

export default BeamsTheatreFavoriteButton;
