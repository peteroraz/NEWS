import React, { useState, useEffect } from 'react';
import { ThumbsUpIcon, ThumbsDownIcon, ShareIcon } from './IconComponents';
import { saveFeedback, getFeedbackById } from '../services/feedbackService';
import { Comment } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface FeedbackProps {
  id: string;
  type: 'summary' | 'commentary';
}

const Feedback: React.FC<FeedbackProps> = ({ id, type }) => {
  const [rating, setRating] = useState<'good' | 'bad' | null>(null);
  const [commentText, setCommentText] = useState('');
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    const existing = getFeedbackById(id);
    if (existing) {
      setRating(existing.rating);
      setLikes(existing.likes);
      setComments(existing.comments);
    }
  }, [id]);

  const handleRating = (newRating: 'good' | 'bad') => {
    setRating(newRating);
    saveFeedback({ id, type, rating: newRating });
  };

  const handleLike = () => {
    if (!hasLiked) {
      const newLikes = likes + 1;
      setLikes(newLikes);
      setHasLiked(true);
      saveFeedback({ id, type, likes: newLikes });
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      const newComment: Comment = {
        id: Date.now().toString(),
        text: commentText,
        timestamp: new Date().toISOString(),
        author: 'Anonymous User'
      };
      const newComments = [...comments, newComment];
      setComments(newComments);
      setCommentText('');
      saveFeedback({ id, type, comments: newComments });
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-900/40 border border-gray-800 rounded-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              hasLiked ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <ThumbsUpIcon className="h-4 w-4" />
            <span className="text-xs font-bold">{likes}</span>
          </button>
          
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-xs font-bold text-gray-400 hover:text-blue-400 transition-colors"
          >
            {comments.length} Comments
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => handleRating('good')}
            className={`p-1.5 rounded-full transition-all ${rating === 'good' ? 'text-green-400 bg-green-400/10' : 'text-gray-500 hover:text-green-400'}`}
          >
            <ThumbsUpIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleRating('bad')}
            className={`p-1.5 rounded-full transition-all ${rating === 'bad' ? 'text-red-400 bg-red-400/10' : 'text-gray-500 hover:text-red-400'}`}
          >
            <ThumbsDownIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 mb-4 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {comments.map((c) => (
                <div key={c.id} className="bg-gray-800/50 p-2 rounded-lg border border-gray-700/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-tighter">{c.author}</span>
                    <span className="text-[9px] text-gray-500">{new Date(c.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">{c.text}</p>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-center text-xs text-gray-500 italic py-2">No comments yet. Be the first!</p>
              )}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-grow bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
              >
                Post
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Feedback;
