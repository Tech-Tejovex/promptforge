import { create } from "zustand";

interface UIState {
  theme: "dark" | "light"; // dark-first product
  isGenerating: boolean;
  folders: any[];
  activeFolder: any | null;
  activeProfession: string | null;
  setTheme: (t: "dark" | "light") => void;
  setGenerating: (v: boolean) => void;
  setFolders: (f: any[]) => void;
  setActiveFolder: (f: any | null) => void;
  setActiveProfession: (p: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: "dark",
  isGenerating: false,
  folders: [],
  activeFolder: null,
  activeProfession: null,
  setTheme: (t) => set({ theme: t }),
  setGenerating: (v) => set({ isGenerating: v }),
  setFolders: (f) => set({ folders: f }),
  setActiveFolder: (f) => set({ activeFolder: f, activeProfession: null }),
  setActiveProfession: (p) => set({ activeProfession: p, activeFolder: null }),
}));
