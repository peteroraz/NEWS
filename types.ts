
export type CommentaryTone = 'neutral' | 'analytical' | 'critical' | 'optimistic';

export interface Headline {
  headline: string;
  url: string;
  source: string;
}

export interface CategorizedNews {
  [category: string]: Headline[];
}

export interface SocialMediaStory {
  platform: 'X' | 'Instagram' | 'Facebook';
  content: string;
  author: string;
  url: string;
}

export interface NewsData {
  summary: string;
  trending: Headline[];
  categories: CategorizedNews;
  socialMedia: SocialMediaStory[];
}

export interface Comment {
  id: string;
  text: string;
  timestamp: string;
  author: string;
}

export interface FeedbackData {
  id: string;
  type: 'summary' | 'commentary';
  rating: 'good' | 'bad' | null;
  comment?: string;
  likes: number;
  comments: Comment[];
  timestamp: string;
}
