"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Sparkles, ArrowRight, Shield, User, Briefcase, Code, PenTool, BookOpen, Music, Camera, Megaphone, Save, Loader2, Mic } from "lucide-react";
import { toast, Toaster } from "sonner";
import GlassCard from "@/components/shared/GlassCard";
import NoiseOverlay from "@/components/shared/NoiseOverlay";
import FolderAssignment from "@/components/shared/FolderAssignment";

const categories = [
  { name: "Legal", icon: Shield, desc: "Contracts, compliance, litigation briefs" },
  { name: "Marketing", icon: Megaphone, desc: "Campaigns, copy, brand messaging" },
  { name: "Engineering", icon: Code, desc: "Specs, docs, architecture plans" },
  { name: "Healthcare", icon: User, desc: "Clinical notes, patient communication" },
  { name: "Education", icon: BookOpen, desc: "Lesson plans, assessments, syllabi" },
  { name: "Finance", icon: Briefcase, desc: "Reports, forecasts, investor updates" },
  { name: "Design", icon: PenTool, desc: "UX/UI copy, design systems, brand guidelines" },
  { name: "Media", icon: Camera, desc: "Scripts, production notes, social content" },
  { name: "Creative", icon: Music, desc: "Songwriting, storyboarding, creative concepts" },
  { name: "Product Management", icon: Briefcase, desc: "Roadmaps, PRDs, user stories" },
  { name: "Sales", icon: Megaphone, desc: "Outreach, proposals, negotiations" },
  { name: "Real Estate", icon: BookOpen, desc: "Listings, client comms, market analysis" },
  { name: "Human Resources", icon: User, desc: "Job descriptions, policies, evaluations" },
  { name: "Consulting", icon: Briefcase, desc: "Strategy decks, client reports" },
  { name: "Data Science", icon: Code, desc: "Analysis, modeling, data storytelling" },
];

export default function ForgePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [idea, setIdea] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [variableMap, setVariableMap] = useState<string[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isForging, setIsForging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [savedPromptId, setSavedPromptId] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string>("");
  const [customCategory, setCustomCategory] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [categoriesList, setCategoriesList] = useState(categories);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setIdea((prev) => prev + " " + transcript);
      };
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const handleForge = useCallback(async () => {
    if (!selected || !idea.trim() || isForging) return;

    setIsForging(true);
    setOutput(null);
    setSavedPromptId(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ profession: selected, input: idea })
      });
      const data = await response.json();
      const baseOutput = data.result || "Generation failed.";
      setOutput(baseOutput);

      // Parse variables
      const matches: RegExpMatchArray | null = baseOutput.match(/\{\{(.*?)\}\}/g);
      if (matches) {
        const uniqueVars: string[] = Array.from(new Set(matches.map((m: string) => m.replace(/[\{\}]/g, ""))));
        setVariableMap(uniqueVars);
        setVariables(uniqueVars.reduce((acc: Record<string, string>, v: string) => ({ ...acc, [v]: "" }), {}));
      } else {
        setVariableMap([]);
        setVariables({});
      }

      // Auto-save to database
      try {
        const saveRes = await fetch('/api/prompts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            input: idea,
            output: baseOutput,
            profession: selected,
            folder_id: selectedFolder || null,
          })
        });
        const saveData = await saveRes.json();
        if (saveData.prompt?.id) {
          setSavedPromptId(saveData.prompt.id);
          toast.success("Prompt forged & saved!");
        } else { console.log("No prompt ID returned by API:", saveData);
          toast.success("Prompt forged!");
        }
      } catch (e: any) {
        console.error("Save error:", e);
        toast.error("Failed to save: " + (e.message || "Check console"));
      }
    } catch (e: any) {
      toast.error("Generation failed: " + (e.message || "Unknown error"));
    } finally {
      setIsForging(false);
    }
  }, [selected, idea, isForging, selectedFolder]);

  const handleOptimize = useCallback(async () => {
    if (!output || isOptimizing) return;
    setIsOptimizing(true);

    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          prompt: output,
          instructions: "Make it more detailed, structured, and professional.",
        })
      });
      const data = await response.json();
      if (data.result) {
        setOutput(data.result);
        toast.success("Prompt optimized!");

        // Update saved prompt if we have an ID
        if (savedPromptId) {
          await fetch('/api/prompts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              input: idea,
              output: data.result,
              profession: selected,
              folder_id: selectedFolder || null,
            })
          });
        }
      }
    } catch {
      toast.error("Optimization failed");
    } finally {
      setIsOptimizing(false);
    }
  }, [output, isOptimizing, savedPromptId, idea, selected, selectedFolder]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleForge();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault();
        handleOptimize();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleForge, handleOptimize]);

  const updateVariable = (key: string, value: string) => {
    setVariables(prev => ({ ...prev, [key]: value }));
  };

  const getResolvedOutput = () => {
    if (!output) return "";
    return Object.entries(variables).reduce(
      (acc, [key, val]) => acc.replace(new RegExp(`{{${key}}}`, 'g'), val || `{{${key}}}`),
      output
    );
  };

  return (
    <div className="min-h-screen bg-void text-text-primary overflow-x-hidden">
      <Toaster theme="dark" position="top-right" />
      <NoiseOverlay />
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-[#1a1a1a] via-[#030303] to-transparent opacity-50 blur-[120px]" />
      </div>
      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-28 pb-20">
        <div className="mb-12">
          <h1 className="font-serif text-5xl md:text-7xl font-medium leading-[0.9] tracking-tight mb-4">The Forge</h1>
          <p className="text-text-secondary text-lg">Select your profession, describe your idea, and forge a world-class prompt.</p>
        </div>

        <GlassCard className="p-8 md:p-10">
          <div className="space-y-2 mb-6">
            <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-text-muted tracking-wide uppercase">Profession / Category</label>
                <FolderAssignment value={selectedFolder} onChange={setSelectedFolder} />
            </div>
            <div className="flex flex-wrap gap-3">
              {categoriesList.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelected(cat.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm border transition-all ${
                    selected === cat.name
                      ? "bg-white text-void border-white shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                      : "bg-glass border-glass-border text-text-secondary hover:text-white hover:border-glow"
                  }`}
                >
                  <cat.icon className="w-4 h-4" /> {cat.name}
                </button>
              ))}
              {isAdding ? (
                  <div className="flex gap-2">
                    <input
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="Name..."
                        className="px-4 py-2 rounded-full text-sm bg-glass border border-glow text-text-primary focus:outline-none"
                    />
                    <button
                        onClick={() => {
                            if (customCategory.trim()) {
                                const newCat = { name: customCategory, icon: Briefcase, desc: "Custom profession" };
                                setCategoriesList([...categoriesList, newCat]);
                                setSelected(newCat.name);
                                setCustomCategory("");
                                setIsAdding(false);
                            }
                        }}
                        className="px-4 py-2 rounded-full text-sm bg-glow text-void font-medium"
                    >
                        Add
                    </button>
                  </div>
              ) : (
                <button
                    onClick={() => setIsAdding(true)}
                    className="px-4 py-2 rounded-full text-sm bg-glass border border-dashed border-text-muted text-text-secondary hover:border-text-primary hover:text-white transition-all"
                >
                    + Custom
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="idea" className="text-xs font-medium text-text-muted tracking-wide uppercase">Your Raw Idea</label>
              <button
                onClick={toggleRecording}
                className={`p-1.5 rounded-full transition-all ${
                  isRecording ? "bg-red-500/20 text-red-500 animate-pulse" : "bg-white/5 text-text-muted hover:text-white"
                }`}
                title="Toggle Voice Input"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>
            <textarea
              id="idea"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Write an email about the new policy..."
              className="w-full p-4 rounded-2xl bg-deep border border-glass-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-glow focus:ring-1 focus:ring-glow transition-all duration-300 min-h-[120px] resize-none"
            />
          </div>

          <button
            onClick={handleForge}
            disabled={!selected || !idea.trim() || isForging}
            className="w-full bg-white text-void py-4 rounded-full font-bold text-base shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:bg-[#f0f0f0] hover:shadow-[0_0_50px_rgba(255,255,255,0.35)] transition-all duration-500 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
          >
            {isForging ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Forging...</>
            ) : (
              <>Forge Prompt <ArrowRight className="w-4 h-4" /></>
            )}
          </button>

          {variableMap.length > 0 && (
            <div className="mt-6 space-y-4">
              <label className="text-xs font-medium text-text-muted tracking-wide uppercase">Fill in variables</label>
              {variableMap.map((v) => (
                <div key={v}>
                  <label className="text-xs text-text-secondary mb-1 block">{v}</label>
                  <input
                    value={variables[v] || ""}
                    onChange={(e) => updateVariable(v, e.target.value)}
                    className="w-full p-3 rounded-xl bg-deep border border-glass-border text-sm text-text-primary focus:border-glow focus:ring-1 focus:ring-glow transition-all"
                  />
                </div>
              ))}
            </div>
          )}

          {output && (
            <div className="mt-8 pt-6 border-t border-glass-border">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-text-muted" />
                  <span className="text-xs font-medium text-text-muted tracking-wide">FORGED OUTPUT</span>
                  {savedPromptId && (
                    <span className="text-xs text-green-400/60 flex items-center gap-1">
                      <Save className="w-3 h-3" /> Saved
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                        navigator.clipboard.writeText(getResolvedOutput());
                        toast.success("Copied to clipboard!");
                    }}
                    className="text-xs px-3 py-1.5 rounded-full bg-glass border border-glass-border hover:border-text-primary transition-all text-text-secondary"
                  >
                    Copy Text
                  </button>
                  <button
                    onClick={handleOptimize}
                    disabled={isOptimizing}
                    className="text-xs px-3 py-1.5 rounded-full bg-glass border border-glass-border hover:border-text-primary transition-all text-text-secondary disabled:opacity-50"
                  >
                    {isOptimizing ? (
                      <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Optimizing...</span>
                    ) : "Optimize"}
                  </button>
                  <button
                    onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify({ prompt: getResolvedOutput() }));
                        toast.success("Copied JSON!");
                    }}
                    className="text-xs px-3 py-1.5 rounded-full bg-glass border border-glass-border hover:border-text-primary transition-all text-text-secondary"
                  >
                    Copy JSON
                  </button>
                  <button
                    onClick={() => {
                        const md = `# ${selected} Prompt\n\n${getResolvedOutput()}`;
                        navigator.clipboard.writeText(md);
                        toast.success("Copied Markdown!");
                    }}
                    className="text-xs px-3 py-1.5 rounded-full bg-glass border border-glass-border hover:border-text-primary transition-all text-text-secondary"
                  >
                    Copy MD
                  </button>
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-gradient-to-br from-surface to-deep border border-glass-border whitespace-pre-wrap text-sm text-text-secondary leading-relaxed">
                {getResolvedOutput()}
              </div>
            </div>
          )}
        </GlassCard>
      </main>
    </div>
  );
}
