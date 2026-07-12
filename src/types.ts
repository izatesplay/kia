export interface Track {
  id: string;
  title: string;
  titleEn: string;
  genre: string;
  duration: string;
  audioUrl: string;
  coverUrl: string;
  description: string;
  descriptionEn?: string;
  year: string;
  instrument: string;
  instrumentEn?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface Achievement {
  year: string;
  yearEn?: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
}

export interface GalleryItem {
  id: string;
  title?: string;
  titleEn?: string;
  imageUrl: string;
  description?: string;
  descriptionEn?: string;
  createdAt?: string;
}

