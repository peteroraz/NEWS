
import React from 'react';
import NewsCard from './NewsCard';
import { getIconForCategory } from './IconComponents';
import { Headline } from '../types';

interface CategorySectionProps {
  category: string;
  headlines: Headline[];
  commentaries: Record<string, string>;
  loadingCommentary: string | null;
  onGenerateCommentary: (headline: string) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ category, headlines, commentaries, loadingCommentary, onGenerateCommentary }) => {
  const IconComponent = getIconForCategory(category);
  
  return (
    <section className="mb-12">
      <div className="flex items-center mb-4">
        <IconComponent className="h-8 w-8 text-blue-400" />
        <h2 className="ml-3 text-3xl font-bold text-gray-100 capitalize">{category}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {headlines.map((headline, index) => (
          <NewsCard
            key={`${category}-${headline.url}-${index}`}
            headline={headline}
            commentary={commentaries[headline.headline] || null}
            isLoadingCommentary={loadingCommentary === headline.headline}
            onGenerateCommentary={onGenerateCommentary}
          />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
