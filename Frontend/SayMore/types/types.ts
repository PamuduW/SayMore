export interface Lesson {
  title: string;
  icon: any;  /
  documentId: string;
}

export interface VideoItem {
  thumbnail: string;
  title: string;
  videoId: string;
  summary?: string;
  summaryImage?: string;
}