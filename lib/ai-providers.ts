import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface AIResponse {
    html: string;
    css: string;
    javascript: string;
}

export async function generateWebsite(
    prompt: string,
    provider: string,
    apiKey: string
): Promise<AIResponse> {
    if (provider === "openai") {
        const openai = new OpenAI({
            apiKey,
            dangerouslyAllowBrowser: true, // Enable browser usage
        });

        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are a web developer assistant. You must respond with ONLY a valid JSON object containing three properties: html, css, and javascript. DO NOT include any markdown formatting, code blocks, or explanations.",
                    },
                    {
                        role: "user",
                        content: `Create a website with the following description: ${prompt}. Return ONLY a raw JSON object like this: {"html": "...", "css": "...", "javascript": "..."}`,
                    },
                ],
                response_format: { type: "json_object" },
            });

            const content = response.choices[0].message.content || "{}";

            // Clean up the response by removing any markdown formatting, just in case
            const cleanJson = content.replace(/```json\n?|\n?```/g, "").trim();

            try {
                return JSON.parse(cleanJson);
            } catch (error) {
                console.error("Failed to parse OpenAI response:", cleanJson);
                throw new Error("Invalid JSON response from OpenAI");
            }
        } catch (error) {
            console.error("OpenAI API error:", error);
            throw error;
        }
    } else if (provider === "gemini") {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt_template = `Create a website with the following description: ${prompt}. 
    You must respond with ONLY a valid JSON object containing three properties: html, css, and javascript. 
    Make the design modern and responsive. 
    DO NOT include any markdown formatting, code blocks, or explanations.
    ONLY return the raw JSON object like this: {"html": "...", "css": "...", "javascript": "..."}`;

        const result = await model.generateContent(prompt_template);
        const response = await result.response;
        const text = response.text();

        // Clean up the response by removing any markdown formatting
        const cleanJson = text.replace(/```json\n?|\n?```/g, "").trim();

        try {
            return JSON.parse(cleanJson);
        } catch (error) {
            console.error("Failed to parse Gemini response:", cleanJson);
            throw new Error("Invalid JSON response from Gemini");
        }
    }

    throw new Error("Invalid provider selected");
}
