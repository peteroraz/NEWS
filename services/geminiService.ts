
import { GoogleGenAI } from "@google/genai";
import type { NewsData, CommentaryTone } from '../types';

/**
 * Utility to extract JSON from a markdown response.
 */
const extractJsonFromMarkdown = (text: string): NewsData | null => {
  const match = text.match(/```json\n([\s\S]*?)\n```/);
  if (match && match[1]) {
    try {
      return JSON.parse(match[1]) as NewsData;
    } catch (e) {
      console.error("Failed to parse JSON from markdown", e);
      throw new Error("The response from the AI was not in the expected format. Please try again.");
    }
  }
  throw new Error("Could not find a valid JSON block in the AI's response.");
};

/**
 * Graceful retry logic with exponential backoff to handle transient 500/XHR errors.
 */
const withRetry = async <T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> => {
  try {
    return await fn();
  } catch (error: any) {
    const isTransient = error?.message?.includes('500') || 
                        error?.message?.includes('xhr') || 
                        error?.message?.includes('Rpc failed');
    
    if (retries <= 0 || !isTransient) throw error;
    
    console.warn(`Transient error encountered. Retrying in ${delay}ms... (${retries} attempts left)`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay * 2);
  }
};

export const fetchNewsAndSummary = async (country: string, startDate?: string | null, endDate?: string | null): Promise<NewsData> => {
  return withRetry(async () => {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    let dateQuery = 'latest';
    if (startDate && endDate) {
      dateQuery = `between ${startDate} and ${endDate}`;
    } else if (startDate) {
      dateQuery = `since ${startDate}`;
    } else if (endDate) {
      dateQuery = `on or before ${endDate}`;
    }

    const prompt = `
      Deep-search the internet for the ${dateQuery} top news headlines and trending stories in ${country}.
      Format your entire response as a single JSON object inside a markdown code block (\`\`\`json ... \`\`\`).
      The JSON object must have four top-level keys: "summary", "trending", "categories", and "socialMedia".
      - "summary": A concise, well-written summary essay of the overall news landscape in ${country} for the period.
      - "trending": An array of exactly 5 objects representing the most significant stories across all categories.
      - "categories": An object where keys are category names. Values MUST be arrays of objects. You MUST include these categories if relevant: "Technology", "Lifestyle", "Investors", "Health", "Education", "Politics", "Business", "Sports", "Entertainment".
      - "socialMedia": An array of 3-5 objects representing trending discussions or news from X (Twitter), Instagram, and Facebook in ${country}.
      
      Each object in "trending" and "categories" arrays must have: "headline", "url", and "source".
      Each object in "socialMedia" must have: "platform" (one of "X", "Instagram", "Facebook"), "content" (the post text or summary), "author" (username or handle), and "url" (direct link).
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      if (!response.text) {
        throw new Error("Empty response from AI.");
      }

      const newsData = extractJsonFromMarkdown(response.text);
      if (!newsData || !newsData.summary || !newsData.categories || !newsData.trending || !newsData.socialMedia) {
          throw new Error("Invalid data structure received from AI.");
      }
      return newsData;

    } catch (error) {
      console.error("Error in fetchNewsAndSummary:", error);
      throw error;
    }
  });
};

export const generateCommentary = async (headline: string, tone: CommentaryTone = 'neutral'): Promise<string> => {
  return withRetry(async () => {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      Generate a professional, insightful, and brief commentary on the following news headline.
      The commentary should be written in a **${tone}** tone.
      Provide context, potential implications, and a perspective aligned with the chosen tone.
      Do not repeat the headline in your response.

      Headline: "${headline}"
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });
      
      const text = response.text;
      if (!text) throw new Error("No commentary generated.");
      return text.trim();
    } catch (error) {
      console.error("Error in generateCommentary:", error);
      throw error;
    }
  });
};
