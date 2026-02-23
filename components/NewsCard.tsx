
import React, { useState, useCallback } from 'react';
import { Headline, CommentaryTone } from '../types';
import LoadingSpinner from './LoadingSpinner';
import Feedback from './Feedback';
import { ShareIcon, CopyIcon, WhatsAppIcon, LinkedInIcon, XIcon, FacebookIcon } from './IconComponents';
import { motion, AnimatePresence } from 'motion/react';

interface NewsCardProps {
  headline: Headline;
  commentary: string | null;
  isLoadingCommentary: boolean;
  onGenerateCommentary: (headline: string, tone: CommentaryTone) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ headline, commentary, isLoadingCommentary, onGenerateCommentary }) => {
  const [copied, setCopied] = useState(false);
  const [selectedTone, setSelectedTone] = useState<CommentaryTone>('analytical');
  const [showShareOptions, setShowShareOptions] = useState(false);

  const shareText = `📰 *Global News Deep Dive Analysis*\n\n*Headline:* ${headline.headline}\n\n*Source:* ${headline.source}\n\n*AI Insight (${selectedTone}):*\n${commentary || 'Generating...'}\n\nRead more: ${headline.url}`;

  const handleShare = (platform: string) => {
    let url = '';
    switch (platform) {
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareText)}`;
        break;
      case 'x':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(headline.url)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
    }
    if (url) window.open(url, '_blank');
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-gray-900/40 border border-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-blue-500/10 hover:border-blue-500/30 backdrop-blur-sm"
    >
      {headline.imageUrl && (
        <div className="h-48 w-full overflow-hidden">
          <img 
            src={headline.imageUrl} 
            alt={headline.headline}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            referrerPolicy="no-referrer"
          />
        </div>
      )}
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] bg-blue-500/10 px-2 py-1 rounded">
            {headline.source}
          </span>
          <button 
            onClick={() => setShowShareOptions(!showShareOptions)}
            className="text-gray-500 hover:text-blue-400 transition-colors"
          >
            <ShareIcon className="h-4 w-4" />
          </button>
        </div>

        <AnimatePresence>
          {showShareOptions && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex gap-2 mb-4 overflow-hidden"
            >
              <button onClick={() => handleShare('whatsapp')} className="p-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600 hover:text-white transition-all"><WhatsAppIcon className="h-4 w-4" /></button>
              <button onClick={() => handleShare('linkedin')} className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><LinkedInIcon className="h-4 w-4" /></button>
              <button onClick={() => handleShare('x')} className="p-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-white hover:text-black transition-all"><XIcon className="h-4 w-4" /></button>
              <button onClick={() => handleShare('facebook')} className="p-2 bg-blue-700/20 text-blue-500 rounded-lg hover:bg-blue-700 hover:text-white transition-all"><FacebookIcon className="h-4 w-4" /></button>
              <button onClick={() => handleShare('copy')} className="p-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-all">
                {copied ? <span className="text-[10px] font-bold">COPIED</span> : <CopyIcon className="h-4 w-4" />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <a href={headline.url} target="_blank" rel="noopener noreferrer" className="group">
          <h3 className="font-bold text-lg text-gray-100 leading-snug group-hover:text-blue-400 transition-colors">{headline.headline}</h3>
        </a>

        {commentary && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mt-6 p-5 bg-blue-500/5 border-l-2 border-blue-500 rounded-r-2xl relative"
          >
            <div className="text-[9px] font-black text-blue-400 uppercase mb-2 tracking-[0.3em]">{selectedTone} Perspective</div>
            <p className="text-gray-300 text-sm italic leading-relaxed">"{commentary}"</p>
          </motion.div>
        )}
      </div>

      <div className="p-6 pt-0">
        {!commentary && !isLoadingCommentary && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-1 justify-center bg-gray-950/50 p-1 rounded-xl border border-gray-800">
              {(['neutral', 'analytical', 'critical', 'optimistic'] as CommentaryTone[]).map((tone) => (
                <button
                  key={tone}
                  onClick={() => setSelectedTone(tone)}
                  className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                    selectedTone === tone ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
            <button
              onClick={() => onGenerateCommentary(headline.headline, selectedTone)}
              className="w-full px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white bg-blue-600 rounded-xl hover:bg-blue-500 transition-all duration-300 shadow-lg shadow-blue-600/10"
            >
              Analyze Narrative
            </button>
          </div>
        )}
        
        {isLoadingCommentary && (
          <div className="flex items-center justify-center w-full py-4 bg-gray-950/50 rounded-xl border border-gray-800">
            <LoadingSpinner size="sm" />
            <span className="ml-3 text-[10px] font-black text-gray-500 uppercase tracking-widest animate-pulse">Consulting Intelligence...</span>
          </div>
        )}

        {commentary && (
          <div className="mt-4">
            <Feedback id={headline.headline} type="commentary" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default NewsCard;
