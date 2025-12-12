import { GoogleGenAI, Type, SchemaShared } from "@google/genai";
import { GuardMEResponse } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-2.5-flash';

const responseSchema: SchemaShared = {
  type: Type.OBJECT,
  properties: {
    safe: { type: Type.BOOLEAN, description: "True if content is harmless, false if any risk is detected" },
    risk_score: { type: Type.INTEGER, description: "0 to 10, where 0 is safe and 10 is severe harm" },
    primary_category: {
      type: Type.STRING,
      enum: ["Harassment", "Sexual", "Misinformation", "Age-Inappropriate", "None"],
      description: "The primary risk category identified"
    },
    reasoning: { type: Type.STRING, description: "Brief explanation focused on safety of women/girls" },
    action: {
      type: Type.STRING,
      enum: ["BLOCK", "WARN", "ALLOW"],
      description: "Recommended action based on risk"
    }
  },
  required: ["safe", "risk_score", "primary_category", "reasoning", "action"],
};

const SYSTEM_INSTRUCTION = `
You are GuardME, an advanced AI content safety moderator designed to protect women and girls. Your goal is to analyze input text to detect harmful, misleading, gender-biased, or age-inappropriate content.

Analyze content based on these specific risk categories:
1. HARASSMENT_ABUSE: Targeted insults, misogyny, cyberbullying, or gender-based violence. Be highly sensitive to subtle misogyny and "victim-blaming".
2. SEXUAL_EXPLICITNESS: Pornographic content, non-consensual sexual imagery descriptions, or sexual grooming.
3. DANGEROUS_MISINFORMATION: False health claims (e.g., dangerous diet tips, "thin-spiration", pro-anorexia), financial scams targeting women, or misleading beauty standards that promote self-harm.
4. AGE_APPROPRIATENESS: Content suitable for adults but unsafe for girls under 18 (e.g., explicit conversations, gambling, promotion of alcohol/drugs).

If content is safe/neutral, set risk_score to 0 and action to "ALLOW".
`;

export const analyzeContent = async (text: string): Promise<GuardMEResponse> => {
  if (!text.trim()) {
    throw new Error("Input text cannot be empty");
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [
        {
          role: "user",
          parts: [{ text: text }]
        }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1, // Low temperature for consistent classification
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("No response received from GuardME AI");
    }

    const result = JSON.parse(responseText) as GuardMEResponse;
    return result;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};