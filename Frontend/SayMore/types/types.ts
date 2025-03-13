export interface Lesson {
  title: string;
  icon: any;
  documentId: string;
}

export interface WatchedVideo {
  id: string;
  videoId: string;
  title: string;
  lessonTitle: string;
  timestamp: string;
  thumbnail: string;
  summary?: string;
  summaryImage?: string;
}

export interface VideoItem {
  videoId: string;
  title: string;
  thumbnail?: string;
  summary?: string;
  summaryImage?: string;
}
