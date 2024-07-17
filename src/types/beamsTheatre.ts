import {User} from '@/types/user'

export enum BeamsTheatreViewType {
    NOW_SHOWING = 'NOW_SHOWING',
    TRENDING = 'TRENDING',
    DEFAULT = 'DEFAULT',
    OTHER = 'OTHER'
  }

  export interface BeamsTheatre {
    id: string;
    title: string;
    description: string;
    posterUrl: string;
    genreId: string;
    genre: BeamsTheatreGenre;
    videos: BeamsTheatreVideo[];
    viewType: BeamsTheatreViewType;
    createdAt: Date;
    updatedAt: Date;
    totalWatchTime: number;
    favorites: BeamsTheatreFavorite[];
  }
  
  // Interface for BeamsTheatreGenre
  export interface BeamsTheatreGenre {
    id: string;
    name: string;
    beamsTheatre: BeamsTheatre[];
  }
  
  // Interface for BeamsTheatreVideo
  export interface BeamsTheatreVideo {
    id: string;
    title: string;
    description: string;
    url: string;
    thumbnailUrl: string;
    durationInSeconds: number;
    beamsTheatreId: string;
    beamsTheatre: BeamsTheatre;
    createdAt: Date;
    updatedAt: Date;
    viewCount: number;
    totalWatchTime: number;
  }
  
  // Interface for BeamsTheatreUserAnalytics
  export interface BeamsTheatreUserAnalytics {
    id: string;
    userId: string;
    totalWatchTime: number;
    totalSeriesWatchTime: Record<string, number>; // Stores total watch time per series
    individualWatchTimes: Record<string, number>; // Stores watch times per video
    user: User;
  }
  
  // Interface for BeamsTheatreFavorite
  export interface BeamsTheatreFavorite {
    id: string;
    userId: string;
    beamsTheatreId: string;
    createdAt: Date;
    user: User;
    beamsTheatre: BeamsTheatre;
  }