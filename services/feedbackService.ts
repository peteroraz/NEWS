import { FeedbackData } from '../types';

const FEEDBACK_STORAGE_KEY = 'newsAppFeedback';

/**
 * Saves a new feedback entry to localStorage.
 * @param feedback - The feedback object to save, without the timestamp.
 */
export const saveFeedback = (feedback: Omit<FeedbackData, 'timestamp'>): void => {
  try {
    const existingFeedback = getAllFeedback();
    const newFeedback: FeedbackData = {
      ...feedback,
      timestamp: new Date().toISOString(),
    };
    const updatedFeedback = [...existingFeedback, newFeedback];
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updatedFeedback));
  } catch (error) {
    console.error("Failed to save feedback to localStorage", error);
  }
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
