"use client";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("App error caught:", error);
  }, [error]);
  return (
    <div className="min-h-screen bg-void text-white flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-serif">Something went wrong</h2>
        <p className="text-text-secondary">{error.message || "Unknown error occurred."}</p>
        <button onClick={reset} className="bg-white text-void px-6 py-3 rounded-full font-bold hover:bg-[#f0f0f0] transition">Try Again</button>
      </div>
    </div>
  );
}
