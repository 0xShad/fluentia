"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  TrendingUp,
  Mic2,
  Clock,
  User,
  Settings,
  FileText,
  ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { scenarios } from "@/data/scenarios";
import { termsSections, privacySections } from "@/lib/terms-data";
import { createClient } from "@/lib/client";

// ── Types ────────────────────────────────────────────────────────────────────

interface SearchResult {
  id: string;
  type: "page" | "scenario" | "session" | "content";
  label: string;
  sublabel?: string;
  href: string;
  icon: LucideIcon;
}

interface SessionRow {
  id: string;
  scenario_title: string;
  category: string;
}

interface ContentEntry {
  id: string;
  pageLabel: string;
  pageHref: string;
  icon: LucideIcon;
  sectionTitle: string;
  searchText: string;
}

// ── Static nav items ─────────────────────────────────────────────────────────

const PAGE_ITEMS: SearchResult[] = [
  { id: "page-dashboard",   type: "page", label: "Progress",    sublabel: "Dashboard overview",   href: "/dashboard",             icon: TrendingUp },
  { id: "page-practice",    type: "page", label: "Practice",    sublabel: "Browse scenarios",     href: "/dashboard/practice",    icon: Mic2 },
  { id: "page-sessions",    type: "page", label: "Sessions",    sublabel: "Session history",      href: "/dashboard/sessions",    icon: Clock },
  { id: "page-profile",     type: "page", label: "Profile",     sublabel: "Your account details", href: "/dashboard/profile",     icon: User },
  { id: "page-preferences", type: "page", label: "Preferences", sublabel: "App settings",         href: "/dashboard/preferences", icon: Settings },
  { id: "page-terms",       type: "page", label: "Terms & Conditions", sublabel: "Legal & privacy", href: "/dashboard/terms",   icon: FileText },
];

// ── Content index ─────────────────────────────────────────────────────────────
// Each entry represents a searchable section inside a page.

const CONTENT_INDEX: ContentEntry[] = [
  // Preferences sections
  {
    id: "content-pref-language",
    pageLabel: "Preferences",
    pageHref: "/dashboard/preferences#language-region",
    icon: Settings,
    sectionTitle: "Language & Region",
    searchText: "interface language ai voice language timezone region locale english spanish french accent speech neural",
  },
  {
    id: "content-pref-notifications",
    pageLabel: "Preferences",
    pageHref: "/dashboard/preferences#notifications",
    icon: Settings,
    sectionTitle: "Notifications",
    searchText: "session reminders weekly reports realtime alerts email notifications push notification reminder alert",
  },
  {
    id: "content-pref-coaching",
    pageLabel: "Preferences",
    pageHref: "/dashboard/preferences#coaching-behavior",
    icon: Settings,
    sectionTitle: "Coaching Behavior",
    searchText: "skill level coaching style speaking goals feedback detail coaching tone correction sensitivity preferred voice beginner intermediate advanced balanced direct formal casual",
  },
  {
    id: "content-pref-recording",
    pageLabel: "Preferences",
    pageHref: "/dashboard/preferences#notifications",
    icon: Settings,
    sectionTitle: "Recording Preference",
    searchText: "audio recording consent recording preference remember choice session recording opt in opt out",
  },

  // Terms of Service sections (built from terms-data)
  ...termsSections.map((s) => ({
    id: `content-terms-${s.id}`,
    pageLabel: "Terms & Conditions",
    pageHref: `/dashboard/terms#${s.id}`,
    icon: FileText as LucideIcon,
    sectionTitle: s.title.replace(/^\d+\.\s*/, ""),
    searchText: s.body.join(" "),
  })),

  // Privacy Policy sections
  ...privacySections.map((s) => ({
    id: `content-privacy-${s.id}`,
    pageLabel: "Terms & Conditions",
    pageHref: `/dashboard/terms#${s.id}`,
    icon: FileText as LucideIcon,
    sectionTitle: s.title,
    searchText: s.body.join(" "),
  })),
];

// ── Highlight ────────────────────────────────────────────────────────────────

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <strong className="text-white font-semibold">{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

const GROUP_ORDER = ["page", "scenario", "content", "session"] as const;
const GROUP_LABELS: Record<typeof GROUP_ORDER[number], string> = {
  page: "Pages",
  scenario: "Scenarios",
  content: "In Page",
  session: "Sessions",
};

export function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [sessionsFetched, setSessionsFetched] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Lazy-load sessions once on first open
  useEffect(() => {
    if (!open || sessionsFetched) return;
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("session_feedback")
        .select("id, scenario_title, category")
        .order("created_at", { ascending: false })
        .limit(100);
      if (data) setSessions(data as SessionRow[]);
      setSessionsFetched(true);
    };
    load();
  }, [open, sessionsFetched]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const results: SearchResult[] = (() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const pages = PAGE_ITEMS.filter(
      (p) =>
        p.label.toLowerCase().includes(q) ||
        (p.sublabel?.toLowerCase().includes(q) ?? false)
    );

    const scenarioResults: SearchResult[] = scenarios
      .filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.aiRole.toLowerCase().includes(q) ||
          s.trains.some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 4)
      .map((s) => ({
        id: `scenario-${s.id}`,
        type: "scenario" as const,
        label: s.title,
        sublabel: s.category,
        href: `/dashboard/practice/${s.id}`,
        icon: Mic2,
      }));

    // Content-level results: match inside Terms sections and Preferences sections.
    // Deduplicate by pageHref+sectionTitle so each section only appears once.
    const contentResults: SearchResult[] = CONTENT_INDEX
      .filter(
        (entry) =>
          entry.sectionTitle.toLowerCase().includes(q) ||
          entry.searchText.toLowerCase().includes(q) ||
          entry.pageLabel.toLowerCase().includes(q)
      )
      .slice(0, 4)
      .map((entry) => ({
        id: entry.id,
        type: "content" as const,
        label: entry.pageLabel,
        sublabel: entry.sectionTitle,
        href: entry.pageHref,
        icon: entry.icon,
      }));

    const sessionResults: SearchResult[] = sessions
      .filter(
        (s) =>
          s.scenario_title.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
      )
      .slice(0, 3)
      .map((s) => ({
        id: `session-${s.id}`,
        type: "session" as const,
        label: s.scenario_title,
        sublabel: s.category,
        href: `/dashboard/sessions`,
        icon: Clock,
      }));

    return [...pages, ...scenarioResults, ...contentResults, ...sessionResults];
  })();

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const navigate = useCallback(
    (href: string) => {
      setOpen(false);
      setQuery("");
      router.push(href);
    },
    [router]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      navigate(results[activeIndex].href);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const grouped = {
    page:     results.filter((r) => r.type === "page"),
    scenario: results.filter((r) => r.type === "scenario"),
    content:  results.filter((r) => r.type === "content"),
    session:  results.filter((r) => r.type === "session"),
  };

  const orderedResults = GROUP_ORDER.flatMap((type) => grouped[type]);

  return (
    <div ref={containerRef} className="relative group hidden sm:flex items-center">
      <Search className="absolute left-3 w-4 h-4 text-muted-foreground group-focus-within:text-[#00F38D] transition-colors z-10 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        placeholder="Search..."
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        className="w-56 h-9 bg-[#111] border border-white/10 rounded-md pl-9 pr-4 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-[#00F38D]/50 focus:ring-1 focus:ring-[#00F38D]/50 transition-all"
      />

      {open && query.trim() && (
        <div className="absolute top-full mt-2 left-0 w-80 bg-[#111] border border-white/10 rounded-xl shadow-2xl shadow-black/60 z-50 overflow-hidden">
          {orderedResults.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-white/40">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="py-2">
              {GROUP_ORDER.map((type) => {
                const group = grouped[type];
                if (group.length === 0) return null;
                return (
                  <div key={type}>
                    <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-white/30">
                      {GROUP_LABELS[type]}
                    </p>
                    {group.map((result) => {
                      const flatIdx = orderedResults.indexOf(result);
                      const isActive = flatIdx === activeIndex;
                      const Icon = result.icon;
                      return (
                        <button
                          key={result.id}
                          onMouseEnter={() => setActiveIndex(flatIdx)}
                          onClick={() => navigate(result.href)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 text-left transition-colors",
                            isActive ? "bg-white/6" : "hover:bg-white/3"
                          )}
                        >
                          <span
                            className={cn(
                              "shrink-0 w-7 h-7 rounded-md flex items-center justify-center",
                              isActive ? "bg-[#00F38D]/10" : "bg-white/5"
                            )}
                          >
                            <Icon
                              className={cn(
                                "w-3.5 h-3.5",
                                isActive ? "text-[#00F38D]" : "text-white/40"
                              )}
                            />
                          </span>
                          <span className="flex-1 min-w-0">
                            <span className="block text-sm text-white/80 truncate">
                              <Highlight text={result.label} query={query} />
                            </span>
                            {result.sublabel && (
                              <span className="block text-xs text-white/30 truncate">
                                <Highlight text={result.sublabel} query={query} />
                              </span>
                            )}
                          </span>
                          {isActive && (
                            <ChevronRight className="w-3.5 h-3.5 text-white/20 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
