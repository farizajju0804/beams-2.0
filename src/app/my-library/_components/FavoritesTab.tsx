'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardBody, CardFooter, Button } from "@nextui-org/react";
import { Trash, Heart, Microscope } from 'iconsax-react';
import Image from 'next/image';
import { removeFavorite } from '@/actions/beams-today/removeFavorite';
import { toast, Toaster } from 'react-hot-toast';

interface FavoritesTabProps {
  favorites: any[]; // Array of user's favorite topics
}

export default function FavoritesTab({ favorites }: FavoritesTabProps) {
  const router = useRouter();

  const handleRemove = async (e: React.MouseEvent<HTMLButtonElement>, favoriteId: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await removeFavorite(favoriteId);
      toast.success('Removed from favorites');
      router.refresh();
    } catch (error) {
      toast.error('Failed to remove from favorites');
    }
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>, favoriteId: string) => {
    e.preventDefault();
    router.push(`/beams-today/${favoriteId}`);
  };

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col mt-4 items-center justtify-center md:justify-start md:min-h-[60vh] text-center">
        <div className="w-40 h-40 mb-8">
          <Image
            src="https://res.cloudinary.com/drlyyxqh9/image/upload/v1729244535/achievements/favorite_uvrlan.webp"
            alt="No favorites"
            width={300}
            height={300}
            className="object-contain"
          />
        </div>
        <h2 className="text-lg md:text-2xl font-bold mb-2">Your Favorites Are Feeling Lonely</h2> 
        <p className="text-xs md:text-base mb-6"> Show some love! Tap the heart on topics that spark joy. </p>
        <Button
          color="primary"
          className='text-white font-semibold'
          startContent={<Microscope variant='Bold'  />}
          onClick={() => router.push('/beams-today')}
        >
          Explore Beams Today
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-4 min-h-[80vh] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {favorites.map((favorite) => (
        <div key={favorite.id} className="cursor-pointer" onClick={(e) => handleCardClick(e, favorite.beamsTodayId)}>
          <Card className="max-w-xs">
            <CardHeader>
              <p className="text-lg font-bold">{favorite.beamsToday.title}</p>
            </CardHeader>
            <CardBody>
              <Image
                priority
                width={500}
                height={500}
                src={favorite.beamsToday.thumbnailUrl}
                alt={favorite.beamsToday.title}
                className="w-full h-40 object-cover aspect-video rounded-md"
              />
            </CardBody>
            <CardFooter>
              <Button
                color="danger"
                startContent={<Trash className="w-4 h-4" />}
                onClick={(e) => handleRemove(e, favorite.id)}
              >
                Remove from Favorites
              </Button>
            </CardFooter>
          </Card>
        </div>
      ))}
    </div>
  );
}