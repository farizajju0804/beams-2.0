'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@nextui-org/react';
import { Heart } from 'iconsax-react'; // Assuming you are using iconsax-react
import { toggleFavorite, isFavoriteBeamsToday } from '@/actions/beams-today/favoriteActions';
import { motion } from 'framer-motion';

interface FavoriteButtonProps {
  beamsTodayId: string;
  size: "sm" | "md" | "lg" | undefined;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ beamsTodayId, size }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check if the item is already a favorite
    const checkFavorite = async () => {
      const favorite = await isFavoriteBeamsToday(beamsTodayId);
      setIsFavorite(favorite);
    };
    checkFavorite();
  }, [beamsTodayId]);

  const handleFavoriteToggle = async () => {
    await toggleFavorite(beamsTodayId);
    setIsAnimating(true);
    setIsFavorite((prev) => !prev);
    setTimeout(() => {
      setIsAnimating(false);
    }, 500); // End animation after 500ms
  };

  return (
    <Button size={size} isIconOnly className={isFavorite ? 'bg-red-600' : 'bg-white' } aria-label="Like" onClick={handleFavoriteToggle}>
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: isAnimating ? 1.3 : 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Heart size={size === 'sm' ? 16 : 24} color={isFavorite ? "white" : "black"} variant={isFavorite ? "Bold" : "Linear"} />
      </motion.div>
    </Button>
  );
};

export default FavoriteButton;
