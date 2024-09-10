import { User } from '@/types/user'

export interface BeamsToday {
  id: string;
  date: Date;
  title: string;
  shortDesc: string;
  viewCount: number;
  totalWatchTime: number;
  videoViewCount: number;
  audioViewCount: number;
  textViewCount: number;
  totalVideoWatchTime: number;
  totalAudioListenTime: number;
  totalTextSpentTime: number;
  transcript?: Record<string, any>;
  videoUrl?: string;
  script?: string;
  thumbnailUrl?: string;
  articleUrl?: string;
  audioUrl?: string;
  published: boolean;
  categoryId: string;
  category: BeamsTodayCategory;
  poll?: BeamsTodayPoll;
  exclusiveContents: BeamsTodayExclusiveContent[];
  downloadableResources: BeamsTodayDownloadableResource[];
  userNotes: BeamsTodayUserNote[];
  favourites: BeamsTodayFavorite[];
}

export interface BeamsTodayPollOptionInput {
  id?: string;
  optionText: string;
}

export interface BeamsTodayPollInput {
  title: string;
  description: string;
  question: string;
  options: BeamsTodayPollOptionInput[];
}

export interface BeamsTodayCreateInput {
  date: string;
  title: string;
  shortDesc: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  script?: string;
  articleUrl?: string;
  audioUrl?: string;
  categoryId: string;
  poll: BeamsTodayPollInput;
}

export interface BeamsTodayUpdateInput {
  id: string;
  date?: string;
  title?: string;
  shortDesc?: string;
  videoUrl?: string;
  script?: string;
  thumbnailUrl?: string;
  articleUrl?: string;
  audioUrl?: string;
  categoryId?: string;
  poll: BeamsTodayPollInput;
}

export interface BeamsTodayCategory {
  id: string;
  name: string;
  beamsTodayContent: BeamsToday[];
}

export interface BeamsTodayPoll {
  id: string;
  title: string;
  description: string;
  question: string;
  createdAt: Date;
  beamsTodayId: string;
  beamsToday: BeamsToday;
  options: BeamsTodayPollOption[];
}

export interface BeamsTodayPollOption {
  id: string;
  optionText: string;
  pollId: string;
  poll: BeamsTodayPoll;
  userResponses: BeamsTodayPollResponse[];
  votes: number;
}

export interface BeamsTodayPollResponse {
  id: string;
  userId: string;
  pollOptionId: string;
  pollOption: BeamsTodayPollOption;
  createdAt: Date;
}

export interface BeamsTodayExclusiveContent {
  id: string;
  title: string;
  contentUrl: string;
  format: string;
  date: Date;
  beamsTodayId: string;
  beamsToday: BeamsToday;
}

export interface BeamsTodayDownloadableResource {
  id: string;
  title: string;
  resourceUrl: string;
  format: string;
  date: Date;
  beamsTodayId: string;
  beamsToday: BeamsToday;
}

export interface BeamsTodayUserNote {
  id: string;
  userId: string;
  user: User;
  note: string;
  date: Date;
  beamsTodayId: string;
  beamsToday: BeamsToday;
}

export interface BeamsTodayFavorite {
  id: string;
  userId: string;
  beamsTodayId: string;
  createdAt: Date;
  user: User;
  beamsToday: BeamsToday;
}

export interface BeamsTodayUserAnalytics {
  id: string;
  userId: string;
  totalWatchTimeBeamsToday: number;
  totalVideoWatchTime: number;
  totalAudioListenTime: number;
  totalTextSpentTime: number;
  individualWatchTimesVideo?: Record<string, any>;
  individualWatchTimesAudio?: Record<string, any>;
  individualWatchTimesText?: Record<string, any>;
  user: User;
}