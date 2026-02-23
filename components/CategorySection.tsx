
import React from 'react';
import NewsCard from './NewsCard';
import CardErrorBoundary from './ErrorBoundary';
import { getIconForCategory } from './IconComponents';
import { Headline, CommentaryTone } from '../types';
import { motion } from 'motion/react';

interface CategorySectionProps {
  category: string;
  headlines: Headline[];
  commentaries: Record<string, string>;
  loadingCommentary: string | null;
  onGenerateCommentary: (headline: string, tone: CommentaryTone) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ category, headlines, commentaries, loadingCommentary, onGenerateCommentary }) => {
  const IconComponent = getIconForCategory(category);
  
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-16"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <IconComponent className="h-6 w-6 text-blue-400" />
          </div>
          <h2 className="ml-4 text-2xl font-black text-white uppercase tracking-tighter italic">{category}</h2>
        </div>
        <div className="h-px flex-grow mx-6 bg-gradient-to-r from-gray-800 to-transparent"></div>
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{headlines.length} Reports</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.isArray(headlines) && headlines.map((headline, index) => (
          <CardErrorBoundary key={`${category}-${headline.url}-${index}`}>
            <NewsCard
              headline={headline}
              commentary={commentaries[headline.headline] || null}
              isLoadingCommentary={loadingCommentary === headline.headline}
              onGenerateCommentary={onGenerateCommentary}
            />
          </CardErrorBoundary>
        ))}
      </div>
    </motion.section>
  );
};

export default CategorySection;
