import React, { useState } from 'react';
import { ThumbsUpIcon, ThumbsDownIcon } from './IconComponents';
import { saveFeedback } from '../services/feedbackService';

interface FeedbackProps {
  id: string;
  type: 'summary' | 'commentary';
}

const Feedback: React.FC<FeedbackProps> = ({ id, type }) => {
  const [rating, setRating] = useState<'good' | 'bad' | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);

  const handleRating = (newRating: 'good' | 'bad') => {
    setRating(newRating);
    setShowCommentBox(true); // Open comment box after rating
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating) {
      saveFeedback({ id, type, rating, comment });
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="mt-4 p-3 bg-green-900/50 border border-green-700 rounded-lg text-center text-sm text-green-300">
        Thank you for your feedback!
      </div>
    );
  }

  return (
    <div className="mt-4 p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
      <p className="text-sm font-semibold text-gray-300 mb-2 text-center">Was this {type} helpful?</p>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => handleRating('good')}
          aria-label="Rate as good"
          className={`p-2 rounded-full transition-colors duration-200 ${rating === 'good' ? 'bg-green-500 text-white' : 'bg-gray-600 hover:bg-green-700'}`}
        >
          <ThumbsUpIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => handleRating('bad')}
          aria-label="Rate as bad"
          className={`p-2 rounded-full transition-colors duration-200 ${rating === 'bad' ? 'bg-red-500 text-white' : 'bg-gray-600 hover:bg-red-700'}`}
        >
          <ThumbsDownIcon className="h-5 w-5" />
        </button>
      </div>

      {showCommentBox && rating && (
        <form onSubmit={handleSubmit} className="mt-4 animate-fade-in">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Optional: Tell us more..."
            rows={2}
            className="w-full px-3 py-2 text-sm text-white bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-400 outline-none"
          ></textarea>
          <button
            type="submit"
            className="w-full mt-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors duration-300"
          >
            Submit Feedback
          </button>
        </form>
      )}
    </div>
  );
};

export default Feedback;
