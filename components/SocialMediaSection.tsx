
import React from 'react';
import { SocialMediaStory } from '../types';
import { XIcon, InstagramIcon, FacebookIcon, ShareIcon } from './IconComponents';
import { motion } from 'motion/react';

interface SocialMediaSectionProps {
  stories: SocialMediaStory[];
}

const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({ stories }) => {
  if (!stories || stories.length === 0) return null;

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'X': return <XIcon className="h-4 w-4" />;
      case 'Instagram': return <InstagramIcon className="h-4 w-4" />;
      case 'Facebook': return <FacebookIcon className="h-4 w-4" />;
      default: return null;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'X': return 'bg-black text-white border-gray-700';
      case 'Instagram': return 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white border-transparent';
      case 'Facebook': return 'bg-blue-600 text-white border-blue-500';
      default: return 'bg-gray-700 text-white border-gray-600';
    }
  };

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic flex items-center gap-3">
          <span className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
            <ShareIcon className="h-4 w-4 text-blue-400" />
          </span>
          Social Pulse
        </h2>
        <div className="h-px flex-grow mx-6 bg-gradient-to-r from-gray-800 to-transparent"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(stories) && stories.map((story, index) => (
          <motion.div
            key={`${story.platform}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-gray-900/40 border border-gray-800 rounded-2xl hover:bg-gray-800 transition-all duration-300 relative overflow-hidden flex flex-col"
          >
            {story.imageUrl && (
              <div className="h-48 w-full overflow-hidden">
                <img 
                  src={story.imageUrl} 
                  alt={story.content}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
            
            <div className="p-6 flex-grow flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getPlatformColor(story.platform)}`}>
                  {getPlatformIcon(story.platform)}
                  {story.platform}
                </div>
                <span className="text-[10px] font-bold text-gray-500 group-hover:text-blue-400 transition-colors">
                  @{story.author}
                </span>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed mb-6 line-clamp-4 italic">
                "{story.content}"
              </p>

              <div className="flex items-center justify-between mt-auto">
                <a
                  href={story.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors"
                >
                  View Original Post
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
                
                {story.engagement && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="w-1 h-1 rounded-full bg-blue-400 animate-pulse"></div>
                    <span className="text-[9px] font-black text-blue-400 uppercase tracking-tighter">
                      {story.engagement}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-blue-500/5 blur-2xl rounded-full group-hover:bg-blue-500/10 transition-all"></div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SocialMediaSection;
