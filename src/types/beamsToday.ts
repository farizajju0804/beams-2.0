import {User} from '@/types/user'

// export interface BeamsToday {
//   id: string;
//   date: Date;
//   title: string;
//   shortDesc: string;
//   viewCount: number;
//   totalWatchTime: number;
//   transcript?: any; // Allow null
//   videoViewCount: number;
//   audioViewCount: number;
//   textViewCount: number;
//   totalVideoWatchTime: number;
//   totalAudioListenTime: number;
//   totalTextSpentTime: number;
//   videoUrl?: string;
//   thumbnailUrl?: string;
//   articleUrl?: string;
//   audioUrl?: string;
//   categoryId: string;
//   category: {
//     id: string;
//     name: string;
//   };
//   poll?: any;
//   exclusiveContents?: any[];
//   downloadableResources?: any[];
//   userNotes?: any[];
//   favourites?: any[];
// }
// Interface for BeamsToday
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
  transcript?: Record<string, any>; // Use appropriate type if you know the structure
  videoUrl?: string;
  thumbnailUrl?: string;
  articleUrl?: string;
  audioUrl?: string;
  categoryId: string;
  category: BeamsTodayCategory;
  poll?: BeamsTodayPoll;
  exclusiveContents: BeamsTodayExclusiveContent[];
  downloadableResources: BeamsTodayDownloadableResource[];
  userNotes: BeamsTodayUserNote[];
  favourites: BeamsTodayFavorite[];
}


export interface BeamsTodayCreateInput {
  date: string;
  title: string;
  shortDesc: string;
  videoUrl?: string;
  thumbnailUrl: string;
  articleUrl?: string;
  audioUrl?: string;
  categoryId: string;
}

export interface BeamsTodayUpdateInput {
  id: string;
  date?: string;
  title?: string;
  shortDesc?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  articleUrl?: string;
  audioUrl?: string;
  categoryId?: string;
}
    


// Interface for BeamsTodayWatchedContent
export interface BeamsTodayWatchedContent {
  id: string;
  userId: string;
  completedBeamsToday: string[];
  completedFormats: Record<string, any>; // Use appropriate type if you know the structure
  updatedAt: Date;
}

// Interface for BeamsTodayCategory
export interface BeamsTodayCategory {
  id: string;
  name: string;
  beamsTodayContent: BeamsToday[];
}

// Interface for BeamsTodayPoll
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

// Interface for BeamsTodayPollOption
export interface BeamsTodayPollOption {
  id: string;
  optionText: string;
  pollId: string;
  poll: BeamsTodayPoll;
  userResponses: BeamsTodayPollResponse[];
  votes: number;
}

// Interface for BeamsTodayPollResponse
export interface BeamsTodayPollResponse {
  id: string;
  userId: string;
  pollOptionId: string;
  pollOption: BeamsTodayPollOption;
  createdAt: Date;
}

// Interface for BeamsTodayExclusiveContent
export interface BeamsTodayExclusiveContent {
  id: string;
  title: string;
  contentUrl: string;
  format: string;
  date: Date;
  beamsTodayId: string;
  beamsToday: BeamsToday;
}

// Interface for BeamsTodayDownloadableResource
export interface BeamsTodayDownloadableResource {
  id: string;
  title: string;
  resourceUrl: string;
  format: string;
  date: Date;
  beamsTodayId: string;
  beamsToday: BeamsToday;
}

// Interface for BeamsTodayUserNote
export interface BeamsTodayUserNote {
  id: string;
  userId: string;
  user: User;
  note: string;
  date: Date;
  beamsTodayId: string;
  beamsToday: BeamsToday;
}

// Interface for BeamsTodayFavorite
export interface BeamsTodayFavorite {
  id: string;
  userId: string;
  beamsTodayId: string;
  createdAt: Date;
  user: User;
  beamsToday: BeamsToday;
}

// Interface for BeamsTodayUserAnalytics
export interface BeamsTodayUserAnalytics {
  id: string;
  userId: string;
  totalWatchTimeBeamsToday: number;
  totalVideoWatchTime: number; // New field
  totalAudioListenTime: number; // New field
  totalTextSpentTime: number; // New field
  individualWatchTimesVideo?: Record<string, any>; // New field, use appropriate type if known
  individualWatchTimesAudio?: Record<string, any>; // New field, use appropriate type if known
  individualWatchTimesText?: Record<string, any>; // New field, use appropriate type if known
  user: User;
}