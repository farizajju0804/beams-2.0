import React from 'react';
import { Card, CardHeader, CardBody, Image } from '@nextui-org/react';
import { BeamsTheatreEpisode } from '@/types/beamsTheatre';

interface EpisodeListProps {
  episodes: BeamsTheatreEpisode[];
  selectedEpisode: string | null;
  onEpisodeChange: (episodeId: string) => void;
}

const EpisodeList: React.FC<EpisodeListProps> = ({ episodes, selectedEpisode, onEpisodeChange }) => {
  return (
    <div className="w-full flex flex-col gap-4">
      {episodes.map((episode) => (
        <Card
          key={episode.id}
          isPressable
          onClick={() => onEpisodeChange(episode.id)}
          className={`border-none flex flex-row lg:flex-col shadow-none cursor-pointer w-full h-full ${selectedEpisode === episode.id ? 'bg-brand-100' : ''}`}
        >
          <CardHeader className="flex lg:flex-row flex-col items-start">
            <Image src={episode.thumbnailUrl} alt={episode.title} className="hidden mr-6 lg:block w-40 h-full object-cover" />
            <div  className='flex flex-col my-auto justify-center'>
              <h2 className="text-left text-base lg:text-lg font-semibold">{episode.title}</h2>
              <p className="text-left text-xs lg:text-sm">{episode.description}</p>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default EpisodeList;
