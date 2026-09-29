"use client";
import { useState, useEffect } from "react";
import GlassCard from "@/components/shared/GlassCard";
import NoiseOverlay from "@/components/shared/NoiseOverlay";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const [stats, setStats] = useState<{
    total: number;
    optimizedPercent: number;
    byProfession: { name: string; count: number }[];
    recentActivity: { date: string; count: number }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/prompts/stats")
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load dashboard stats");
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-void text-text-primary p-6 pt-10 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-text-muted" />
    </div>
  );

  if (!stats) return (
    <div className="min-h-screen bg-void text-text-primary p-6 pt-10">
      <h1>Failed to load dashboard</h1>
    </div>
  );

  return (
    <div className="min-h-screen bg-void text-text-primary p-6 pt-10">
      <NoiseOverlay />
      <h1 className="font-serif text-4xl mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 col-span-2">
          <h2 className="text-lg mb-6 font-medium text-text-secondary">Usage by Profession</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.byProfession}>
                <XAxis dataKey="name" stroke="#666" tick={{fontSize: 12}} />
                <YAxis stroke="#666" tick={{fontSize: 12}} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#030303', border: '1px solid #333', borderRadius: '12px' }}
                  cursor={{fill: 'rgba(255,255,255,0.03)'}}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {stats.byProfession.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#fff" : "#aaa"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <div className="space-y-6">
            <GlassCard className="p-6 flex flex-col justify-center">
                <span className="text-text-muted text-sm uppercase">Total Prompts</span>
                <span className="text-4xl font-serif mt-2">{stats.total}</span>
            </GlassCard>
            <GlassCard className="p-6 flex flex-col justify-center">
                <span className="text-text-muted text-sm uppercase">Optimized %</span>
                <span className="text-4xl font-serif mt-2">{stats.optimizedPercent}%</span>
            </GlassCard>
        </div>
      </div>
    </div>
  );
}
