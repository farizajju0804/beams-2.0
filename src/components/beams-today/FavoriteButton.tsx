'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@nextui-org/react';
import { Heart } from 'iconsax-react'; // Assuming you are using iconsax-react
import { toggleFavorite, isFavoriteBeamsToday } from '@/actions/beams-today/favoriteActions';

interface FavoriteButtonProps {
  beamsTodayId: string;
  size : "sm" | "md" | "lg" | undefined
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ beamsTodayId,size }) => {
  const [isFavorite, setIsFavorite] = useState(false);

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
    setIsFavorite((prev) => !prev);
  };

  return (
    <Button size={size} isIconOnly className={isFavorite ? 'bg-red-600' : 'bg-white' } aria-label="Like" onClick={handleFavoriteToggle}>
      <Heart size={size ==='sm' ? 16 : 24} color={isFavorite ? "white" : "black"} variant={isFavorite ? "Bold" : "Linear"} />
    </Button>
  );
};

export default FavoriteButton;



