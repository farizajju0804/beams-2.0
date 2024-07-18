import React from 'react';
import { BeamsTheatreEpisode } from '@/types/beamsTheatre';

interface EpisodeListProps {
  episodes: BeamsTheatreEpisode[];
  selectedEpisode: string | null;
  onEpisodeChange: (episodeId: string) => void;
}

const EpisodeList: React.FC<EpisodeListProps> = ({ episodes, selectedEpisode, onEpisodeChange }) => {
  return (
    <div className="episode-list w-full max-w-4xl">
      {episodes.map((episode) => (
        <div
          key={episode.id}
          onClick={() => {
       
            onEpisodeChange(episode.id);
          }}
          className={`episode-item p-2 cursor-pointer ${selectedEpisode === episode.id ? 'bg-gray-300' : ''}`}
        >
          <h2 className="text-lg font-semibold">{episode.title}</h2>
          <p className="text-sm">{episode.description}</p>
        </div>
      ))}
    </div>
  );
};

export default EpisodeList;
