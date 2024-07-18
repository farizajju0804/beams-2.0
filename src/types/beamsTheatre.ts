// src/types/beamsTheatre.ts
export enum BeamsTheatreViewType {
  NOW_SHOWING = 'NOW_SHOWING',
  TRENDING = 'TRENDING',
  DEFAULT = 'DEFAULT',
  OTHER = 'OTHER'
}

export interface BeamsTheatreGenre {
  id: string;
  name: string;
}

export interface BeamsTheatreEpisode {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  totalViews: number;
  totalWatchTime: number;
  durationInSeconds: number;
  beamsTheatreId: string;
  season?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BeamsTheatre {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  genre: BeamsTheatreGenre;
  viewType: BeamsTheatreViewType;
  createdAt: Date;
  updatedAt: Date;
  totalViews: number;
  totalWatchTime: number;
  episodes: BeamsTheatreEpisode[];
}

export interface BeamsTheatreWithTotalTime extends BeamsTheatre {
  totalTime: number;
}
