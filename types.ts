
// The keys will be category names like "News", "Sports", etc.
// The values will be an array of headline strings.
export type CategorizedNews = Record<string, string[]>;

export interface NewsData {
  summary: string;
  categories: CategorizedNews;
}
