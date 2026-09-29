"use client";
import Link from "next/link";
import { Sparkles, BarChart3, History, Settings } from "lucide-react";
import { useLocale } from "next-intl";

export default function Navbar() {
  const locale = useLocale();
  const links = [
    { name: "Forge", path: `/${locale}/dashboard/forge`, icon: Sparkles },
    { name: "Analytics", path: `/${locale}/dashboard`, icon: BarChart3 },
    { name: "History", path: `/${locale}/dashboard/history`, icon: History },
    { name: "Settings", path: `/${locale}/dashboard/settings`, icon: Settings },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-void/50 backdrop-blur-md border-b border-glass-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl font-bold">PromptForge</Link>
        <div className="flex gap-6">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className="flex items-center gap-2 text-sm text-text-secondary hover:text-white transition-colors"
            >
              <link.icon className="w-4 h-4" />
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
