import { Sparkles } from "lucide-react";

export interface Profession {
  id: string;
  label: string;
  description: string;
  icon: string;
  color: string;
}

export const professions: Profession[] = [
  { id: "medical", label: "Medical", description: "Clinical analysis, patient communication, research summaries", icon: "HeartPulse", color: "#FF6B6B" },
  { id: "legal", label: "Legal", description: "Contract drafting, case analysis, compliance review", icon: "Scale", color: "#F0C040" },
  { id: "academic", label: "Academic / Study", description: "Essay outlines, research synthesis, study guides", icon: "GraduationCap", color: "#A78BFA" },
  { id: "marketing", label: "Marketing", description: "Campaign strategy, copywriting, audience targeting", icon: "Megaphone", color: "#4ADE80" },
  { id: "engineering", label: "Software Engineering", description: "Architecture docs, code reviews, spec writing", icon: "Code", color: "#38BDF8" },
  { id: "finance", label: "Finance", description: "Investment reports, risk analysis, forecasting", icon: "Landmark", color: "#10B981" },
  { id: "creative", label: "Creative Writing", description: "Story arcs, character development, dialogue", icon: "PenTool", color: "#F472B6" },
  { id: "education", label: "Education", description: "Lesson plans, curriculum design, assessments", icon: "BookOpen", color: "#60A5FA" },
  { id: "research", label: "Research", description: "Literature reviews, data interpretation", icon: "FileText", color: "#C084FC" },
  { id: "support", label: "Customer Support", description: "Ticket resolution, escalation templates", icon: "Headphones", color: "#FB7185" },
  { id: "business", label: "Business", description: "Strategic planning, pitch decks, operations", icon: "Briefcase", color: "#FBBF24" },
  { id: "general", label: "General Purpose", description: "Universal prompts, ideation, brainstorming", icon: "BrainCircuit", color: "#FFFFFF" },
];
