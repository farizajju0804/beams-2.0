// src/types/beamsTheatre.ts
import {User} from './user'
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

export interface BeamsTheatreFavorite {
  id: string;
  userId: string;
  beamsTheatreId: string;
  createdAt: Date;
  user: User;
  beamsTheatre: BeamsTheatre;
}

export interface BeamsTheatreUserAnalytics {
  id: string;
  userId: string;
  totalWatchTime: number;
  totalSeriesWatchTime: Record<string, number>;  // Stores total watch time per series with series ID as the key
  individualWatchTimes: Record<string, number>;  // Stores watch times per video with video ID as the key
  user: User;
}