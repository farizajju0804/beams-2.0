import React from 'react';
import ShareButton from '@/components/beams-today/ShareButton';
import FormattedDate from '@/components/beams-today/FormattedDate';
import NoteModal from '@/components/beams-today/NoteModal';
import FavoriteButton from '@/components/beams-today/FavoriteButton'; // Import the new component
import { BeamsToday } from '@/types/beamsToday';

interface VideoDetailsProps {
  video: BeamsToday;
}

const VideoDetails: React.FC<VideoDetailsProps> = ({ video }) => {
  return (
    <div className="my-8 p-4 bg-gray-100 rounded-lg">
      <h1 className="text-3xl font-bold my-2">{video?.title}</h1>
      <p className="text-lg text-gray-800">{video?.shortDesc}</p>
      <div className="flex justify-between items-center w-full mt-4">
        <p className="text-gray-700">
          Date: {video?.date ? <FormattedDate date={video.date.toISOString().split('T')[0]} /> : 'Unknown date'}
        </p>
        <div className="flex items-center gap-4">
          <FavoriteButton beamsTodayId={video.id} /> {/* Include the favorite button */}
          <NoteModal videoId={video.id} videoTitle={video.title} />
          <ShareButton video={video} />
        </div>
      </div>
    </div>
  );
};

export default VideoDetails;
