'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardBody, CardFooter, Button } from "@nextui-org/react";
import { Trash } from 'iconsax-react';
import Image from 'next/image';
import { removeFavorite } from '@/actions/beams-today/removeFavorite';
import { toast, Toaster } from 'react-hot-toast';

interface FavoritesTabProps {
  favorites: any[]; // Array of user's favorite topics
}

/**
 * FavoritesTab component displays a list of user's favorite Beams Today topics.
 * Each favorite can be removed, and users can click on the card to navigate to the topic details.
 */
const FavoritesTab: React.FC<FavoritesTabProps> = ({ favorites }) => {
  const router = useRouter();

  // Handle removing a favorite topic
  const handleRemove = async (e: React.MouseEvent<HTMLButtonElement>, favoriteId: string) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event propagation
    try {
      await removeFavorite(favoriteId); // Call the API to remove the favorite
      toast.success('Removed from favorites');
      router.refresh(); // Refresh the page after removing the favorite
    } catch (error) {
      toast.error('Failed to remove from favorites');
    }
  };

  // Handle clicking on a favorite card to navigate to the topic page
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>, favoriteId: string) => {
    e.preventDefault();
    router.push(`/beams-today/${favoriteId}`); // Navigate to the topic detail page
  };

  return (
    <>

      <div className="mt-4 min-h-[50vh] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.length === 0 ? (
          <p className="col-span-full">No favorites found.</p> // Display message if no favorites
        ) : (
          favorites.map((favorite) => (
            <div key={favorite.id} className="cursor-pointer" onClick={(e) => handleCardClick(e, favorite.beamsTodayId)}>
              <Card>
                <CardHeader>
                  <p className="text-lg font-bold">{favorite.beamsToday.title}</p>
                </CardHeader>
                <CardBody>
                  <Image
                    priority
                    width={200}
                    height={150}
                    src={favorite.beamsToday.thumbnailUrl}
                    alt={favorite.beamsToday.title}
                    className="w-full object-cover aspect-video rounded-md"
                  />
                </CardBody>
                <CardFooter>
                  <Button
                    color="danger"
                    startContent={<Trash size="20" />}
                    onClick={(e) => handleRemove(e, favorite.id)} // Trigger remove action
                  >
                    Remove from Favorites
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default FavoritesTab;
