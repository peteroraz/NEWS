import React, { useState, useCallback } from 'react';
import { Headline } from '../types';
import LoadingSpinner from './LoadingSpinner';
import Feedback from './Feedback';
import { ShareIcon, CopyIcon } from './IconComponents';

interface NewsCardProps {
  headline: Headline;
  commentary: string | null;
  isLoadingCommentary: boolean;
  onGenerateCommentary: (headline: string) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ headline, commentary, isLoadingCommentary, onGenerateCommentary }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: headline.headline,
      text: `Commentary: ${commentary}\n\nSource: ${headline.source}`,
      url: headline.url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      const textToCopy = `Headline: ${headline.headline}\nCommentary: ${commentary}\nSource: ${headline.source}\nURL: ${headline.url}`;
      try {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      } catch (err) {
        console.error('Failed to copy: ', err);
        alert('Failed to copy content.');
      }
    }
  }, [headline, commentary]);


  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-blue-500/20 hover:ring-1 hover:ring-blue-500/50">
      <div className="p-6 flex-grow">
        <a href={headline.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
          <h3 className="font-bold text-lg text-gray-100">{headline.headline}</h3>
        </a>
        <p className="text-sm text-gray-400 mt-1">{headline.source}</p>

        {commentary && (
          <div className="mt-4 p-4 bg-gray-700/50 rounded-lg animate-fade-in">
            <p className="text-gray-300 whitespace-pre-wrap">{commentary}</p>
          </div>
        )}
      </div>

      <div className="p-6 pt-0">
        {!commentary && !isLoadingCommentary && (
          <button
            onClick={() => onGenerateCommentary(headline.headline)}
            className="w-full px-4 py-2 font-semibold text-white bg-gray-600 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors duration-300"
          >
            Generate Commentary
          </button>
        )}
        
        {isLoadingCommentary && (
          <div className="flex items-center justify-center w-full px-4 py-2 bg-gray-600 rounded-lg">
            <LoadingSpinner size="sm" />
            <span className="ml-2 text-sm">Generating...</span>
          </div>
        )}

        {commentary && (
            <div className="animate-fade-in">
              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors duration-300"
              >
                 {copied ? (
                    <>
                      <CopyIcon className="h-5 w-5" />
                      Copied!
                    </>
                ) : (
                    <>
                     {navigator.share ? <ShareIcon className="h-5 w-5" /> : <CopyIcon className="h-5 w-5" />}
                     {navigator.share ? 'Share' : 'Copy'}
                    </>
                )}
              </button>
              <Feedback id={headline.headline} type="commentary" />
            </div>
        )}
      </div>
    </div>
  );
};

export default NewsCard;
