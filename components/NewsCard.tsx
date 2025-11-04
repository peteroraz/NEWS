import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { ShareIcon } from './IconComponents';

interface NewsCardProps {
  headline: string;
  commentary: string | null;
  isLoadingCommentary: boolean;
  onGenerateCommentary: (headline: string) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ headline, commentary, isLoadingCommentary, onGenerateCommentary }) => {
  const canShare = typeof navigator !== 'undefined' && !!navigator.share;

  const handleShare = async () => {
    if (!canShare || !commentary) return;

    try {
      await navigator.share({
        title: `News Commentary: ${headline}`,
        text: `Headline: ${headline}\n\nAI Commentary:\n${commentary}`,
        url: window.location.href, // Share the app URL for context
      });
    } catch (error) {
      // User might cancel the share action, so we don't want to show an error.
      // We can log it for debugging purposes.
      console.log('Share action was cancelled or failed', error);
    }
  };


  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 transition-all duration-300 hover:border-blue-500 flex flex-col justify-between h-full">
      <div>
        <p className="text-gray-200 text-lg">{headline}</p>
      </div>
      
      <div className="mt-4">
        {commentary ? (
          <div>
            <div className="p-3 bg-gray-700/50 border-l-4 border-blue-400 rounded-r-lg">
              <p className="text-sm font-semibold text-blue-300 mb-1">Commentary</p>
              <p className="text-gray-300 whitespace-pre-wrap">{commentary}</p>
            </div>
            {canShare && (
              <div className="mt-3 text-right">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center px-3 py-1 text-xs font-medium text-teal-300 bg-teal-900/50 border border-teal-700 rounded-full hover:bg-teal-800/50 transition-colors"
                  aria-label="Share this news and commentary"
                >
                  <ShareIcon className="h-4 w-4 mr-2" />
                  Share
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-right">
            <button
              onClick={() => onGenerateCommentary(headline)}
              disabled={isLoadingCommentary}
              className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-300 bg-blue-900/50 border border-blue-700 rounded-full hover:bg-blue-800/50 disabled:opacity-50 disabled:cursor-wait transition-colors"
            >
              {isLoadingCommentary ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Generating...</span>
                </>
              ) : (
                'Generate Commentary'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsCard;