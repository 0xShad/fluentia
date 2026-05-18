"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DashboardSkeleton } from "./components/dashboard-skeleton";
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, Target, TrendingUp } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar, BarChart, CartesianGrid, XAxis, YAxis,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import { createClient } from "@/lib/client";

interface SessionRow {
  overall_score: number;
  elapsed_seconds: number;
  category: string;
  categories: { name: string; score: number; feedback: string }[];
  created_at: string;
}

const SKILL_NAMES = ["Clarity", "Relevance", "Conciseness"];
const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDuration(seconds: number): string {
  if (seconds <= 0) return "0m";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

function avg(nums: number[]): number {
  if (!nums.length) return 0;
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}

const radarConfig = { A: { label: "Score", color: "#00F38D" } } satisfies ChartConfig;
const categoryConfig = { score: { label: "Avg Score", color: "#00F38D" } } satisfies ChartConfig;
const monthlyConfig = {
  target: { label: "Target (70)", color: "#6366f1" },
  actual: { label: "Actual Score", color: "#00F38D" },
} satisfies ChartConfig;

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<SessionRow[]>([]);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("session_feedback")
        .select("overall_score, elapsed_seconds, category, categories, created_at")
        .order("created_at", { ascending: true });
      if (data) setSessions(data as SessionRow[]);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <DashboardSkeleton />;

  // ── Date buckets ──────────────────────────────────────────────────────────
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const lastMonthDate = new Date(thisYear, thisMonth - 1, 1);

  const inMonth = (s: SessionRow, month: number, year: number) => {
    const d = new Date(s.created_at);
    return d.getMonth() === month && d.getFullYear() === year;
  };
  const thisMonthSessions = sessions.filter(s => inMonth(s, thisMonth, thisYear));
  const lastMonthSessions = sessions.filter(s =>
    inMonth(s, lastMonthDate.getMonth(), lastMonthDate.getFullYear())
  );

  // ── Stat card values ──────────────────────────────────────────────────────
  const totalSeconds = sessions.reduce((sum, s) => sum + (s.elapsed_seconds || 0), 0);
  const sessionCount = sessions.length;
  const avgOverall = avg(sessions.map(s => s.overall_score));

  const thisMonthTime = thisMonthSessions.reduce((sum, s) => sum + (s.elapsed_seconds || 0), 0);
  const lastMonthTime = lastMonthSessions.reduce((sum, s) => sum + (s.elapsed_seconds || 0), 0);
  const timeChange = pctChange(thisMonthTime, lastMonthTime);
  const countChange = pctChange(thisMonthSessions.length, lastMonthSessions.length);
  const scoreChange = pctChange(
    avg(thisMonthSessions.map(s => s.overall_score)),
    avg(lastMonthSessions.map(s => s.overall_score))
  );

  // ── Radar chart: avg per skill across all sessions ─────────────────────
  const skillBuckets: Record<string, number[]> = Object.fromEntries(SKILL_NAMES.map(s => [s, []]));
  for (const session of sessions) {
    if (!Array.isArray(session.categories)) continue;
    for (const cat of session.categories) {
      if (skillBuckets[cat.name] !== undefined) skillBuckets[cat.name].push(cat.score);
    }
  }
  const radarData = SKILL_NAMES.map(skill => ({
    skill,
    A: avg(skillBuckets[skill]),
    fullMark: 100,
  }));
  const weakestSkill = sessionCount > 0
    ? radarData.reduce((min, cur) => cur.A < min.A ? cur : min).skill
    : null;

  // ── Category bar chart: avg overall_score per scenario category ────────
  const catBuckets: Record<string, number[]> = {};
  for (const session of sessions) {
    if (!catBuckets[session.category]) catBuckets[session.category] = [];
    catBuckets[session.category].push(session.overall_score);
  }
  const categoryScores = Object.entries(catBuckets)
    .map(([category, scores]) => ({ category, score: avg(scores) }))
    .sort((a, b) => b.score - a.score);

  // ── Monthly trend: avg overall_score per month for last 12 months ──────
  const monthlyBuckets = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(thisYear, thisMonth - 11 + i, 1);
    return {
      month: MONTH_LABELS[d.getMonth()],
      key: `${d.getFullYear()}-${d.getMonth()}`,
      scores: [] as number[],
    };
  });
  for (const session of sessions) {
    const d = new Date(session.created_at);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const bucket = monthlyBuckets.find(b => b.key === key);
    if (bucket) bucket.scores.push(session.overall_score);
  }
  const monthlyData = monthlyBuckets.map(({ month, scores }) => ({
    month,
    actual: avg(scores) || 0,
    target: 70,
  }));

  // ── Shared change indicator ───────────────────────────────────────────────
  function ChangeLabel({ change, emptyMsg }: { change: number | null; emptyMsg: string }) {
    if (change === null) return <p className="text-xs text-muted-foreground mt-1">{emptyMsg}</p>;
    const up = change >= 0;
    return (
      <p className={`text-xs flex items-center mt-1 ${up ? "text-[#00F38D]" : "text-red-500"}`}>
        {up ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
        {Math.abs(change)}% from last month
      </p>
    );
  }

  return (
    <div className="flex-1 p-6 md:p-8 space-y-6 animate-in fade-in duration-500 w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
          Fluentia <span className="text-[#00F38D]">AI</span> Dashboard
        </h2>
        <p className="text-muted-foreground text-sm">Overview of your communication progress and active sessions.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Practice Time",
            icon: <Clock className="h-4 w-4 text-[#00F38D]" />,
            value: <div className="text-3xl font-bold text-[#00F38D]">{formatDuration(totalSeconds)}</div>,
            sub: <ChangeLabel change={timeChange} emptyMsg="No sessions last month" />,
          },
          {
            label: "Sessions Completed",
            icon: <CheckCircle2 className="h-4 w-4 text-[#00F38D]" />,
            value: <div className="text-3xl font-bold text-[#00F38D]">{sessionCount}</div>,
            sub: <ChangeLabel change={countChange} emptyMsg="No sessions last month" />,
          },
          {
            label: "Focus Area",
            icon: <Target className="h-4 w-4 text-yellow-400" />,
            value: <div className="text-3xl font-bold text-yellow-400">{weakestSkill ?? "—"}</div>,
            sub: (
              <p className="text-xs flex items-center mt-1 text-yellow-500">
                <ArrowDownRight className="w-3 h-3 mr-1" />
                {weakestSkill ? "Your lowest scoring skill" : "Complete a session first"}
              </p>
            ),
          },
          {
            label: "Avg Overall Score",
            icon: <TrendingUp className="h-4 w-4 text-[#00F38D]" />,
            value: <div className="text-3xl font-bold text-[#00F38D]">{sessionCount > 0 ? `${avgOverall}%` : "—"}</div>,
            sub: sessionCount > 0
              ? <ChangeLabel change={scoreChange} emptyMsg="No data from last month" />
              : <p className="text-xs text-muted-foreground mt-1">Complete a session to see stats</p>,
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          >
            <Card className="bg-[#111] border-white/10 hover:border-[#00F38D]/20 text-white transition-[colors,border-color] relative overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-linear-to-br from-[#00F38D]/0 to-[#00F38D]/0 group-hover:from-[#00F38D]/3 transition-[background] duration-300 pointer-events-none" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <div className="p-2 bg-white/5 rounded-md group-hover:bg-[#00F38D]/10 transition-colors duration-200">
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent className="relative">
                {stat.value}
                {stat.sub}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.36, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"
      >
        <Card className="bg-[#111] border-white/10 text-white col-span-3 relative overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-[#00F38D] inline-block" />
              Skill Breakdown
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              {sessionCount > 0 ? "Your average communication profile across all sessions" : "Complete a session to see your skill profile"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-0 pb-6 pt-4">
            <ChartContainer config={radarConfig} className="mx-auto aspect-4/3 max-h-75 w-full">
              <RadarChart data={radarData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <PolarGrid gridType="polygon" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
                <PolarAngleAxis
                  dataKey="skill"
                  tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 500 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Score"
                  dataKey="A"
                  stroke="#00F38D"
                  strokeWidth={2}
                  fill="#00F38D"
                  fillOpacity={0.15}
                />
              </RadarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-[#111] border-white/10 text-white col-span-4 flex flex-col justify-between relative overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-[#00F38D] inline-block" />
              Score by Category
            </CardTitle>
            <CardDescription className="text-muted-foreground">Average overall score per scenario type</CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            {categoryScores.length > 0 ? (
              <ChartContainer config={categoryConfig} className="h-65 w-full">
                <BarChart
                  data={categoryScores}
                  layout="vertical"
                  margin={{ left: 20, right: 20, top: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: "#666", fontSize: 11 }} orientation="bottom" />
                  <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{ fill: "#aaa", fontSize: 13 }} width={120} />
                  <ChartTooltip cursor={{ fill: "rgba(255,255,255,0.02)" }} content={<ChartTooltipContent />} />
                  <Bar dataKey="score" fill="#00F38D" radius={[0, 10, 10, 0]} barSize={12} activeBar={{ fill: "#00F38D" }} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-65 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Complete sessions to see category scores</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Monthly trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.44, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
      >
      <Card className="bg-[#111] border-white/10 text-white relative overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <span className="w-1.5 h-5 rounded-full bg-[#00F38D] inline-block" />
            Score Trend
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Monthly average score vs. 70-point target over the last 12 months.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={monthlyConfig} className="h-80 w-full mt-4">
            <BarChart data={monthlyData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 12 }} dy={15} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#888", fontSize: 12 }} domain={[0, 100]} />
              <ChartTooltip cursor={{ fill: "rgba(255,255,255,0.02)" }} content={<ChartTooltipContent indicator="dashed" />} />
              <Bar dataKey="target" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={8} />
              <Bar dataKey="actual" fill="#00F38D" radius={[8, 8, 0, 0]} barSize={8} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      </motion.div>
    </div>
  );
}
