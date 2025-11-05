
import { GoogleGenAI } from "@google/genai";
import type { NewsData } from '../types';

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


export const fetchNewsAndSummary = async (country: string, date?: string | null): Promise<NewsData> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const dateQuery = date ? `on or around ${date}` : 'latest';

  const prompt = `
    Deep-search the internet for the ${dateQuery} top news headlines and trending stories in ${country}.
    Format your entire response as a single JSON object inside a markdown code block (\`\`\`json ... \`\`\`.
    The JSON object must have two top-level keys: "summary" and "categories".
    - The "summary" value must be a concise, well-written summary essay of the overall news landscape in ${country} based on the findings for the specified period.
    - The "categories" value must be an object where keys are category names (e.g., "News", "Sports", "Entertainment", "Business", "Politics", "Religion", "Fashion") and values are arrays of objects.
    - Each object in the arrays must have three keys: "headline" (the headline string), "url" (a valid URL to the news article), and "source" (the name of the news publication, e.g., "Reuters", "BBC News").
    Only include categories that have relevant news headlines. Do not include empty categories.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const newsData = extractJsonFromMarkdown(response.text);
    if (!newsData || !newsData.summary || !newsData.categories) {
        throw new Error("Invalid data structure received from AI.");
    }
    return newsData;

  } catch (error) {
    console.error("Error fetching news from Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to fetch news: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching news.");
  }
};

export const generateCommentary = async (headline: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    Generate a professional, insightful, and brief commentary on the following news headline.
    The commentary should provide context, potential implications, and a balanced perspective.
    Do not repeat the headline in your response.

    Headline: "${headline}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating commentary from Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate commentary: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating commentary.");
  }
};
