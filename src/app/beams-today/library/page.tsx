import React from 'react';
import { getUserNotes } from '@/actions/beams-today/getUserNotes';
import { getUserFavorites } from '@/actions/beams-today/getUserFavorites';
import LibraryTabs from '@/app/beams-today/_components/libraryTabs';
import { Toaster } from 'react-hot-toast';

const MyLibraryPage = async () => {
  const notes = await getUserNotes();
  const favorites = await getUserFavorites();

  return (
    <div className="max-w-5xl mx-auto p-4">
      <Toaster position="top-center" />
      <h1 className="text-3xl font-bold mb-4">My Library</h1>
      <LibraryTabs notes={notes} favorites={favorites} />
    </div>
  );
};

export default MyLibraryPage;
