
import React, { useState } from 'react';
import { Headline } from '../types';
import { TrendingUpIcon, ShareIcon, XIcon, FacebookIcon, WhatsAppIcon, CopyIcon } from './IconComponents';
import { motion, AnimatePresence } from 'motion/react';

interface TrendingStoriesProps {
  stories: Headline[];
}

const TrendingStories: React.FC<TrendingStoriesProps> = ({ stories }) => {
  const [activeShareId, setActiveShareId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!stories || stories.length === 0) return null;

  const handleShare = (e: React.MouseEvent, story: Headline, platform: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const shareText = `📰 *Trending News: ${story.headline}*\n\nSource: ${story.source}\n\nRead more: ${story.url}`;
    let url = '';
    
    switch (platform) {
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        break;
      case 'x':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(story.url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(story.url);
        setCopiedId(story.url);
        setTimeout(() => setCopiedId(null), 2000);
        return;
    }
    
    if (url) window.open(url, '_blank');
    setActiveShareId(null);
  };

  const toggleShare = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveShareId(activeShareId === id ? null : id);
  };

  return (
    <section className="mb-16">
      <div className="flex items-center mb-8">
        <div className="bg-blue-500/20 p-2 rounded-lg">
          <TrendingUpIcon className="h-6 w-6 text-blue-400" />
        </div>
        <h2 className="ml-4 text-2xl font-black text-white uppercase tracking-tighter italic">
          Pulse of the Nation: Top Trending
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.isArray(stories) && stories.slice(0, 10).map((story, index) => (
          <motion.div
            key={`${story.url}-${index}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="group relative bg-gray-800/40 border border-gray-700/50 rounded-2xl transition-all duration-500 hover:bg-gray-800 hover:border-blue-500/50 hover:-translate-y-1 overflow-hidden flex flex-col cursor-pointer"
            onClick={() => window.open(story.url, '_blank')}
          >
            {story.imageUrl && (
              <div className="h-32 w-full overflow-hidden relative">
                <img 
                  src={story.imageUrl} 
                  alt={story.headline}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            )}
            
            <div className="p-6 flex-grow relative flex flex-col">
              <div className="flex justify-between items-start mb-3 relative z-20">
                <div className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] opacity-70 group-hover:opacity-100 transition-opacity">
                  {story.source}
                </div>
                <button 
                  onClick={(e) => toggleShare(e, story.url)}
                  className="p-1.5 bg-gray-900/50 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                >
                  <ShareIcon className="h-3 w-3" />
                </button>
              </div>

              <AnimatePresence>
                {activeShareId === story.url && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-12 right-6 z-30 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-2 flex gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button onClick={(e) => handleShare(e, story, 'whatsapp')} className="p-2 hover:bg-green-500/10 text-green-500 rounded-lg transition-colors"><WhatsAppIcon className="h-4 w-4" /></button>
                    <button onClick={(e) => handleShare(e, story, 'x')} className="p-2 hover:bg-white/10 text-white rounded-lg transition-colors"><XIcon className="h-4 w-4" /></button>
                    <button onClick={(e) => handleShare(e, story, 'facebook')} className="p-2 hover:bg-blue-500/10 text-blue-500 rounded-lg transition-colors"><FacebookIcon className="h-4 w-4" /></button>
                    <button onClick={(e) => handleShare(e, story, 'copy')} className="p-2 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors">
                      {copiedId === story.url ? <span className="text-[8px] font-bold text-blue-400">OK</span> : <CopyIcon className="h-4 w-4" />}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Background Number */}
              <div className="absolute -bottom-4 -right-2 text-8xl font-black text-gray-700/10 group-hover:text-blue-500/5 transition-colors duration-500 pointer-events-none">
                {index + 1 < 10 ? `0${index + 1}` : index + 1}
              </div>

              <div className="relative z-10 flex-grow">
                <h3 className="text-sm font-bold text-gray-100 leading-relaxed group-hover:text-blue-400 transition-colors line-clamp-3">
                  {story.headline}
                </h3>
              </div>
            </div>

            {/* Hover Indicator */}
            <div className="absolute top-0 left-0 w-1 h-0 bg-blue-500 group-hover:h-full transition-all duration-500" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TrendingStories;
