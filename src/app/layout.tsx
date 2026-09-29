import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NoiseOverlay from "@/components/shared/NoiseOverlay";
import Live3DBackground from "@/components/shared/Live3DBackground";
import LuxuryCursor from "@/components/shared/LuxuryCursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PromptForge — Ultra-Premium AI Prompt Generator",
  description: "Transform raw ideas into world-class AI prompts with cinematic design and AI-powered engineering.",
  openGraph: {
    title: "PromptForge",
    description: "The ultimate workspace for professional prompt engineering.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-void text-text-primary`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <LuxuryCursor />
        <Live3DBackground />
        <NoiseOverlay />
        {children}
      </body>
    </html>
  );
}
