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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-void/30 backdrop-blur-xl border-b border-glass-border/30 transition-all duration-700">
      <div className="max-w-7xl mx-auto px-8 h-[72px] flex items-center justify-between">
        <Link href="/" className="font-serif text-2xl font-medium tracking-tight text-text-primary hover:text-gold transition-colors duration-500">
          PromptForge
        </Link>
        <div className="flex gap-10">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className="magnetic-btn flex items-center gap-2.5 text-[13px] font-medium tracking-wide uppercase text-text-secondary hover:text-gold golden-hover transition-all duration-300 px-3 py-1.5 rounded-full border border-transparent hover:border-gold/20"
            >
              <link.icon className="w-3.5 h-3.5" strokeWidth={1.5} />
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
