
import { GoogleGenAI, Type } from "@google/genai";
import { Book, GroundingLink, CurationResponse } from "./types";

export const curateBooks = async (
  mood: string, 
  description: string, 
  excludeTitles: string[] = []
): Promise<CurationResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const excludePart = excludeTitles.length > 0 
    ? `IMPORTANT: Do NOT recommend any of these books: ${excludeTitles.join(', ')}.` 
    : '';

  const prompt = `
    I am feeling ${mood} (${description}). 
    Please recommend exactly 6 real, high-quality books that perfectly match this mood. 
    
    ${excludePart}

    CRITICAL CONSTRAINTS:
    1. Only recommend books published AFTER the year 2010.
    2. Only recommend books that have a Goodreads rating of 4.1 or higher.
    3. For EACH book, you MUST provide a valid ISBN-13 (without hyphens). This is critical for fetching covers.
    
    Structure your response as JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            curatorNote: {
              type: Type.STRING,
              description: "A soulful, poetic introduction to this collection based on the user's mood."
            },
            books: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  author: { type: Type.STRING },
                  year: { type: Type.STRING },
                  rating: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  reason: { type: Type.STRING, description: "Why this book fits the mood." },
                  isbn: { type: Type.STRING, description: "ISBN-13 without hyphens." }
                },
                required: ["title", "author", "year", "rating", "summary", "reason", "isbn"]
              }
            }
          },
          required: ["curatorNote", "books"]
        }
      },
    });

    const data = JSON.parse(response.text || "{}");
    
    // Extract grounding links
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const links: GroundingLink[] = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title,
        uri: chunk.web.uri
      }));

    return {
      curatorNote: data.curatorNote || "Here are some books for your mood.",
      books: data.books || [],
      links: links
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to fetch recommendations. Please try again later.");
  }
};
