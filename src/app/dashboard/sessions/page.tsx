"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search, Filter, MoreHorizontal, Download, BarChart2, Mic, Play,
  Trash2, Loader2, Check, ChevronLeft, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { SessionsSkeleton } from "./components/sessions-skeleton";
import { SessionDetailDialog } from "./components/session-detail-dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger, DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/client";
import { cn } from "@/lib/utils";

interface SessionRow {
  id: string;
  scenario_title: string;
  category: string;
  overall_score: number;
  grade: string;
  elapsed_seconds: number;
  created_at: string;
  vapi_call_id: string | null;
  recording_url: string | null;
  recording_enabled: boolean;
}

const PAGE_SIZE = 15;
const ALL_STATUSES = ["Excellent", "Good", "Needs Focus", "Poor"] as const;

function getStatus(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 60) return "Needs Focus";
  return "Poor";
}

function formatDuration(seconds: number) {
  if (seconds <= 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function shortId(uuid: string) {
  return `S-${uuid.slice(-6).toUpperCase()}`;
}

const statusColor = (status: string) => {
  switch (status) {
    case "Excellent":   return "bg-[#00F38D]/20 text-[#00F38D] border-[#00F38D]/30";
    case "Good":        return "bg-[#6366f1]/20 text-[#6366f1] border-[#6366f1]/30";
    case "Needs Focus": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
    case "Poor":        return "bg-red-500/20 text-red-500 border-red-500/30";
    default:            return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

const formatDate = (d: string) => {
  const date = new Date(d);
  if (isNaN(date.getTime())) return "—";
  return (
    date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) +
    " " +
    date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  );
};

export default function HistoryPage() {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [search, setSearch] = useState("");
  const [filterCategories, setFilterCategories] = useState<string[]>([]);
  const [filterStatuses, setFilterStatuses] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("session_feedback")
        .select("id, scenario_title, category, overall_score, grade, elapsed_seconds, created_at, vapi_call_id, recording_url, recording_enabled")
        .order("created_at", { ascending: false });
      if (!error && data) setSessions(data as SessionRow[]);
      setLoading(false);
    };
    load();
  }, []);

  // Reset to page 1 whenever search or filters change
  useEffect(() => {
    setPage(1);
  }, [search, filterCategories, filterStatuses]);

  const categories = useMemo(
    () => [...new Set(sessions.map((s) => s.category))].sort(),
    [sessions]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return sessions.filter((s) => {
      const matchesSearch =
        !q ||
        s.scenario_title.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q);
      const matchesCategory =
        filterCategories.length === 0 || filterCategories.includes(s.category);
      const matchesStatus =
        filterStatuses.length === 0 || filterStatuses.includes(getStatus(s.overall_score));
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [sessions, search, filterCategories, filterStatuses]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeFilterCount = filterCategories.length + filterStatuses.length;
  const hasActiveFilters = activeFilterCount > 0;

  const toggleCategory = (cat: string) =>
    setFilterCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );

  const toggleStatus = (status: string) =>
    setFilterStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );

  const clearFilters = () => {
    setFilterCategories([]);
    setFilterStatuses([]);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const supabase = createClient();

      const { data: row } = await supabase
        .from("session_feedback")
        .select("recording_url")
        .eq("id", deleteId)
        .maybeSingle();

      if (row?.recording_url) {
        await supabase.storage.from("recordings").remove([row.recording_url]);
      }

      const { error: deleteErr } = await supabase
        .from("session_feedback")
        .delete()
        .eq("id", deleteId);

      if (deleteErr) throw new Error(deleteErr.message);

      setSessions((prev) => prev.filter((s) => s.id !== deleteId));
      if (selectedId === deleteId) setSelectedId(null);
      toast.success("Session deleted successfully.");
    } catch (err: unknown) {
      console.error("Session delete error:", err);
      toast.error("Failed to delete session. Please try again.");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  if (loading) return <SessionsSkeleton />;

  const showFrom = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const showTo = Math.min(page * PAGE_SIZE, filtered.length);

  return (
    <>
      <div className="flex-1 p-6 md:p-8 space-y-6 animate-in fade-in duration-500 w-full overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Session History</h2>
            <p className="text-muted-foreground text-sm">Click any session to view details, transcript, and play the recording.</p>
          </div>
          <Button className="bg-[#00F38D] text-black hover:bg-[#00F38D]/90 font-semibold gap-2 border-0 shadow-[0_0_15px_rgba(0,243,141,0.3)]">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-xl shadow-2xl relative">
          {/* Toolbar */}
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

            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  "inline-flex items-center gap-2 h-10 px-4 rounded-md border border-white/10 text-white bg-[#1a1a1a] hover:bg-white/5 text-sm font-medium transition-colors outline-none focus:ring-2 focus:ring-[#00F38D]/50",
                  hasActiveFilters && "border-[#00F38D]/40"
                )}
              >
                <Filter className="w-4 h-4" />
                Filter
                {hasActiveFilters && (
                  <span className="ml-0.5 bg-[#00F38D] text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                    {activeFilterCount}
                  </span>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 bg-[#111] border-white/10 text-white shadow-xl shadow-black"
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs text-white/40 font-bold uppercase tracking-wider">
                    Category
                  </DropdownMenuLabel>
                  {categories.map((cat) => (
                    <DropdownMenuCheckboxItem
                      key={cat}
                      checked={filterCategories.includes(cat)}
                      onCheckedChange={() => toggleCategory(cat)}
                      className="cursor-pointer focus:bg-white/5 focus:text-white"
                    >
                      {cat}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="bg-white/10" />

                <DropdownMenuGroup>
                  <DropdownMenuLabel className="text-xs text-white/40 font-bold uppercase tracking-wider">
                    Status
                  </DropdownMenuLabel>
                  {ALL_STATUSES.map((status) => (
                    <DropdownMenuCheckboxItem
                      key={status}
                      checked={filterStatuses.includes(status)}
                      onCheckedChange={() => toggleStatus(status)}
                      className="cursor-pointer focus:bg-white/5 focus:text-white"
                    >
                      {status}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>

                {hasActiveFilters && (
                  <>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={clearFilters}
                        className="cursor-pointer focus:bg-white/5 text-white/50 focus:text-white gap-2 text-xs"
                      >
                        <Check className="w-3.5 h-3.5 opacity-0" />
                        Clear all filters
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#050505] hover:bg-[#050505]">
                <TableRow className="border-white/10 hover:bg-[#050505]">
                  <TableHead className="text-zinc-500 font-medium pl-6">Session ID</TableHead>
                  <TableHead className="text-zinc-500 font-medium w-70">Title</TableHead>
                  <TableHead className="text-zinc-500 font-medium">Category</TableHead>
                  <TableHead className="text-zinc-500 font-medium">Date & Time</TableHead>
                  <TableHead className="text-zinc-500 font-medium whitespace-nowrap">Duration</TableHead>
                  <TableHead className="text-zinc-500 font-medium text-right">Score</TableHead>
                  <TableHead className="text-zinc-500 font-medium px-4">Status</TableHead>
                  <TableHead className="text-zinc-500 font-medium">Rec.</TableHead>
                  <TableHead className="text-right px-6" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((session) => {
                  const status = getStatus(session.overall_score);
                  return (
                    <TableRow
                      key={session.id}
                      className="border-white/5 hover:bg-white/3 transition-colors cursor-pointer group"
                      onClick={() => setSelectedId(session.id)}
                    >
                      <TableCell className="font-mono text-xs text-muted-foreground pl-6">
                        {shortId(session.id)}
                      </TableCell>
                      <TableCell className="font-medium text-white group-hover:text-[#00F38D] transition-colors">
                        {session.scenario_title}
                      </TableCell>
                      <TableCell className="text-zinc-400">
                        <span className="bg-white/5 text-zinc-300 text-xs px-2 py-1 rounded-md border border-white/10">
                          {session.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-zinc-400 whitespace-nowrap">
                        {formatDate(session.created_at)}
                      </TableCell>
                      <TableCell className="text-zinc-400">
                        {formatDuration(session.elapsed_seconds)}
                      </TableCell>
                      <TableCell className="text-right font-bold text-white whitespace-nowrap">
                        {session.overall_score}
                        <span className="text-muted-foreground text-xs font-normal"> / 100</span>
                      </TableCell>
                      <TableCell className="px-4">
                        <Badge variant="outline" className={`font-semibold border ${statusColor(status)}`}>
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {!session.recording_enabled ? (
                          <span className="text-xs text-white/20">Off</span>
                        ) : session.recording_url ? (
                          <span className="flex items-center gap-1 text-[#00F38D]/70 text-xs">
                            <Play className="w-3 h-3" />
                            Ready
                          </span>
                        ) : session.vapi_call_id ? (
                          <span className="text-xs text-white/25 flex items-center gap-1">
                            <Mic className="w-3 h-3" />
                            Saved
                          </span>
                        ) : (
                          <span className="text-xs text-white/15">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right pr-6" onClick={(e) => e.stopPropagation()}>
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
                              onClick={() => setSelectedId(session.id)}
                            >
                              <BarChart2 className="w-4 h-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem
                              className="cursor-pointer text-red-500 focus:bg-red-500/10 focus:text-red-500 gap-2"
                              onClick={() => setDeleteId(session.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete Record
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}

                {paginated.length === 0 && (
                  <TableRow className="hover:bg-transparent border-0">
                    <TableCell colSpan={9} className="h-48 text-center text-muted-foreground">
                      {sessions.length === 0
                        ? "No sessions yet. Complete a practice session to see your history."
                        : "No sessions match your search or filters."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination footer */}
          <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between gap-4 bg-[#0A0A0A] rounded-b-xl">
            <p className="text-xs text-white/30">
              {filtered.length === 0
                ? "No results"
                : `Showing ${showFrom}–${showTo} of ${filtered.length} session${filtered.length !== 1 ? "s" : ""}`}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="h-7 w-7 border-white/10 bg-transparent text-white/50 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
              <span className="text-xs text-white/40 px-2 tabular-nums">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="h-7 w-7 border-white/10 bg-transparent text-white/50 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <SessionDetailDialog
        sessionId={selectedId}
        onClose={() => setSelectedId(null)}
      />

      {/* Delete confirmation */}
      {deleteId && (
        <>
          <style>{`
            @keyframes sdlg-fadein { from { opacity: 0; } to { opacity: 1; } }
            @keyframes sdlg-scalein { from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
          `}</style>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", animation: "sdlg-fadein 0.15s ease" }}
            onClick={() => !deleting && setDeleteId(null)}
          />
          <div style={{
            position: "fixed", top: "50%", left: "50%", zIndex: 10001,
            transform: "translate(-50%, -50%)",
            width: "min(92vw, 400px)",
            background: "#0f0f0f",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "14px",
            padding: "1.75rem",
            color: "white",
            animation: "sdlg-scalein 0.15s ease",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Trash2 style={{ width: 16, height: 16, color: "#ef4444" }} />
              </div>
              <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "white" }}>Delete Session?</h2>
            </div>
            <p style={{ margin: "0 0 1.5rem", fontSize: "0.875rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
              This will permanently delete the session record and its recording from storage. This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "0.625rem", justifyContent: "flex-end" }}>
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                style={{ padding: "0.5rem 1rem", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{ padding: "0.5rem 1.125rem", borderRadius: 8, background: deleting ? "rgba(239,68,68,0.4)" : "#ef4444", border: "none", color: "white", fontSize: "0.875rem", fontWeight: 700, cursor: deleting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                {deleting
                  ? <><Loader2 style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} /> Deleting…</>
                  : <><Trash2 style={{ width: 14, height: 14 }} /> Delete</>
                }
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
