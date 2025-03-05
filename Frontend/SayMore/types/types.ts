export interface Lesson {
  title: string;
  icon: any;
  documentId: string;
}

export interface VideoItem {
  thumbnail: string;
  title: string;
  videoId: string;
  summary?: string;
  summaryImage?: string;
}

export interface WatchedVideo {
    videoId: string;
    title: string;
    lessonTitle: string;
    timestamp: string;
    thumbnail: string;
    id: string;
}