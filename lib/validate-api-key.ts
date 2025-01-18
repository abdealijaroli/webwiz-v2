import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function validateApiKey(
    key: string,
    provider: string
): Promise<boolean> {
    try {
        if (provider === "openai") {
            const openai = new OpenAI({
                apiKey: key,
                dangerouslyAllowBrowser: true, // Enable browser usage
            });

            // Make a minimal API call to validate the key
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: "test" }],
                max_tokens: 1,
            });
            return !!response;
        } else if (provider === "gemini") {
            const genAI = new GoogleGenerativeAI(key);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            // Make a minimal API call to validate the key
            const result = await model.generateContent("test");
            return !!result;
        }
        return false;
    } catch (error) {
        console.error("API Key validation error");
        return false;
    }
}
