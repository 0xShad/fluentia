"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, MoreHorizontal, Download, BarChart2 } from "lucide-react";
import { SessionsSkeleton } from "./components/sessions-skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/client";

interface SessionRow {
  id: string;
  scenario_id: string;
  scenario_title: string;
  category: string;
  overall_score: number;
  grade: string;
  elapsed_seconds: number;
  created_at: string;
}

function getStatus(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Needs Focus";
  return "Poor";
}

function formatDuration(seconds: number): string {
  if (seconds <= 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function shortId(uuid: string): string {
  return `S-${uuid.slice(-6).toUpperCase()}`;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Excellent": return "bg-[#00F38D]/20 text-[#00F38D] border-[#00F38D]/30";
    case "Good": return "bg-[#6366f1]/20 text-[#6366f1] border-[#6366f1]/30";
    case "Needs Focus": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
    case "Poor": return "bg-red-500/20 text-red-500 border-red-500/30";
    default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "—";
  return (
    d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
    " " +
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  );
};

export default function HistoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("session_feedback")
        .select("id, scenario_id, scenario_title, category, overall_score, grade, elapsed_seconds, created_at")
        .order("created_at", { ascending: false });

      if (!error && data) setSessions(data as SessionRow[]);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <SessionsSkeleton />;

  const filtered = sessions.filter(
    (s) =>
      s.scenario_title.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 p-6 md:p-8 space-y-6 animate-in fade-in duration-500 w-full overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Session History</h2>
          <p className="text-muted-foreground text-sm">Review your past practice sessions and progress reports.</p>
        </div>
        <Button className="bg-[#00F38D] text-black hover:bg-[#00F38D]/90 font-semibold gap-2 border-0 shadow-[0_0_15px_rgba(0,243,141,0.3)]">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-xl shadow-2xl relative">
        <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center gap-4 justify-between bg-[#0A0A0A] rounded-t-xl">
          <div className="relative w-full sm:max-w-sm group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-[#00F38D] transition-colors" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or category..."
              className="pl-9 bg-[#1a1a1a] border-white/10 text-white placeholder:text-muted-foreground focus-visible:ring-[#00F38D]/50 focus-visible:border-[#00F38D]/50 h-10 transition-all"
            />
          </div>
          <Button variant="outline" className="border-white/10 text-white bg-[#1a1a1a] hover:bg-white/5 hover:text-white h-10 gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#050505] hover:bg-[#050505]">
              <TableRow className="border-white/10 hover:bg-[#050505]">
                <TableHead className="text-zinc-500 font-medium pl-6">Session ID</TableHead>
                <TableHead className="text-zinc-500 font-medium w-[300px]">Title</TableHead>
                <TableHead className="text-zinc-500 font-medium">Category</TableHead>
                <TableHead className="text-zinc-500 font-medium">Date & Time</TableHead>
                <TableHead className="text-zinc-500 font-medium whitespace-nowrap">Duration</TableHead>
                <TableHead className="text-zinc-500 font-medium text-right">Score</TableHead>
                <TableHead className="text-zinc-500 font-medium px-4">Status</TableHead>
                <TableHead className="text-right px-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((session) => {
                const status = getStatus(session.overall_score);
                return (
                  <TableRow key={session.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <TableCell className="font-mono text-xs text-muted-foreground pl-6">{shortId(session.id)}</TableCell>
                    <TableCell
                      className="font-medium text-white group-hover:text-[#00F38D] transition-colors cursor-pointer"
                      onClick={() => router.push(`/dashboard/feedback/${session.id}`)}
                    >
                      {session.scenario_title}
                    </TableCell>
                    <TableCell className="text-zinc-400">
                      <span className="bg-white/5 text-zinc-300 text-xs px-2 py-1 rounded-md border border-white/10">
                        {session.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-zinc-400 whitespace-nowrap">{formatDate(session.created_at)}</TableCell>
                    <TableCell className="text-zinc-400">{formatDuration(session.elapsed_seconds)}</TableCell>
                    <TableCell className="text-right font-bold text-white whitespace-nowrap">
                      {session.overall_score} <span className="text-muted-foreground text-xs font-normal">/ 100</span>
                    </TableCell>
                    <TableCell className="px-4">
                      <Badge variant="outline" className={`font-semibold border ${getStatusColor(status)}`}>
                        {status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-white/10 text-muted-foreground hover:text-white transition-colors outline-none focus:ring-2 focus:ring-[#00F38D]/50">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-[#111] border-white/10 text-white shadow-xl shadow-black">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          </DropdownMenuGroup>
                          <DropdownMenuItem
                            className="cursor-pointer focus:bg-white/5 focus:text-[#00F38D] gap-2"
                            onClick={() => router.push(`/dashboard/feedback/${session.id}`)}
                          >
                            <BarChart2 className="w-4 h-4" />
                            View Detailed Report
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/10" />
                          <DropdownMenuItem className="cursor-pointer text-red-500 focus:bg-red-500/10 focus:text-red-500 gap-2">
                            Delete Record
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}

              {filtered.length === 0 && (
                <TableRow className="hover:bg-transparent border-0">
                  <TableCell colSpan={8} className="h-48 text-center text-muted-foreground">
                    {sessions.length === 0
                      ? "No sessions yet. Complete a practice session to see your history."
                      : "No sessions found matching your search."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
