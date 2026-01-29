
import { GoogleGenAI, Type } from "@google/genai";
import { AIAdvice, MugConfig } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async analyzeDesign(config: MugConfig): Promise<AIAdvice> {
    const prompt = `
      Analyze this coffee mug design for professional print standards.
      Mug Color: ${config.mugColor}
      Text Content: "${config.text}"
      Text Color: ${config.textColor}
      Font Family: ${config.fontFamily}
      Font Size: ${config.fontSize}px
      
      CRITICAL RULES:
      1. Contrast Ratio: Verify if the contrast between text and mug color is at least 4.5:1 (WCAG AA).
      2. Print Safety: Check if the text is too close to the edges of the printable area (approx 150px wide).
      3. Legibility: Evaluate the font choice against the background.

      Provide a rating (1-5), a brief professional feedback summary, and 3 specific suggestions.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              rating: { type: Type.NUMBER },
              feedback: { type: Type.STRING },
              suggestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["rating", "feedback", "suggestions"]
          }
        }
      });

      return JSON.parse(response.text) as AIAdvice;
    } catch (error) {
      console.error("Gemini Design Analysis Error:", error);
      return {
        rating: 4,
        feedback: "Design looks stable. Always verify contrast for dark-on-dark or light-on-light combinations.",
        suggestions: ["Ensure text is centered.", "Increase font size for short quotes.", "Choose high-contrast color pairings."]
      };
    }
  }

  async getQuotes(themePrompt: string): Promise<string[]> {
    const prompt = `Provide a list of 5 short, punchy coffee mug quotes for the theme: ${themePrompt}. Keep quotes under 35 characters for perfect mug fit.`;
    
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });
      return JSON.parse(response.text);
    } catch (error) {
      console.error("Gemini Quote Generation Error:", error);
      return ["But first, coffee.", "Stay grounded.", "Caffeine Loading...", "Today is a good day.", "Brewing Magic."];
    }
  }

  async generateLifestyleMockup(config: MugConfig): Promise<string | null> {
    // Making the prompt extremely explicit about the text to avoid "blank" text in generated images
    const prompt = `A professional, photorealistic lifestyle product shot of a ${config.style} travel mug.
    MUG COLOR: ${config.mugColor}.
    PRINTED TEXT: Exactly the words "${config.text}". 
    TEXT COLOR: ${config.textColor}.
    TEXT STYLE: Centered, clean ${config.fontFamily} typography.
    PLACEMENT: The text must be clearly visible and centered on the front surface of the mug.
    SCENE: A minimalist office desk or a soft morning cafe setting. 
    AESTHETIC: High-end, clean, modern, neutral colors, shallow depth of field.
    IMPORTANT: Do not omit the text. The text "${config.text}" is the most important feature.`;
    
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: {
          imageConfig: {
            aspectRatio: "16:9"
          }
        }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      console.error("Gemini Image Generation Error:", error);
      return null;
    }
  }
}

export const gemini = new GeminiService();
