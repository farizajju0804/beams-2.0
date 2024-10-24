import React from 'react';
import { getUserNotes } from '@/actions/beams-today/getUserNotes';
import { getUserFavorites } from '@/actions/beams-today/getUserFavorites';
import LibraryTabs from '@/app/my-library/_components/libraryTabs';
import { Toaster } from 'react-hot-toast';

const MyLibraryPage = async () => {
  // Fetch the user's notes and favorite topics
  const notes = await getUserNotes();
  const favorites = await getUserFavorites();

  return (
    <div className="w-full mx-auto py-2 px-6">
      {/* Toast notifications */}
      <Toaster position="top-center" />

      {/* Page Title */}
      <h1 className="text-xl md:text-3xl font-bold mb-4">My Library</h1>
      
      {/* Tabs to switch between Notes and Favorites */}
      <LibraryTabs notes={notes} favorites={favorites} />
    </div>
  );
};

export default MyLibraryPage;
