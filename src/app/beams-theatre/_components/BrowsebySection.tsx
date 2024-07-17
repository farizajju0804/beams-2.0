import React from 'react';
import { SectionTitle } from './SectionTitle';
import BeamsTheatreListSection from './BeamsTheatreListSection';
import { getDefaultBeamsTheatre, getGenres } from '@/actions/beams-theatre/getDefaultBeamsTheatre';

const BrowsebySection = async () => {
  const defaultTheatre = await getDefaultBeamsTheatre();
  const genres = await getGenres();

  return (
    <div className="my-8 flex items-center flex-col justify-center max-w-5xl w-[90%]  gap-8 relative mx-2 lg:mx-4 border-2 border-gray-100 px-6 py-4 pb-8 rounded-3xl">
      <div className="flex items-center w-full">
        <SectionTitle text="Browse By" />
      </div>
      <BeamsTheatreListSection initialData={defaultTheatre} genres={genres} />
    </div>
  );
};

export default BrowsebySection;
