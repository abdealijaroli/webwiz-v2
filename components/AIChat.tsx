"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useMutation } from "@apollo/client";
import { CREATE_WEBSITE } from "@/lib/graphql/mutations";

interface AIChatProps {
  apiKey: string;
  provider: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIChat({ apiKey, provider }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [createWebsite] = useMutation(CREATE_WEBSITE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // TODO: Call AI provider API here
      // For now, simulating AI response
      const mockAIResponse = {
        name: "Sample Website",
        description: input,
        html: "<div><h1>Hello World</h1></div>",
        css: "h1 { color: blue; }",
        javascript: "console.log('Hello World')",
      };

      // Store the generated website in GraphQL backend
      const { data } = await createWebsite({
        variables: mockAIResponse,
      });

      const assistantMessage = {
        role: "assistant" as const,
        content: `I've created a website based on your description. You can preview it in the canvas. The website has been saved with ID: ${data.createWebsite.id}`,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = {
        role: "assistant" as const,
        content: "Sorry, there was an error processing your request. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px]">
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your website..."
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}