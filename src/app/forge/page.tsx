"use client";
import { useState, useEffect } from "react";
import { Sparkles, ArrowRight, Clock, Trash2, Copy } from "lucide-react";
import { supabase } from "@/lib/supabase";

const professions = [
  "Medical", "Legal", "Marketing", "Business", "Software Development",
  "Creative Writing", "Academic", "HR", "Customer Support", "Custom",
];

interface HistoryItem {
  id: string;
  profession: string;
  input: string;
  output: string;
  date: string;
}

export default function ForgePage() {
  const [selected, setSelected] = useState("Medical");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filterProf, setFilterProf] = useState<string>("All");
  // Per-user tracking via local identifier (no Clerk dependency)
  const [userId] = useState(() => typeof window !== "undefined" ? localStorage.getItem("pf-user-id") || (() => { const id = Math.random().toString(36).slice(2); localStorage.setItem("pf-user-id", id); return id; })() : "anon");

  useEffect(() => {
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from("prompts")
        .select("id, profession, input, output, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (!error && data) {
        setHistory(
          data.map((d: any) => ({
            id: d.id,
            profession: d.profession,
            input: d.input,
            output: d.output,
            date: d.created_at,
          }))
        );
      }
    };
    fetchHistory();
  }, [userId]);

  const generate = async () => {
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profession: selected, input }),
      });
      const apiData = await res.json();
      const resultText = apiData.result || "No response from AI.";
      setOutput(resultText);
      await supabase.from("prompts").insert({
        user_id: userId,
        profession: selected,
        input,
        output: resultText,
        created_at: new Date().toISOString(),
      });
      const { data: refreshedData, error } = await supabase
        .from("prompts")
        .select("id, profession, input, output, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (!error && refreshedData) {
        setHistory(
          refreshedData.map((d: any) => ({
            id: d.id,
            profession: d.profession,
            input: d.input,
            output: d.output,
            date: d.created_at,
          }))
        );
      }
    } catch (e: any) {
      setOutput("Error: " + (e.message || String(e)));
    }
    setLoading(false);
  };

  const deleteItem = async (id: string) => {
    await supabase.from("prompts").delete().eq("id", id).eq("user_id", userId);
    setHistory((prev) => prev.filter((h) => h.id !== id));
  };

  const copyItem = async (item: HistoryItem) => {
    const text = `Profession: ${item.profession}\nInput: ${item.input}\nOutput: ${item.output}`;
    await navigator.clipboard.writeText(text);
  };

  const filteredHistory = filterProf === "All" ? history : history.filter((h) => h.profession === filterProf);
  const categories = ["All", ...professions];

  return (
    <div className="min-h-screen bg-void text-text-primary px-6 py-16 max-w-6xl mx-auto">
      <a href="/" className="inline-flex items-center gap-2 mb-4 text-sm text-text-muted hover:text-text-primary transition-colors">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
        Home
      </a>
      <h1 className="text-5xl md:text-7xl font-serif mb-4">The Forge</h1>
      <p className="text-text-muted mb-12">Generate expert-level prompts. Saved per-user to Supabase.</p>

      <section className="mb-16">
        <h2 className="text-xl font-semibold mb-4">Select Profession</h2>
        <div className="grid md:grid-cols-5 gap-3 mb-6">
          {professions.map((p) => (
            <button
              key={p}
              onClick={() => setSelected(p)}
              className={`px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
                selected === p ? "bg-white text-void border-white" : "bg-transparent border-glass-border text-text-secondary hover:border-glow"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your raw idea..."
          className="w-full h-40 p-6 rounded-3xl bg-deep border border-glass-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-glow mb-6 resize-none"
        />
        <button
          onClick={generate}
          disabled={loading || !input.trim()}
          className="bg-gradient-to-r from-violet-500 to-cyan-400 text-white px-8 py-4 rounded-full font-bold shadow-[0_0_40px_rgba(139,92,246,0.35)] hover:shadow-[0_0_60px_rgba(139,92,246,0.5)] transition-all flex items-center gap-2 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Sparkles className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
          {loading ? "Forging..." : "Generate Expert Prompt"}
        </button>
      </section>

      {output && (
        <section className="mb-16">
          <h2 className="text-xl font-semibold mb-4">Generated Prompt</h2>
          <div className="p-8 rounded-3xl bg-glass border border-glass-border backdrop-blur-xl whitespace-pre-wrap text-text-secondary leading-relaxed">
            {output}
          </div>
        </section>
      )}

      <section className="border-t border-glass-border pt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-serif mb-1">History</h2>
            <p className="text-text-muted text-sm">Saved to Supabase per user.</p>
          </div>
          <span className="text-xs text-text-muted bg-deep px-3 py-1 rounded-full border border-glass-border">{history.length} saved</span>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterProf(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                filterProf === cat ? "bg-white text-void border-white" : "bg-transparent border-glass-border text-text-secondary hover:border-glow"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-text-muted border border-glass-border rounded-3xl bg-deep">
              <Clock className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p>No prompts saved in {filterProf === "All" ? "any category" : filterProf} yet.</p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div key={item.id} className="group p-6 rounded-3xl bg-deep border border-glass-border hover:border-glow transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-glass border border-glass-border text-xs font-medium text-text-secondary">{item.profession}</span>
                      <span className="text-xs text-text-muted">{new Date(item.date).toLocaleString()}</span>
                    </div>
                    <h4 className="font-medium text-text-primary mb-1 truncate">{item.input}</h4>
                    <p className="text-sm text-text-secondary line-clamp-2">{item.output}</p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => copyItem(item)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-cyan-400 p-2 hover:bg-cyan-400/10 rounded-xl"
                      title="Copy full prompt"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-text-muted hover:text-red-400 p-2 hover:bg-red-400/10 rounded-xl"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
