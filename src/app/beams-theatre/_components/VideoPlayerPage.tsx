'use client';
import React, { useState, useEffect } from 'react';
import VideoPlayer from './VideoPlayer';
import SeasonDropdown from './SeasonDropdown';
import EpisodeList from './EpisodeList';
import { BeamsTheatre } from '@/types/beamsTheatre';

const VideoPlayerPage: React.FC<{ beamsTheatre: BeamsTheatre }> = ({ beamsTheatre }) => {
  const initialSeason = beamsTheatre.episodes.length > 0 && beamsTheatre.episodes[0].season ? beamsTheatre.episodes[0].season : null;
  const initialEpisode = beamsTheatre.episodes[0]?.id;

  const [selectedSeason, setSelectedSeason] = useState<string | null>(initialSeason);
  const [selectedEpisode, setSelectedEpisode] = useState<string | null>(initialEpisode);

  useEffect(() => {
    if (beamsTheatre.episodes.length > 0) {
      setSelectedEpisode(beamsTheatre.episodes[0].id);
    }
  }, [beamsTheatre]);

  const handleSeasonChange = (seasonId: string) => {
    setSelectedSeason(seasonId);
    const firstEpisode = beamsTheatre.episodes.find(episode => episode.season === seasonId);
    setSelectedEpisode(firstEpisode?.id || null);
  };

  const handleEpisodeChange = (episodeId: string) => {

    setSelectedEpisode(episodeId);
  };

  const selectedEpisodeData = beamsTheatre.episodes.find(ep => ep.id === selectedEpisode);
 

  // Filter out null or undefined season values before creating the Set
  const seasons = Array.from(new Set(beamsTheatre.episodes.map(ep => ep.season).filter((season): season is string => !!season)));

  return (
    <div className="w-full mx-auto justify-center pl-4 flex flex-col items-center gap-4 ">
      <VideoPlayer url={selectedEpisodeData?.url || ''} />
      <div className="metadata text-left w-full ">
        <h1 className="text-xl lg:text-2xl font-bold font-display">{beamsTheatre.title}</h1>
        <p className="text-sm lg:text-lg">{beamsTheatre.description}</p>
      </div>
      {seasons.length > 0 && (
        <SeasonDropdown
          seasons={seasons}
          selectedSeason={selectedSeason}
          onSeasonChange={handleSeasonChange}
        />
      )}
      {beamsTheatre.episodes.length > 1 && (
        <EpisodeList
          episodes={selectedSeason ? beamsTheatre.episodes.filter(ep => ep.season === selectedSeason) : beamsTheatre.episodes}
          selectedEpisode={selectedEpisode}
          onEpisodeChange={handleEpisodeChange}
        />
      )}
    </div>
  );
};

export default VideoPlayerPage;
