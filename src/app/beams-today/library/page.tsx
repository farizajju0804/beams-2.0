import React from 'react';
import { getUserNotes } from '@/actions/beams-today/getUserNotes';
import { getUserFavorites } from '@/actions/beams-today/getUserFavorites';
import LibraryTabs from '@/components/beams-today/libraryTabs';

const MyLibraryPage = async () => {
  const notes = await getUserNotes();
  const favorites = await getUserFavorites();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">My Library</h1>
      <LibraryTabs notes={notes} favorites={favorites} />
    </div>
  );
};

export default MyLibraryPage;
