export interface StoryCharacter {
  name: string;
  role: string;
  description: string;
  motivation: string;
}

export interface StoryChapter {
  chapterNumber: number;
  title: string;
  summary: string;
  content: string;
  wordCount: number;
}

export interface StorySetting {
  place: string;
  period: string;
  atmosphere: string;
}

export interface PlotOutline {
  exposition: string;
  risingAction: string;
  climax: string;
  fallingAction: string;
  resolution: string;
}

export type CoverTheme = 'antique-gold' | 'midnight-ink' | 'moss-emerald' | 'crimson-velvet' | 'celestial-sapphire';

export interface GeneratedStory {
  id: string;
  title: string;
  subtitle: string;
  logline: string;
  author: string;
  genre: string;
  tone: string;
  audience: string;
  coverTheme: CoverTheme;
  setting: StorySetting;
  characters: StoryCharacter[];
  plotOutline: PlotOutline;
  chapters: StoryChapter[];
  totalWords: number;
  estimatedReadTime: string;
  createdAt: string;
}

export type ActiveScreen = 'home' | 'input' | 'processing' | 'overview' | 'customization' | 'book';
