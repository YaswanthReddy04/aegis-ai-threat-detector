import { GoogleGenAI, Type } from "@google/genai";
import { ThreatAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function analyzeSymptoms(symptoms: string): Promise<ThreatAnalysis> {
  console.log("Analyzing symptoms:", symptoms);
  
  const prompt = `You are a cybersecurity expert AI. A user has reported these system symptoms: "${symptoms}". Analyze these symptoms and respond in this exact JSON format:
{
  "threat_type": string,
  "severity": "Low" | "Medium" | "High" | "Critical",
  "confidence": number (0-100),
  "explanation": string (2-3 sentences, plain English),
  "remediation_steps": string[] (3-5 actionable steps),
  "threat_category": string
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            threat_type: { type: Type.STRING },
            severity: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] },
            confidence: { type: Type.NUMBER },
            explanation: { type: Type.STRING },
            remediation_steps: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            threat_category: { type: Type.STRING }
          },
          required: ["threat_type", "severity", "confidence", "explanation", "remediation_steps", "threat_category"]
        }
      }
    });

    const text = response.text;
    console.log("AI Raw Response:", text);
    
    if (!text) throw new Error("No response from AI");
    
    // Clean JSON if model wrapped it in markdown
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const cleanedJson = jsonMatch ? jsonMatch[0] : text;
    
    return JSON.parse(cleanedJson) as ThreatAnalysis;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to analyze symptoms. Please try again.");
  }
}
