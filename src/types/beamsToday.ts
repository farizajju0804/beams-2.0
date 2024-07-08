// export interface TranscriptItem {
//     time: number;
//     type: "title" | "subtitle" | "paragraph" | "quote" | "italic";
//     text: string;
//   }
  
export interface BeamsToday {
  id: string;
  date: Date;
  title: string;
  shortDesc: string;
  videoUrl?: string;
  thumbnailUrl: string;
  articleUrl?: string;
  audioUrl?: string;
  categoryId: string;
  viewCount: number;
  totalWatchTime: number;
  transcript?: any;
  // transcript?: any; // Replace 'any' with appropriate type if available
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
    