import { User } from '@/types/user';

export enum BeamsTheatreViewType {
  NOW_SHOWING = 'NOW_SHOWING',
  TRENDING = 'TRENDING',
  DEFAULT = 'DEFAULT',
  OTHER = 'OTHER'
}

export enum BeamsTheatreStructure {
  SINGLE_VIDEO = 'SINGLE_VIDEO',
  SERIES_WITH_SEASONS = 'SERIES_WITH_SEASONS',
  SERIES_WITHOUT_SEASONS = 'SERIES_WITHOUT_SEASONS'
}

export interface BeamsTheatreGenre {
  id: string;
  name: string;
  beamsTheatre: BeamsTheatre[];
}

export interface BeamsTheatreFavorite {
  id: string;
  userId: string;
  beamsTheatreId: string;
  createdAt: Date;
  user: User;
  beamsTheatre: BeamsTheatre;
}

export interface BeamsTheatreSeason {
  id: string;
  title: string;
  beamsTheatreId: string;
  episodes: BeamsTheatreEpisode[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BeamsTheatreEpisode {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  durationInSeconds: number;
  beamsTheatreId: string;
  seasonId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BeamsTheatreEpisodeCreateInput {
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  durationInSeconds: number;
  beamsTheatreId: string;
  seasonId?: string;
}

export interface BeamsTheatreEpisodeUpdateInput {
  title?: string;
  description?: string;
  url?: string;
  thumbnailUrl?: string;
  durationInSeconds?: number;
  beamsTheatreId?: string;
  seasonId?: string;
}

export interface BeamsTheatreSeasonUpdateInput {
  id: string;
  title?: string;
  beamsTheatreId?: string;
}

export interface BeamsTheatreCreateInput {
  title: string;
  description: string;
  posterUrl: string;
  genreId: string;
  viewType: BeamsTheatreViewType;
  structure: BeamsTheatreStructure;
}

export interface BeamsTheatreUpdateInput {
  id: string;
  title?: string;
  description?: string;
  posterUrl?: string;
  genreId?: string;
  viewType?: BeamsTheatreViewType;
  structure?: BeamsTheatreStructure;
  seasons?: BeamsTheatreSeasonUpdateInput[];
  episodes?: BeamsTheatreEpisodeUpdateInput[];
}

export interface BeamsTheatre {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  genreId: string;
  genre: BeamsTheatreGenre;
  viewType: BeamsTheatreViewType;
  structure: BeamsTheatreStructure;
  createdAt: Date;
  updatedAt: Date;
  totalViews?: number;
  totalWatchTime?: number;
  favorites: BeamsTheatreFavorite[];
  seasons: BeamsTheatreSeason[];
  episodes: BeamsTheatreEpisode[];
}


export interface BeamsTheatreUserAnalytics {
  id: string;
  userId: string;
  totalWatchTime: number;
  totalTopicWatchTime: Record<string, any>; 
  individualWatchTimes?: Record<string, any>; 
  user: User;
}

