"use client";

import { useEffect, useRef } from "react";

export default function DesignCanvas() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <div className="w-full h-[600px] bg-background border rounded-lg overflow-hidden">
      <iframe
        ref={iframeRef}
        className="w-full h-full"
        sandbox="allow-scripts"
        srcDoc={`
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body {
                  margin: 0;
                  padding: 20px;
                  font-family: system-ui, -apple-system, sans-serif;
                }
              </style>
            </head>
            <body>
              <div id="root">
                <p>Your website preview will appear here...</p>
              </div>
            </body>
          </html>
        `}
      />
    </div>
  );
}