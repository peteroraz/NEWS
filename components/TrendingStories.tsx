
import React from 'react';
import { Headline } from '../types';
import { TrendingUpIcon } from './IconComponents';
import { motion } from 'motion/react';

interface TrendingStoriesProps {
  stories: Headline[];
}

const TrendingStories: React.FC<TrendingStoriesProps> = ({ stories }) => {
  if (!stories || stories.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex items-center mb-8">
        <div className="bg-blue-500/20 p-2 rounded-lg">
          <TrendingUpIcon className="h-6 w-6 text-blue-400" />
        </div>
        <h2 className="ml-4 text-2xl font-black text-white uppercase tracking-tighter italic">
          Pulse of the Nation: Top 5 Trending
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Array.isArray(stories) && stories.slice(0, 5).map((story, index) => (
          <motion.a
            key={`${story.url}-${index}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            href={story.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-gray-800/40 border border-gray-700/50 rounded-2xl p-6 transition-all duration-500 hover:bg-gray-800 hover:border-blue-500/50 hover:-translate-y-1 overflow-hidden"
          >
            {/* Background Number */}
            <div className="absolute -bottom-4 -right-2 text-8xl font-black text-gray-700/10 group-hover:text-blue-500/5 transition-colors duration-500 pointer-events-none">
              0{index + 1}
            </div>

            <div className="relative z-10">
              <div className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-3 opacity-70 group-hover:opacity-100 transition-opacity">
                {story.source}
              </div>
              <h3 className="text-sm font-bold text-gray-100 leading-relaxed group-hover:text-blue-400 transition-colors line-clamp-3">
                {story.headline}
              </h3>
            </div>

            {/* Hover Indicator */}
            <div className="absolute top-0 left-0 w-1 h-0 bg-blue-500 group-hover:h-full transition-all duration-500" />
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default TrendingStories;
