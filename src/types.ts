export interface Track {
  id: string;
  title: string;
  titleEn: string;
  genre: string;
  duration: string;
  audioUrl: string;
  coverUrl: string;
  description: string;
  year: string;
  instrument: string;
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
  title: string;
  description: string;
}
