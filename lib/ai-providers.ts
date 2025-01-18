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

        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a web developer assistant. Generate HTML, CSS, and JavaScript code for websites based on user descriptions. Return only the code without explanations.",
                },
                {
                    role: "user",
                    content: `Create a website with the following description: ${prompt}. Respond with a JSON object containing three properties: html, css, and javascript. Make the design modern and responsive.`,
                },
            ],
            response_format: { type: "json_object" },
        });

        return JSON.parse(response.choices[0].message.content || "{}");
    } else if (provider === "gemini") {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt_template = `Create a website with the following description: ${prompt}. 
    Respond with a JSON object containing three properties: html, css, and javascript. 
    Make the design modern and responsive. 
    Format the response as a valid JSON object with these exact keys: { "html": "...", "css": "...", "javascript": "..." }`;

        const result = await model.generateContent(prompt_template);
        const response = await result.response;
        return JSON.parse(response.text());
    }

    throw new Error("Invalid provider selected");
}
