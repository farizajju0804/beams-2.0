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
    <div className="my-8 p-4 bg-gray-100 rounded-lg">
      <h1 className="text-3xl font-bold my-2">{data?.title}</h1>
      <p className="text-lg text-gray-800">{data?.shortDesc}</p>
      <div className="flex justify-between items-start gap-8 lg:items-center flex-col lg:flex-row w-full mt-4">
        <p className="text-gray-700">
          Date: {data?.date ? <FormattedDate date={data.date.toISOString().split('T')[0]} /> : 'Unknown date'}
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
