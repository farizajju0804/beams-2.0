import React from 'react';
import { SectionTitle } from './SectionTitle';
import BeamsTheatreListSection from './BeamsTheatreListSection';
import { getDefaultBeamsTheatre, getGenres } from '@/actions/beams-theatre/getDefaultBeamsTheatre';
import TicketTitle from './TicketTitle';
import Divider from './Divider';

const BrowsebySection = async () => {
  const defaultTheatre = await getDefaultBeamsTheatre();
  const genres = await getGenres();

  return (
    <div className="my-2 flex items-center flex-col justify-center max-w-5xl w-[90%]  gap-10 relative mx-2 lg:mx-4 border-2 border-gray-100 px-6 py-4 pb-8 rounded-3xl">
      <div className="flex items-center justify-center w-full">
        <TicketTitle title="Popular" />
      </div>
      <BeamsTheatreListSection initialData={defaultTheatre} genres={genres} />
      <Divider/>
    </div>
  );
};

export default BrowsebySection;
