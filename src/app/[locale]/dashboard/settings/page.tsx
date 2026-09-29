"use client";
import { useState, useEffect } from "react";
import { User, LogOut, Settings, Mail, Shield, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { supabase } from "@/lib/supabase";
import GlassCard from "@/components/shared/GlassCard";
import { toast, Toaster } from "sonner";

export default function SettingsPage() {
  const router = useRouter();
  const locale = useLocale();
  const [email, setEmail] = useState("Loading...");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setEmail(user?.email || "No email found");
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to log out: " + error.message);
    } else {
      router.push(`/${locale}/auth/sign-in`);
      toast.success("Successfully logged out");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-void text-text-primary pt-28 px-6 pb-20">
      <Toaster theme="dark" position="top-right" />
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="mb-12">
          <h1 className="font-serif text-4xl font-medium mb-2">Account Settings</h1>
          <p className="text-text-secondary">Manage your profile and security preferences.</p>
        </div>

        <GlassCard className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-glow to-void flex items-center justify-center shadow-lg shadow-glow/20">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-medium">Profile</h2>
              <p className="text-sm text-text-muted">Your personal account details.</p>
            </div>
          </div>

          <div className="grid gap-4 mb-8">
            <div className="p-4 rounded-xl bg-deep border border-glass-border flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-text-muted" />
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wide">Email Address</p>
                  <p className="text-sm font-medium text-text-primary">{email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleLogout}
              disabled={loading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium text-sm transition-all shadow-lg shadow-red-900/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" /> {loading ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </GlassCard>

        <GlassCard className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <Shield className="w-5 h-5 text-glow" />
            <div>
              <h2 className="text-xl font-medium">Security</h2>
              <p className="text-sm text-text-muted">Manage your account security settings.</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-deep border border-glass-border text-sm text-text-muted">
            <p>Row Level Security (RLS) is enabled for your data.</p>
            <p className="mt-1">Your prompts and folders are fully isolated by your user account.</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
