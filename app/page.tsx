"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2 } from "lucide-react";
import APIKeyForm from "@/components/APIKeyForm";
import DesignCanvas from "@/components/DesignCanvas";
import AIChat from "@/components/AIChat";

export default function Home() {
    const [apiKey, setApiKey] = useState("");
    const [provider, setProvider] = useState("openai");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentDesign, setCurrentDesign] = useState({
        html: "",
        css: "",
        javascript: "",
    });

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
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsAuthenticated(false)}
                        >
                            Change API Key
                        </Button>
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
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="p-6">
                        <AIChat apiKey={apiKey} provider={provider} />
                    </Card>

                    <Card className="p-6">
                        <Tabs defaultValue="preview">
                            <TabsList className="mb-4">
                                <TabsTrigger value="preview">
                                    Preview
                                </TabsTrigger>
                                <TabsTrigger value="code">Code</TabsTrigger>
                            </TabsList>
                            <TabsContent value="preview">
                                <DesignCanvas
                                    html={currentDesign.html}
                                    css={currentDesign.css}
                                    javascript={currentDesign.javascript}
                                />
                            </TabsContent>
                            <TabsContent value="code">
                                <div className="space-y-4">
                                    <div className="bg-muted p-4 rounded-lg overflow-auto max-h-[600px]">
                                        <h3 className="font-bold mb-2">HTML</h3>
                                        <pre className="text-sm">
                                            {currentDesign.html}
                                        </pre>
                                        <h3 className="font-bold mb-2 mt-4">
                                            CSS
                                        </h3>
                                        <pre className="text-sm">
                                            {currentDesign.css}
                                        </pre>
                                        <h3 className="font-bold mb-2 mt-4">
                                            JavaScript
                                        </h3>
                                        <pre className="text-sm">
                                            {currentDesign.javascript}
                                        </pre>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </Card>
                </div>
            </div>
        </main>
    );
}
