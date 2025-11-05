export interface Headline {
  headline: string;
  url: string;
  source: string;
}

export interface CategorizedNews {
  [category: string]: Headline[];
}

export interface NewsData {
  summary: string;
  categories: CategorizedNews;
}

export interface FeedbackData {
  id: string; // Unique identifier for the content (e.g., headline text or 'summary-[country]-[date]')
  type: 'summary' | 'commentary';
  rating: 'good' | 'bad' | null;
  comment?: string;
  timestamp: string;
}
