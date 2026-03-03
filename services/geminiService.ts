
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysis } from "../types";

// Fix: Initializing GoogleGenAI with the recommended direct environment variable access as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzePasswordWithAI = async (password: string): Promise<AIAnalysis> => {
  if (!password) throw new Error("No password provided");

  try {
    // Fix: Using gemini-3-pro-preview for advanced reasoning on password resilience patterns
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Perform a cybersecurity deep-dive on the password resilience: "${password}". 
      Focus on brute-force resilience, dictionary attacks, and user education. 
      Do not store the password, only analyze its structure.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskAssessment: {
              type: Type.STRING,
              description: "A professional security risk summary (1-2 sentences)."
            },
            bruteForceExplanation: {
              type: Type.STRING,
              description: "Technical explanation of how a brute force tool would handle this password."
            },
            customSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Actionable tips specifically for this password structure."
            }
          },
          required: ["riskAssessment", "bruteForceExplanation", "customSuggestions"]
        }
      }
    });

    // Fix: Correctly accessing text property from response as string | undefined
    const result = JSON.parse(response.text || '{}');
    return result as AIAnalysis;
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return {
      riskAssessment: "AI analysis unavailable, but manual checks remain active.",
      bruteForceExplanation: "Brute force resilience depends on entropy and length.",
      customSuggestions: ["Use a password manager", "Enable MFA", "Use a passphrase"]
    };
  }
};
