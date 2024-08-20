'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@nextui-org/react';
import { Heart } from 'iconsax-react'; // Assuming you are using iconsax-react
import { toggleFavorite, isFavoriteBeamsToday } from '@/actions/beams-today/favoriteActions';
import { motion } from 'framer-motion';

interface FavoriteButtonProps {
  beamsTodayId: string;
}


const FavoriteButton: React.FC<FavoriteButtonProps> = ({ beamsTodayId }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkFavorite = async () => {
      const favorite = await isFavoriteBeamsToday(beamsTodayId);
      if (isMounted) {
        setIsFavorite(favorite);
      }
    };

    checkFavorite();

    return () => {
      isMounted = false; // Clean up to prevent setting state after unmount
    };
  }, [beamsTodayId]);

  const handleFavoriteToggle = async (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    await toggleFavorite(beamsTodayId);
    setIsAnimating(true);
    setIsFavorite((prev) => !prev);
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  return (
    <Button size={"sm"} isIconOnly className={isFavorite ? 'bg-red-600' : 'bg-grey-1'} aria-label="Like" onClick={handleFavoriteToggle}>
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: isAnimating ? 1.4 : 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Heart size={20} className={isFavorite ? "text-white" : "text-text"} variant={isFavorite ? "Bold" : "Linear"} />
      </motion.div>
    </Button>
  );
};


export default FavoriteButton;
