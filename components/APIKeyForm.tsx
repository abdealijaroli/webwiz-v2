"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Wand2, Loader2 } from "lucide-react";
import { validateApiKey } from "@/lib/validate-api-key";
import { useToast } from "@/hooks/use-toast";

interface APIKeyFormProps {
    onSubmit: (key: string, provider: string) => void;
}

export default function APIKeyForm({ onSubmit }: APIKeyFormProps) {
    const [apiKey, setApiKey] = useState("");
    const [provider, setProvider] = useState("openai");
    const [isValidating, setIsValidating] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!apiKey.trim()) {
            toast({
                title: "Error",
                description: "Please enter an API key",
                variant: "destructive",
            });
            return;
        }

        setIsValidating(true);

        try {
            const isValid = await validateApiKey(apiKey, provider);

            if (isValid) {
                toast({
                    title: "Success",
                    description: "API key validated successfully",
                });
                onSubmit(apiKey, provider);
            } else {
                toast({
                    title: "Invalid API Key",
                    description: `The provided ${
                        provider === "openai" ? "OpenAI" : "Gemini"
                    } API key is invalid.`,
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Validation error:", error);
            toast({
                title: "Error",
                description: "Failed to validate API key. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsValidating(false);
        }
    };

    const getButtonText = () => {
        if (isValidating) {
            return (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating {provider === "openai"
                        ? "OpenAI"
                        : "Gemini"}{" "}
                    Key...
                </>
            );
        }
        return "Get Started";
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
            <Card className="w-full max-w-md p-8">
                <div className="flex items-center gap-2 mb-8 justify-center">
                    <Wand2 className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold text-center">
                        WebWiz V2
                    </h1>
                    <a
                        href="https://github.com/abdealijaroli/webwiz-v2"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            stroke="currentColor"
                            className="h-8 w-8 text-primary"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.34-3.369-1.34-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.607.069-.607 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.983 1.029-2.682-.103-.253-.446-1.27.098-2.646 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.91-1.294 2.75-1.025 2.75-1.025.544 1.376.201 2.393.099 2.646.64.699 1.028 1.591 1.028 2.682 0 3.842-2.337 4.687-4.563 4.936.36.31.682.92.682 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.579.688.481C19.138 20.165 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </a>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <Label>Select AI Provider</Label>
                        <RadioGroup
                            defaultValue="openai"
                            onValueChange={setProvider}
                            className="grid grid-cols-2 gap-4"
                        >
                            <div>
                                <RadioGroupItem
                                    value="openai"
                                    id="openai"
                                    className="peer sr-only"
                                />
                                <Label
                                    htmlFor="openai"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                    <span>OpenAI</span>
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem
                                    value="gemini"
                                    id="gemini"
                                    className="peer sr-only"
                                />
                                <Label
                                    htmlFor="gemini"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                    <span>Gemini</span>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="apiKey">API Key</Label>
                        <Input
                            id="apiKey"
                            type="password"
                            placeholder={`Enter your ${
                                provider === "openai" ? "OpenAI" : "Gemini"
                            } API key`}
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isValidating}
                    >
                        {getButtonText()}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
