import {BeamsTheatreFavorite,BeamsTheatreUserAnalytics}  from '@/types/beamsTheatre'
import { BeamsTodayFavorite, BeamsTodayUserAnalytics, BeamsTodayUserNote } from './beamsToday';
import { PointsSource } from '@prisma/client';

export interface User {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    emailVerified?: Date;
    image?: string;
    password?: string;
    securityQuestion1?: string;
    securityAnswer1?: string;
    securityQuestion2?: string;
    securityAnswer2?: string;
    accounts: Account[];
    role: UserRole;
    isTwoFactorEnabled: boolean;
    twoFactorConfirmation?: TwoFactorConfirmation;
    createdAt: Date;
    updatedAt: Date;
    notes: BeamsTodayUserNote[];
    beamsTodayFavorites: BeamsTodayFavorite[];
    beamPoints: UserBeamPoints[];
    beamsTodayUserAnalytics: BeamsTodayUserAnalytics[];
    beamsTheatreFavorites: BeamsTheatreFavorite[];
    beamsTheatreUserAnalytics: BeamsTheatreUserAnalytics[];
  }

  export interface Account {
    id: string;
    userId: string;
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token?: string;
    access_token?: string;
    expires_at?: number;
    token_type?: string;
    scope?: string;
    id_token?: string;
    session_state?: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
  }


  export interface TwoFactorConfirmation {
    id: string;
    userId: string;
    user: User;
  }

  export interface TwoFactorToken {
    id: string;
    email: string;
    token: string;
    expires: Date;
  }

  export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER'
  }
  



  export interface UserBeamPoints {
    id: string;
    userId: string;
    points: number;
    source: PointsSource;
    createdAt: Date;
    updatedAt: Date;
    user: User;
  }