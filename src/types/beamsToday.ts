// export interface TranscriptItem {
//     time: number;
//     type: "title" | "subtitle" | "paragraph" | "quote" | "italic";
//     text: string;
//   }
// src/types/beamsToday.ts
export interface BeamsToday {
  id: string;
  date: Date;
  title: string;
  shortDesc: string;
  viewCount: number;
  totalWatchTime: number;
  transcript?: Record<string, any>;
  videoUrl?: string;
  thumbnailUrl?: string;
  articleUrl?: string;
  audioUrl?: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
  poll?: any;
  exclusiveContents?: any[];
  downloadableResources?: any[];
  userNotes?: any[];
  favourites?: any[];
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
    