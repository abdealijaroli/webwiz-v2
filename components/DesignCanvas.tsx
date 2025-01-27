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
        if (!iframeRef.current) return;

        const doc = iframeRef.current.contentDocument;
        if (!doc) return;

        // Create a complete HTML document with proper structure
        const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            /* Reset default styles */
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            /* Base styles */
            body {
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.5;
              padding: 1rem;
            }

            /* Custom styles */
            ${css || ""}
          </style>
        </head>
        <body>
          ${html || "<p>Your website preview will appear here...</p>"}
          <script>
            try {
              ${javascript || ""}
            } catch (error) {
              console.error('Preview JavaScript error:', error);
            }
          </script>
        </body>
      </html>
    `;

        // Write the content to the iframe
        doc.open();
        doc.write(htmlContent);
        doc.close();
    }, [html, css, javascript]);

    return (
        <div className="w-full h-[600px] bg-background border rounded-lg overflow-hidden">
            <iframe
                ref={iframeRef}
                className="w-full h-full"
                sandbox="allow-scripts allow-same-origin"
                title="Website Preview"
            />
        </div>
    );
}
