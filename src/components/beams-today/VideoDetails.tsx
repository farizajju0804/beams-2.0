import ShareButton from '@/components/beams-today/ShareButton';
import FormattedDate from '@/components/beams-today/FormattedDate';

const VideoDetails = ({ video }:any) => {
  return (
    <div className="my-8 p-4 bg-gray-100 rounded-lg">
      <h1 className="text-3xl font-bold my-2">{video?.title}</h1>
      <p className="text-lg text-gray-800">{video?.shortDesc}</p>
      <div className="flex justify-between items-center w-full mt-4">
        <p className="text-gray-700">
          Date: {video?.date ? <FormattedDate date={video.date.toISOString().split('T')[0]} /> : 'Unknown date'}
        </p>
        <ShareButton video={video} />
      </div>
    </div>
  );
};

export default VideoDetails;
