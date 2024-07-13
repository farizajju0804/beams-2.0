'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@nextui-org/react';
import { Heart } from 'iconsax-react'; // Assuming you are using iconsax-react
import { toggleFavorite, isFavoriteBeamsToday } from '@/actions/beams-today/favoriteActions';
import { motion } from 'framer-motion';

interface FavoriteButtonProps {
  beamsTodayId: string;
}


const FavoriteButton: React.FC<FavoriteButtonProps> = ({ beamsTodayId}) => {
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

  const handleFavoriteToggle = async (event: React.MouseEvent) => {
    event.stopPropagation(); 
    event.preventDefault();
    // Prevent the event from propagating to parent elements
    await toggleFavorite(beamsTodayId);
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

export default FavoriteButton;
