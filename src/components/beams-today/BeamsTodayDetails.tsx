import React from 'react';
import ShareButton from '@/components/beams-today/ShareButton';
import FormattedDate from '@/components/beams-today/FormattedDate';
import NoteModal from '@/components/beams-today/NoteModal';
import FavoriteButton from '@/components/beams-today/FavoriteButton'; // Import the new component
import { BeamsToday } from '@/types/beamsToday';

interface BeamsTodayDetailsProps {
  data: BeamsToday;
}

const BeamsTodayDetails: React.FC<BeamsTodayDetailsProps> = ({ data }) => {
  return (
    <div className="mb-8 -mt-4 p-4 bg-brand-100 rounded-3xl">
      <h1 className="text-2xl md:text-3xl font-bold my-2">{data?.title}</h1>
      <p className="text-base md:text-lg text-gray-800">{data?.shortDesc}</p>
      <div className="flex justify-between items-start gap-8 lg:items-center flex-col lg:flex-row w-full mt-4">
        <p className="text-gray-700">
          {data?.date ? <FormattedDate date={data.date.toISOString().split('T')[0]} /> : 'Unknown date'}
        </p>
        <div className="flex items-center gap-4">
          <FavoriteButton size='md' beamsTodayId={data.id} /> {/* Include the favorite button */}
          <NoteModal id={data.id} title={data.title} />
          <ShareButton data={data} />
        </div>
      </div>
    </div>
  );
};

export default BeamsTodayDetails;
