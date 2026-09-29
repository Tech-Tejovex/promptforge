"use client";

import { Folder } from "lucide-react";
import { useUIStore } from "@/lib/store/uiStore";

export default function FolderAssignment({ value, onChange }: { value?: string, onChange: (id: string) => void }) {
  const { folders } = useUIStore();

  return (
    <div className="flex items-center gap-2">
      <Folder className="w-4 h-4 text-text-secondary" />
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="bg-void border border-glass-border rounded-md p-1 text-sm text-text-secondary focus:outline-none"
      >
        <option value="">No Folder</option>
        {folders.map((folder) => (
          <option key={folder.id} value={folder.id}>
            {folder.name}
          </option>
        ))}
      </select>
    </div>
  );
}
