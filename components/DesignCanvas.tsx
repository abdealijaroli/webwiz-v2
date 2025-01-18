"use client";

import { useEffect, useRef } from "react";

interface DesignCanvasProps {
    html?: string;
    css?: string;
    javascript?: string;
}

export default function DesignCanvas({
    html,
    css,
    javascript,
}: DesignCanvasProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (iframeRef.current) {
            const doc = iframeRef.current.contentDocument;
            if (doc) {
                doc.open();
                doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body {
                  margin: 0;
                  padding: 20px;
                  font-family: system-ui, -apple-system, sans-serif;
                }
                ${css || ""}
              </style>
            </head>
            <body>
              ${html || "<p>Your website preview will appear here...</p>"}
              <script>
                ${javascript || ""}
              </script>
            </body>
          </html>
        `);
                doc.close();
            }
        }
    }, [html, css, javascript]);

    return (
        <div className="w-full h-[600px] bg-background border rounded-lg overflow-hidden">
            <iframe
                ref={iframeRef}
                className="w-full h-full"
                sandbox="allow-scripts"
            />
        </div>
    );
}
