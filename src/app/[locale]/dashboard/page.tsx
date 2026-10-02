"use client";
import { useState, useEffect } from "react";
import GlassCard from "@/components/shared/GlassCard";
import NoiseOverlay from "@/components/shared/NoiseOverlay";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area, PieChart, Pie,
  RadialBarChart, RadialBar
} from "recharts";
import { Loader2, TrendingUp, Zap, Clock, Target, Download } from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get current user ID from Supabase auth
    fetch("/api/auth/session", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.user?.id) {
          setUserId(data.user.id);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/prompts/stats?userId=${userId}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load analytics");
        setLoading(false);
      });
  }, [userId]);

  if (loading) return (
    <div className="min-h-screen bg-void text-text-primary p-6 pt-10 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-text-muted" />
    </div>
  );

  if (!stats) return (
    <div className="min-h-screen bg-void text-text-primary p-6 pt-10">
      <h1 className="font-serif text-4xl mb-4">Analytics</h1>
      <p>Failed to load analytics.</p>
    </div>
  );

  const goldPalette = ["#C9B38B", "#8A7F6A", "#A89884", "#D4C6A8", "#7A6A5A"];

  return (
    <div className="min-h-screen bg-void text-text-primary p-6 pt-10">
      <NoiseOverlay />
      <h1 className="font-serif text-5xl mb-2">Analytics</h1>
      <p className="text-text-muted mb-10">Your prompt performance at a glance.</p>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-3 text-gold">
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs uppercase tracking-widest font-medium">Total Prompts</span>
          </div>
          <span className="text-5xl font-serif">{stats.total}</span>
        </GlassCard>
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-3 text-gold">
            <Zap className="w-5 h-5" />
            <span className="text-xs uppercase tracking-widest font-medium">Optimized %</span>
          </div>
          <span className="text-5xl font-serif">{stats.optimizedPercent}%</span>
          <div className="w-full h-2 bg-steel rounded-full mt-4 overflow-hidden">
            <div className="h-2 bg-gold rounded-full" style={{ width: `${stats.optimizedPercent}%` }} />
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-3 text-gold">
            <Clock className="w-5 h-5" />
            <span className="text-xs uppercase tracking-widest font-medium">Avg / Day</span>
          </div>
          <span className="text-5xl font-serif">{stats.recentActivity ? Math.round(stats.recentActivity.reduce((a: number, b: any) => a + b.count, 0) / 7) : 0}</span>
        </GlassCard>
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-3 text-gold">
            <Target className="w-5 h-5" />
            <span className="text-xs uppercase tracking-widest font-medium">Top Category</span>
          </div>
          <span className="text-2xl font-serif truncate">{stats.byProfession?.[0]?.name || "—"}</span>
        </GlassCard>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Usage by Profession - Bar */}
        <GlassCard className="p-6">
          <h2 className="text-lg mb-6 font-medium text-text-secondary">Usage by Profession</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.byProfession}>
                <XAxis dataKey="name" stroke="#666" tick={{ fontSize: 11 }} interval={0} angle={-30} textAnchor="end" height={60} />
                <YAxis stroke="#666" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0A0A0B", border: "1px solid #1F1F22", borderRadius: "12px", color: "#F5F2EB" }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#C9B38B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Recent Activity - Line */}
        <GlassCard className="p-6">
          <h2 className="text-lg mb-6 font-medium text-text-secondary">Recent Activity</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.recentActivity}>
                <XAxis dataKey="date" stroke="#666" tick={{ fontSize: 11 }} />
                <YAxis stroke="#666" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0A0A0B", border: "1px solid #1F1F22", borderRadius: "12px", color: "#F5F2EB" }}
                />
                <Area type="monotone" dataKey="count" stroke="#C9B38B" fill="#C9B38B" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Bottom Row: Trend + Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Optimization Rate - Radial */}
        <GlassCard className="p-6">
          <h2 className="text-lg mb-4 font-medium text-text-secondary">Optimization Rate</h2>
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: "Optimized", value: stats.optimizedPercent, fill: "#C9B38B" },
                    { name: "Standard", value: 100 - stats.optimizedPercent, fill: "#161618" },
                  ]}
                  cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                  dataKey="value"
                  labelLine={false}
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 text-xs text-text-muted mt-2">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gold" /> Optimized</span>
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-charcoal" /> Standard</span>
          </div>
        </GlassCard>

        {/* Profession Distribution */}
        <GlassCard className="p-6 col-span-2">
          <h2 className="text-lg mb-4 font-medium text-text-secondary">Profession Distribution</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={stats.byProfession}>
                <XAxis type="number" stroke="#666" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" stroke="#F5F2EB" tick={{ fontSize: 11 }} width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0A0A0B", border: "1px solid #1F1F22", borderRadius: "12px", color: "#F5F2EB" }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} fill="#C9B38B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Export */}
      <GlassCard className="p-6 flex items-center justify-between">
        <div>
          <h3 className="font-medium text-text-primary">Export Data</h3>
          <p className="text-sm text-text-muted">Download your analytics as CSV for further analysis.</p>
        </div>
        <button
          onClick={() => {
            const csv = "date,count\n" + stats.recentActivity.map((r: any) => `${r.date},${r.count}`).join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "promptforge-analytics.csv";
            a.click();
            URL.revokeObjectURL(url);
            toast.success("Analytics exported");
          }}
          className="magnetic-btn inline-flex items-center gap-2.5 bg-white text-void px-6 py-2.5 rounded-full font-medium text-sm hover:bg-gold hover:text-void transition-all duration-300 shadow-[0_0_20px_rgba(201,179,139,0.2)]"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </GlassCard>
    </div>
  );
}
