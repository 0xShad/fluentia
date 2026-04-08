import { Calendar, TrendingUp, Clock } from "lucide-react";
import type { ReportTemplate } from "../components/report-card";

export const reportTemplates: ReportTemplate[] = [
  {
    id: "weekly",
    title: "Weekly Summary",
    description: "Practice sessions, improvements, and key metrics from this week.",
    icon: Calendar,
    timeframe: "7 days",
    lastGenerated: "2 days ago",
  },
  {
    id: "monthly",
    title: "Monthly Report",
    description: "Comprehensive analysis of your communication growth over the month.",
    icon: TrendingUp,
    timeframe: "30 days",
    lastGenerated: "1 week ago",
  },
  {
    id: "analytics",
    title: "Session Analytics",
    description: "Detailed breakdown of all metrics and performance indicators.",
    icon: Clock,
    timeframe: "All time",
  },
];
