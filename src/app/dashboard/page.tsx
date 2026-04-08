"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DashboardSkeleton } from "./components/dashboard-skeleton";
import { ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, AlertTriangle, TrendingUp } from "lucide-react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

// Mock Data
const radarData = [
  { skill: "Clarity", A: 85, fullMark: 100 },
  { skill: "Pacing", A: 70, fullMark: 100 },
  { skill: "Confidence", A: 90, fullMark: 100 },
  { skill: "Vocabulary", A: 75, fullMark: 100 },
  { skill: "Tone", A: 80, fullMark: 100 },
  { skill: "Grammar", A: 65, fullMark: 100 },
];

const radarConfig = {
  A: { label: "Score", color: "#8b5cf6" },
} satisfies ChartConfig;


const skillData = [
  { category: "Business", score: 140 },
  { category: "Technical", score: 100 },
  { category: "Leadership", score: 180 },
  { category: "Social", score: 60 },
  { category: "Crisis", score: 110 },
];

const skillConfig = {
  score: { label: "Score", color: "rgba(255,255,255,0.2)" },
} satisfies ChartConfig;


const monthlyData = [
  { month: "Jan", target: 400, actual: 240 },
  { month: "Feb", target: 300, actual: 139 },
  { month: "Mar", target: 200, actual: 280 },
  { month: "Apr", target: 278, actual: 390 },
  { month: "May", target: 189, actual: 480 },
  { month: "Jun", target: 239, actual: 380 },
  { month: "Jul", target: 349, actual: 430 },
  { month: "Aug", target: 200, actual: 380 },
  { month: "Sep", target: 278, actual: 390 },
  { month: "Oct", target: 189, actual: 480 },
  { month: "Nov", target: 239, actual: 380 },
  { month: "Dec", target: 349, actual: 430 },
];

const monthlyConfig = {
  target: { label: "Target Score", color: "#6366f1" },
  actual: { label: "Actual Score", color: "#00F38D" },
} satisfies ChartConfig;

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Brief delay to show skeleton for UX polish
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex-1 p-6 md:p-8 space-y-6 animate-in fade-in duration-500 w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Fluentia AI Dashboard</h2>
        <p className="text-muted-foreground text-sm">Overview of your communication progress and active sessions.</p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-[#111] border-white/10 text-white transition-all hover:bg-white/[0.02] hover:border-white/20 relative overflow-hidden group cursor-pointer duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-white transition-colors duration-300">Total Practice Time</CardTitle>
            <div className="p-2 bg-white/5 group-hover:bg-white/10 transition-colors duration-300 rounded-md">
              <Clock className="h-4 w-4 text-muted-foreground group-hover:text-white transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">42h 15m</div>
            <p className="text-xs flex items-center mt-1 text-[#00F38D]">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              12% from last month
            </p>
          </CardContent>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#00F38D]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </Card>
        
        <Card className="bg-[#111] border-white/10 text-white transition-all hover:bg-white/[0.02] hover:border-white/20 relative overflow-hidden group cursor-pointer duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-white transition-colors duration-300">Sessions Completed</CardTitle>
            <div className="p-2 bg-white/5 group-hover:bg-white/10 transition-colors duration-300 rounded-md">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground group-hover:text-white transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">142</div>
            <p className="text-xs flex items-center mt-1 text-[#00F38D]">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              8% from last month
            </p>
          </CardContent>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </Card>

        <Card className="bg-[#111] border-white/10 text-white transition-all hover:bg-white/[0.02] hover:border-white/20 relative overflow-hidden group cursor-pointer duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-white transition-colors duration-300">Practice Required</CardTitle>
            <div className="p-2 bg-white/5 group-hover:bg-white/10 transition-colors duration-300 rounded-md">
              <AlertTriangle className="h-4 w-4 text-muted-foreground group-hover:text-white transition-colors duration-300" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold">24 Scenarios</div>
            <p className="text-xs flex items-center mt-1 text-red-500">
              <ArrowDownRight className="w-3 h-3 mr-1" />
              Focus on Filler Words
            </p>
          </CardContent>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-red-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </Card>

        <Card className="bg-[#111] border-white/10 text-white transition-all hover:bg-white/[0.02] hover:border-white/20 relative overflow-hidden group cursor-pointer duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-white transition-colors duration-300">Avg Confidence Score</CardTitle>
            <div className="p-2 bg-[#00F38D]/10 rounded-md">
              <TrendingUp className="h-4 w-4 text-[#00F38D]" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold relative inline-block">
              86%
            </div>
            <p className="text-xs flex items-center mt-1 text-[#00F38D]">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              5% average increase
            </p>
          </CardContent>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#00F38D]/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="bg-[#111] border-white/10 text-white col-span-3">
          <CardHeader>
            <CardTitle className="text-xl">Skill Breakdown</CardTitle>
            <CardDescription className="text-muted-foreground text-sm">Your communication profile</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-0 pb-6 pt-4">
            <ChartContainer config={radarConfig} className="mx-auto aspect-[4/3] max-h-[300px] w-full">
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
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="#8b5cf6"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-[#111] border-white/10 text-white col-span-4 flex flex-col justify-between">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Top skill categories</CardTitle>
              <CardDescription className="text-muted-foreground">Scoring across scenario types</CardDescription>
            </div>
            <select className="bg-[#1a1a1a] border border-white/10 text-xs rounded-md px-2 py-1 outline-none text-white focus:border-[#00F38D]/50 transition-colors cursor-pointer">
              <option>All Products</option>
              <option>Business Only</option>
            </select>
          </CardHeader>
          <CardContent className="pb-8">
             <ChartContainer config={skillConfig} className="h-[260px] w-full">
              <BarChart
                data={skillData}
                layout="vertical"
                margin={{ left: 20, right: 20, top: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 11}} orientation="bottom" />
                <YAxis dataKey="category" type="category" axisLine={false} tickLine={false} tick={{fill: '#aaa', fontSize: 13}} width={80} />
                <ChartTooltip cursor={{fill: 'rgba(255,255,255,0.02)'}} content={<ChartTooltipContent />} />
                <Bar dataKey="score" fill="#8b5cf6" radius={[0, 10, 10, 0]} barSize={12} activeBar={{ fill: '#a78bfa' }} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#111] border-white/10 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Top alert categories</CardTitle>
              <CardDescription className="text-muted-foreground">Compare target vs actual performance per month.</CardDescription>
            </div>
            <div className="flex gap-2">
              <select className="bg-[#1a1a1a] border border-white/10 text-xs rounded-md px-3 py-1.5 outline-none text-white focus:border-[#00F38D]/50 transition-colors cursor-pointer">
                <option>Last 12 months</option>
                <option>Last 6 months</option>
              </select>
              <select className="bg-[#1a1a1a] border border-white/10 text-xs rounded-md px-3 py-1.5 outline-none text-white focus:border-[#00F38D]/50 transition-colors cursor-pointer">
                <option>Category</option>
                <option>All</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
             <ChartContainer config={monthlyConfig} className="h-[320px] w-full mt-4">
              <BarChart data={monthlyData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <ChartTooltip cursor={{fill: 'rgba(255,255,255,0.02)'}} content={<ChartTooltipContent indicator="dashed" />} />
                <Bar dataKey="target" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={8} />
                <Bar dataKey="actual" fill="rgba(255,255,255,0.15)" radius={[8, 8, 0, 0]} barSize={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
    </div>
  );
}
