import React from 'react';
import ShareButton from '@/app/beams-today/_components/ShareButton';
import FormattedDate from '@/app/beams-today/_components/FormattedDate';
import NoteModal from './NoteModal';
import FavoriteButton from '@/app/beams-today/_components/FavoriteButton'; // Import the new component
import { BeamsToday } from '@/types/beamsToday';

interface BeamsTodayDetailsProps {
  data: BeamsToday;
}


const BeamsTodayDetails: React.FC<BeamsTodayDetailsProps> = ({ data }) => {
  return (
    <div className="px-4 mt-2 rounded-3xl mb-10 lg:mb-20">
      <h1 className="text-2xl md:text-3xl font-bold my-2">{data?.title}</h1>
      <p className="text-sm md:text-lg font-normal text-grey-2">{data?.shortDesc}</p>
      <div className="flex justify-between items-start gap-4 lg:items-center flex-col lg:flex-row w-full mt-2">
        <p className="text-grey-2 text-xs lg:text-base">
          {data?.date ? <FormattedDate date={data.date.toISOString().split('T')[0]} /> : 'Unknown date'}
        </p>
        <div className="flex items-center gap-4">
          <FavoriteButton  beamsTodayId={data.id} /> {/* Include the favorite button */}
          <NoteModal id={data.id} title={data.title} />
          <ShareButton data={data} />
        </div>
      </div>
    </div>
  );
};

export default BeamsTodayDetails;
