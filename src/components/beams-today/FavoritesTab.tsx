'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardBody, CardFooter, Button } from "@nextui-org/react";
import { Trash } from 'iconsax-react';
import Image from 'next/image';
import { removeFavorite } from '@/actions/beams-today/removeFavorite';
import { toast, Toaster } from 'react-hot-toast';

interface FavoritesTabProps {
  favorites: any[];
}

const FavoritesTab: React.FC<FavoritesTabProps> = ({ favorites }) => {
  const router = useRouter();

  const handleRemove = async (e: React.MouseEvent<HTMLButtonElement>, favoriteId: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await removeFavorite(favoriteId);
      toast.success('Removed from favorites');
      router.refresh(); // Optionally, refresh the page or remove the favorite from the state
    } catch (error) {
      toast.error('Failed to remove from favorites');
    }
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>, favoriteId: string) => {
    e.preventDefault();
    router.push(`/beams-today/${favoriteId}`);
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.length === 0 ? (
          <p className="col-span-full">No favorites found.</p>
        ) : (
          favorites.map((favorite) => (
            <Card key={favorite.id} className="cursor-pointer" onClick={(e) => handleCardClick(e, favorite.beamsTodayId)}>
              <CardHeader>
                <p className="text-lg font-bold">{favorite.beamsToday.title}</p>
              </CardHeader>
              <CardBody>
                <Image width={200} height={150} src={favorite.beamsToday.thumbnailUrl} alt={favorite.beamsToday.title} className="w-full object-cover aspect-video rounded-md" />
              </CardBody>
              <CardFooter>
                <Button
                  color="danger"
                  startContent={<Trash size="20" />}
                  onClick={(e) => handleRemove(e, favorite.id)}
                >
                  Remove from Favorites
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </>
  );
};

export default FavoritesTab;
