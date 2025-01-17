"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2 } from "lucide-react";
import APIKeyForm from "@/components/APIKeyForm";
import DesignCanvas from "@/components/DesignCanvas";
import AIChat from "@/components/AIChat";

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [provider, setProvider] = useState("openai");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAPISubmit = (key: string, selectedProvider: string) => {
    setApiKey(key);
    setProvider(selectedProvider);
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <APIKeyForm onSubmit={handleAPISubmit} />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Wand2 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">WebWiz V2</h1>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsAuthenticated(false)}
          >
            Change API Key
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <AIChat apiKey={apiKey} provider={provider} />
          </Card>

          <Card className="p-6">
            <Tabs defaultValue="preview">
              <TabsList className="mb-4">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code">Code Export</TabsTrigger>
              </TabsList>
              <TabsContent value="preview">
                <DesignCanvas />
              </TabsContent>
              <TabsContent value="code">
                <div className="space-y-4">
                  <Button className="w-full">Export Code</Button>
                  <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[600px]">
                    {/* Code will be displayed here */}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </main>
  );
}