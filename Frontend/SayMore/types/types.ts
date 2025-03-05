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

export interface WatchedVideo {
    videoId: string;       // ID of the watched video
    title: string;         // Name of the video that was watched
    lessonTitle: string; // name of the lesson
    timestamp: string;     // Date and time the video was watched (as a string)
}