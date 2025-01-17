"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Wand2 } from "lucide-react";

interface APIKeyFormProps {
  onSubmit: (key: string, provider: string) => void;
}

export default function APIKeyForm({ onSubmit }: APIKeyFormProps) {
  const [apiKey, setApiKey] = useState("");
  const [provider, setProvider] = useState("openai");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(apiKey, provider);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <Wand2 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-center">WebWiz V2</h1>
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
              placeholder="Enter your API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Get Started
          </Button>
        </form>
      </Card>
    </div>
  );
}