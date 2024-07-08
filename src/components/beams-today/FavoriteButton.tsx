'use client'
import React, { useState, useEffect } from 'react';
import { Button } from '@nextui-org/react';
import { Heart } from 'iconsax-react'; // Assuming you are using iconsax-react
import { toggleFavorite, isFavoriteBeamsToday } from '@/actions/beams-today/favoriteActions';

interface FavoriteButtonProps {
  beamsTodayId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ beamsTodayId }) => {
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
    <Button isIconOnly color="danger" aria-label="Like" onClick={handleFavoriteToggle}>
      <Heart size={24} color="white" variant={isFavorite ? "Bold" : "Linear"} />
    </Button>
  );
};

export default FavoriteButton;



