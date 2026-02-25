"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";

interface DashboardData {
  totalLeads: number;
  newThisWeek: number;
  upcomingConsultations: Array<{
    id: string;
    scheduled_at: string;
    status: string;
    leads: { business_name: string; email: string };
  }>;
  conversionRate: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/dashboard").then((r) => r.json()).then(setData);
  }, []);

  if (!data) return <div className="text-purple-400">Loading dashboard...</div>;

  const metrics = [
    { label: "Total Leads", value: data.totalLeads, icon: "👥", color: "purple" },
    { label: "New This Week", value: data.newThisWeek, icon: "✨", color: "gold" },
    { label: "Upcoming Consults", value: data.upcomingConsultations.length, icon: "📅", color: "blue" },
    { label: "Conversion Rate", value: `${data.conversionRate}%`, icon: "🎯", color: "green" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-purple-100">Dashboard</h1>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="p-5 rounded-xl border border-purple-500/15"
            style={{ background: "rgba(26, 14, 46, 0.4)", backdropFilter: "blur(10px)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-purple-400">{m.label}</span>
              <span className="text-xl">{m.icon}</span>
            </div>
            <div className="text-3xl font-bold text-purple-100">{m.value}</div>
          </div>
        ))}
      </div>

      {/* Upcoming Consultations */}
      <div className="rounded-xl border border-purple-500/15 p-5" style={{ background: "rgba(26, 14, 46, 0.4)" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-purple-100">Upcoming Consultations</h2>
          <Link href="/admin/calendar" className="text-sm text-purple-400 hover:text-purple-200">View all →</Link>
        </div>
        {data.upcomingConsultations.length === 0 ? (
          <p className="text-purple-500 text-sm">No upcoming consultations</p>
        ) : (
          <div className="space-y-3">
            {data.upcomingConsultations.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-lg bg-purple-900/20">
                <div>
                  <div className="text-sm font-medium text-purple-100">{c.leads?.business_name}</div>
                  <div className="text-xs text-purple-400">{c.leads?.email}</div>
                </div>
                <div className="text-sm text-purple-300">
                  {format(new Date(c.scheduled_at), "MMM d, h:mm a")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Link href="/admin/leads" className="p-4 rounded-xl border border-purple-500/15 hover:border-purple-500/30 transition-all text-center" style={{ background: "rgba(26, 14, 46, 0.4)" }}>
          <div className="text-2xl mb-2">➕</div>
          <div className="text-sm text-purple-200">Add New Lead</div>
        </Link>
        <Link href="/admin/calendar" className="p-4 rounded-xl border border-purple-500/15 hover:border-purple-500/30 transition-all text-center" style={{ background: "rgba(26, 14, 46, 0.4)" }}>
          <div className="text-2xl mb-2">📅</div>
          <div className="text-sm text-purple-200">Book Consultation</div>
        </Link>
        <Link href="/admin/leads?status=New" className="p-4 rounded-xl border border-purple-500/15 hover:border-purple-500/30 transition-all text-center" style={{ background: "rgba(26, 14, 46, 0.4)" }}>
          <div className="text-2xl mb-2">🔔</div>
          <div className="text-sm text-purple-200">View New Leads</div>
        </Link>
      </div>
    </div>
  );
}
