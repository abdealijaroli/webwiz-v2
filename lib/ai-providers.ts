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
            dangerouslyAllowBrowser: true,
        });

        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content:
                            "You are a web developer assistant. Generate a website based on the user's description. Return ONLY valid JSON with html, css, and javascript properties. The response must be parseable JSON.",
                    },
                    {
                        role: "user",
                        content: `Create a website with the following description: ${prompt}. Return a JSON object with html, css, and javascript properties.`,
                    },
                ],
                response_format: { type: "json_object" },
            });

            const content = response.choices[0].message.content;
            if (!content) {
                throw new Error("Empty response from OpenAI");
            }

            try {
                return JSON.parse(content) as AIResponse;
            } catch (error) {
                console.error("Failed to parse OpenAI response:", content);
                return {
                    html: '<div class="error">Failed to generate content. Please try again.</div>',
                    css: ".error { color: red; padding: 1rem; text-align: center; }",
                    javascript: "",
                };
            }
        } catch (error) {
            console.error("OpenAI API error:", error);
            return {
                html: '<div class="error">Error connecting to OpenAI. Please check your API key.</div>',
                css: ".error { color: red; padding: 1rem; text-align: center; }",
                javascript: "",
            };
        }
    } else if (provider === "gemini") {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        try {
            const prompt_template = `Create a website based on this description: "${prompt}".
Return a JSON object with exactly this format:
{
  "html": "your html code here",
  "css": "your css code here",
  "javascript": "your javascript code here"
}
Important: Return ONLY the JSON object, no additional text, no code blocks, no backticks. Always include navbar and footer. Always center the content. Make the website modern and colorful.`;

            const result = await model.generateContent(prompt_template);
            const response = await result.response;
            const text = response.text().trim();

            try {
                // Try parsing the response directly first
                const parsedResponse = JSON.parse(text) as AIResponse;

                // Validate the response structure
                if (
                    !parsedResponse.html ||
                    !parsedResponse.css ||
                    typeof parsedResponse.javascript === "undefined"
                ) {
                    throw new Error("Invalid response structure");
                }

                return parsedResponse;
            } catch (error) {
                // If direct parsing fails, try cleaning up the response
                try {
                    const cleanJson = text
                        .replace(/```json\s*|\s*```/g, "") // Remove code blocks
                        .replace(/`/g, "") // Remove backticks
                        .trim();

                    const parsedResponse = JSON.parse(cleanJson) as AIResponse;

                    if (
                        !parsedResponse.html ||
                        !parsedResponse.css ||
                        typeof parsedResponse.javascript === "undefined"
                    ) {
                        throw new Error("Invalid response structure");
                    }

                    return parsedResponse;
                } catch (cleanupError) {
                    console.error("Failed to parse Gemini response:", text);
                    return {
                        html: '<div class="error">Failed to generate content. Please try again.</div>',
                        css: ".error { color: red; padding: 1rem; text-align: center; }",
                        javascript: "",
                    };
                }
            }
        } catch (error) {
            console.error("Gemini API error:", error);
            return {
                html: '<div class="error">Error connecting to Gemini. Please check your API key.</div>',
                css: ".error { color: red; padding: 1rem; text-align: center; }",
                javascript: "",
            };
        }
    }

    return {
        html: '<div class="error">Invalid provider selected</div>',
        css: ".error { color: red; padding: 1rem; text-align: center; }",
        javascript: "",
    };
}
