"use client";

import { useState } from "react";
import { Search, Filter, MoreHorizontal, Download, Play, BarChart2 } from "lucide-react";
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

const MOCK_HISTORY = [
  { id: "S-1049", title: "Customer Escalation Handling", type: "Crisis", date: "2026-04-06T14:30:00Z", duration: "12m 45s", score: 92, status: "Excellent" },
  { id: "S-1048", title: "Q3 Project Pitch", type: "Business", date: "2026-04-04T09:15:00Z", duration: "18m 20s", score: 85, status: "Good" },
  { id: "S-1047", title: "Technical Architecture Review", type: "Technical", date: "2026-03-29T16:00:00Z", duration: "24m 10s", score: 78, status: "Needs Focus" },
  { id: "S-1046", title: "All-Hands Meeting Update", type: "Leadership", date: "2026-03-25T11:00:00Z", duration: "8m 55s", score: 95, status: "Excellent" },
  { id: "S-1045", title: "Team Conflict Resolution", type: "Leadership", date: "2026-03-22T13:45:00Z", duration: "15m 30s", score: 74, status: "Needs Focus" },
  { id: "S-1044", title: "Cross-functional Sync", type: "Business", date: "2026-03-18T10:30:00Z", duration: "14m 20s", score: 88, status: "Good" },
  { id: "S-1043", title: "Networking Event Intro", type: "Social", date: "2026-03-15T18:00:00Z", duration: "5m 10s", score: 81, status: "Good" },
];

const getStatusColor = (status: string) => {
  switch(status) {
    case "Excellent": return "bg-[#00F38D]/20 text-[#00F38D] border-[#00F38D]/30";
    case "Good": return "bg-[#6366f1]/20 text-[#6366f1] border-[#6366f1]/30";
    case "Needs Focus": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
    case "Poor": return "bg-red-500/20 text-red-500 border-red-500/30";
    default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
}

const formatDate = (dateString: string) => {
  const d = new Date(dateString);
  if (isNaN(d.getTime())) {
    return "Invalid Date";
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + " " + d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

export default function HistoryPage() {
  const [search, setSearch] = useState("");

  const filteredHistory = MOCK_HISTORY.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) || 
    s.type.toLowerCase().includes(search.toLowerCase())
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
              {filteredHistory.map((session) => (
                <TableRow key={session.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <TableCell className="font-mono text-xs text-muted-foreground pl-6">{session.id}</TableCell>
                  <TableCell className="font-medium text-white group-hover:text-[#00F38D] transition-colors cursor-pointer">
                    {session.title}
                  </TableCell>
                  <TableCell className="text-zinc-400">
                     <span className="bg-white/5 text-zinc-300 text-xs px-2 py-1 rounded-md border border-white/10">
                        {session.type}
                     </span>
                  </TableCell>
                  <TableCell className="text-zinc-400 whitespace-nowrap">{formatDate(session.date)}</TableCell>
                  <TableCell className="text-zinc-400">{session.duration}</TableCell>
                  <TableCell className="text-right font-bold text-white whitespace-nowrap">
                    {session.score} <span className="text-muted-foreground text-xs font-normal">/ 100</span>
                  </TableCell>
                  <TableCell className="px-4">
                    <Badge variant="outline" className={`font-semibold border ${getStatusColor(session.status)}`}>
                      {session.status}
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
                        <DropdownMenuItem className="cursor-pointer focus:bg-white/5 focus:text-[#00F38D] gap-2">
                          <BarChart2 className="w-4 h-4" />
                          View Detailed Report
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer focus:bg-white/5 focus:text-white gap-2">
                          <Play className="w-4 h-4" />
                          Replay Audio
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem className="cursor-pointer text-red-500 focus:bg-red-500/10 focus:text-red-500 gap-2">
                          Delete Record
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredHistory.length === 0 && (
                <TableRow className="hover:bg-transparent border-0">
                  <TableCell colSpan={8} className="h-48 text-center text-muted-foreground">
                    No sessions found matching your search.
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
