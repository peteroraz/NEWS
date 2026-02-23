import { FeedbackData } from '../types';

const FEEDBACK_STORAGE_KEY = 'newsAppFeedback';

/**
 * Saves a new feedback entry to localStorage.
 * @param feedback - The feedback object to save, without the timestamp.
 */
export const saveFeedback = (feedback: Partial<FeedbackData> & { id: string }): void => {
  try {
    const existingFeedback = getAllFeedback();
    const index = existingFeedback.findIndex(f => f.id === feedback.id);
    
    if (index !== -1) {
      existingFeedback[index] = {
        ...existingFeedback[index],
        ...feedback,
        timestamp: new Date().toISOString(),
      };
    } else {
      const newFeedback: FeedbackData = {
        id: feedback.id,
        type: feedback.type || 'commentary',
        rating: feedback.rating || null,
        comment: feedback.comment || '',
        likes: feedback.likes || 0,
        comments: feedback.comments || [],
        timestamp: new Date().toISOString(),
      };
      existingFeedback.push(newFeedback);
    }
    
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(existingFeedback));
  } catch (error) {
    console.error("Failed to save feedback to localStorage", error);
  }
};

export const getFeedbackById = (id: string): FeedbackData | null => {
  const all = getAllFeedback();
  return all.find(f => f.id === id) || null;
};

/**
 * Retrieves all feedback entries from localStorage.
 * @returns An array of feedback data, or an empty array if none exists or an error occurs.
 */
export const getAllFeedback = (): FeedbackData[] => {
  try {
    const storedData = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error("Failed to retrieve feedback from localStorage", error);
    return [];
  }
};
