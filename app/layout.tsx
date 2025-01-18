import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ApolloProvider } from "./ApolloProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "WebWiz V2",
    description: "AI-powered web design platform",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ApolloProvider>{children}</ApolloProvider>
                <Toaster />
            </body>
        </html>
    );
}
