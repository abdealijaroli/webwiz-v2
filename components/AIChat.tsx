"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Download } from "lucide-react";
import { useMutation } from "@apollo/client";
import { CREATE_WEBSITE } from "@/lib/graphql/mutations";
import { generateWebsite } from "@/lib/ai-providers";
import { useToast } from "@/hooks/use-toast";

interface AIChatProps {
    apiKey: string;
    provider: string;
    onDesignUpdate: (design: {
        html: string;
        css: string;
        javascript: string;
    }) => void;
}

interface Message {
    role: "user" | "assistant";
    content: string;
}

interface WebsiteCode {
    html: string;
    css: string;
    javascript: string;
}

export default function AIChat({
    apiKey,
    provider,
    onDesignUpdate,
}: AIChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [currentCode, setCurrentCode] = useState<WebsiteCode>({
        html: "",
        css: "",
        javascript: "",
    });

    const [createWebsite] = useMutation(CREATE_WEBSITE);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: "user" as const, content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const aiResponse = await generateWebsite(input, provider, apiKey);

            // Update both local and parent state with the AI response
            const newCode = {
                html: aiResponse.html || "",
                css: aiResponse.css || "",
                javascript: aiResponse.javascript || "",
            };

            setCurrentCode(newCode);
            onDesignUpdate(newCode); // Update parent component's state

            try {
                // Try to store in GraphQL backend, but don't block on failure
                await createWebsite({
                    variables: {
                        name: "Generated Website",
                        description: input,
                        ...aiResponse,
                    },
                });
            } catch (error) {
                console.error("Failed to save to database:", error);
                // Don't show error to user since this is not critical
            }

            const assistantMessage = {
                role: "assistant" as const,
                content:
                    "I've generated a website based on your description. You can see the preview and code in the right panel.",
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error("Error:", error);
            toast({
                title: "Error",
                description: "Failed to generate website. Please try again.",
                variant: "destructive",
            });
            const errorMessage = {
                role: "assistant" as const,
                content:
                    "Sorry, there was an error processing your request. Please try again.",
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportCode = () => {
        if (!currentCode.html && !currentCode.css && !currentCode.javascript)
            return;

        const zipContent = {
            "index.html": `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Website</title>
  <style>${currentCode.css}</style>
</head>
<body>
  ${currentCode.html}
  <script>${currentCode.javascript}</script>
</body>
</html>`,
        };

        const blob = new Blob([zipContent["index.html"]], {
            type: "text/html",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "website.html";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col h-[600px]">
            <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${
                                message.role === "user"
                                    ? "justify-end"
                                    : "justify-start"
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

            <div className="mt-4 space-y-2">
                {(currentCode.html ||
                    currentCode.css ||
                    currentCode.javascript) && (
                    <Button
                        onClick={handleExportCode}
                        variant="outline"
                        className="w-full"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export Code
                    </Button>
                )}

                <form onSubmit={handleSubmit} className="flex gap-2">
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
        </div>
    );
}
