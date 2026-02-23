
import React, { useState, useCallback } from 'react';
import { Headline, CommentaryTone } from '../types';
import LoadingSpinner from './LoadingSpinner';
import Feedback from './Feedback';
import { ShareIcon, CopyIcon, WhatsAppIcon, LinkedInIcon } from './IconComponents';

interface NewsCardProps {
  headline: Headline;
  commentary: string | null;
  isLoadingCommentary: boolean;
  onGenerateCommentary: (headline: string, tone: CommentaryTone) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ headline, commentary, isLoadingCommentary, onGenerateCommentary }) => {
  const [copied, setCopied] = useState(false);
  const [selectedTone, setSelectedTone] = useState<CommentaryTone>('analytical');

  const shareText = `📰 *Global News Deep Dive Analysis*\n\n*Headline:* ${headline.headline}\n\n*Source:* ${headline.source}\n\n*AI Insight (${selectedTone}):*\n${commentary || 'Generating...'}\n\nRead more: ${headline.url}`;

  const handleShare = useCallback(async () => {
    const shareData = {
      title: headline.headline,
      text: `Insight: ${commentary}\nSource: ${headline.source}`,
      url: headline.url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      const textToCopy = `Headline: ${headline.headline}\nInsight: ${commentary}\nSource: ${headline.source}\nURL: ${headline.url}`;
      try {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  }, [headline, commentary]);

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleLinkedInShare = () => {
    // LinkedIn sharing usually works best with just a URL, but we can try to prompt a feed share with text
    const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-blue-500/20 hover:ring-1 hover:ring-blue-500/50">
      <div className="p-6 flex-grow">
        <a href={headline.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
          <h3 className="font-bold text-lg text-gray-100 leading-snug">{headline.headline}</h3>
        </a>
        <p className="text-sm text-gray-400 mt-2 flex items-center gap-2">
          <span className="bg-gray-700 px-2 py-0.5 rounded text-xs uppercase tracking-wider">{headline.source}</span>
        </p>

        {commentary && (
          <div className="mt-4 p-4 bg-gray-700/50 border-l-4 border-blue-500 rounded-r-lg animate-fade-in">
             <div className="text-xs text-blue-400 font-bold uppercase mb-1 tracking-widest">{selectedTone} Commentary</div>
            <p className="text-gray-300 whitespace-pre-wrap text-sm italic">"{commentary}"</p>
          </div>
        )}
      </div>

      <div className="p-6 pt-0">
        {!commentary && !isLoadingCommentary && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-1 justify-center bg-gray-900/50 p-1 rounded-lg border border-gray-700">
              {(['neutral', 'analytical', 'critical', 'optimistic'] as CommentaryTone[]).map((tone) => (
                <button
                  key={tone}
                  onClick={() => setSelectedTone(tone)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    selectedTone === tone ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {tone.charAt(0).toUpperCase() + tone.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={() => onGenerateCommentary(headline.headline, selectedTone)}
              className="w-full px-4 py-2 font-semibold text-white bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg hover:bg-blue-600 hover:text-white focus:outline-none transition-all duration-300"
            >
              Analyze with {selectedTone.charAt(0).toUpperCase() + selectedTone.slice(1)} Lens
            </button>
          </div>
        )}
        
        {isLoadingCommentary && (
          <div className="flex items-center justify-center w-full px-4 py-2 bg-gray-700/50 rounded-lg border border-gray-600">
            <LoadingSpinner size="sm" />
            <span className="ml-2 text-sm text-gray-400 animate-pulse">Consulting Gemini...</span>
          </div>
        )}

        {commentary && (
            <div className="animate-fade-in space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={handleWhatsAppShare}
                  title="Share on WhatsApp"
                  className="flex items-center justify-center p-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={handleLinkedInShare}
                  title="Share on LinkedIn"
                  className="flex items-center justify-center p-2 text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors"
                >
                  <LinkedInIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={handleShare}
                  title={navigator.share ? "System Share" : "Copy to Clipboard"}
                  className="flex items-center justify-center p-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
                >
                   {copied ? <CopyIcon className="h-5 w-5 text-green-400" /> : (navigator.share ? <ShareIcon className="h-5 w-5" /> : <CopyIcon className="h-5 w-5" />)}
                </button>
              </div>
              <Feedback id={headline.headline} type="commentary" />
            </div>
        )}
      </div>
    </div>
  );
};

export default NewsCard;
