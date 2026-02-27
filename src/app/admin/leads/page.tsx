"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import type { Lead, LeadStatus, LeadPriority } from "@/lib/supabase";

const STATUSES: LeadStatus[] = ["New", "Contacted", "Consultation Scheduled", "Proposal Sent", "Won", "Lost"];
const PRIORITIES: LeadPriority[] = ["Low", "Medium", "High", "Urgent"];
const STATUS_COLORS: Record<string, string> = {
  New: "bg-blue-500/20 text-blue-300",
  Contacted: "bg-yellow-500/20 text-yellow-300",
  "Consultation Scheduled": "bg-purple-500/20 text-purple-300",
  "Proposal Sent": "bg-orange-500/20 text-orange-300",
  Won: "bg-green-500/20 text-green-300",
  Lost: "bg-red-500/20 text-red-300",
};
const PRIORITY_COLORS: Record<string, string> = {
  Low: "text-gray-400",
  Medium: "text-blue-400",
  High: "text-orange-400",
  Urgent: "text-red-400",
};

export default function LeadsPage() {
  const searchParams = useSearchParams();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showAdd, setShowAdd] = useState(false);
  const [generatingDemo, setGeneratingDemo] = useState<string | null>(null);
  const [demoResults, setDemoResults] = useState<Record<string, { html_url: string; screenshot_url: string | null }>>({});

  const fetchLeads = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);
    if (priorityFilter) params.set("priority", priorityFilter);
    const res = await fetch(`/api/leads?${params}`);
    const data = await res.json();
    setLeads(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [search, statusFilter, priorityFilter]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  async function handleGenerateDemo(leadId: string) {
    setGeneratingDemo(leadId);
    try {
      const res = await fetch(`/api/leads/${leadId}/demo`, { method: "POST" });
      const data = await res.json();
      if (data.status === "success") {
        setDemoResults((prev) => ({ ...prev, [leadId]: { html_url: data.html_url, screenshot_url: data.screenshot_url } }));
      } else {
        alert(`Demo generation failed: ${data.error || "Unknown error"}`);
      }
    } catch {
      alert("Demo generation failed");
    }
    setGeneratingDemo(null);
  }

  async function handleBulk(action: string) {
    if (selected.size === 0) return;
    if (action === "delete" && !confirm(`Delete ${selected.size} leads?`)) return;
    await fetch("/api/leads/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ids: Array.from(selected) }),
    });
    setSelected(new Set());
    fetchLeads();
  }

  function exportCSV() {
    const headers = ["Business Name", "Industry", "Contact", "Email", "Phone", "Status", "Priority", "Created"];
    const rows = leads.map((l) => [l.business_name, l.industry, l.contact_name, l.email, l.phone, l.status, l.priority, l.created_at]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${(c || "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-purple-100">Leads</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 rounded-lg font-medium text-sm text-black"
          style={{ background: "linear-gradient(135deg, #facc15, #eab308)" }}
        >
          + Add Lead
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search leads..."
          className="px-3 py-2 rounded-lg bg-purple-900/30 border border-purple-500/20 text-purple-100 text-sm placeholder-purple-500 focus:outline-none focus:border-purple-400 w-64"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-purple-900/30 border border-purple-500/20 text-purple-200 text-sm">
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="px-3 py-2 rounded-lg bg-purple-900/30 border border-purple-500/20 text-purple-200 text-sm">
          <option value="">All Priorities</option>
          {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        {selected.size > 0 && (
          <div className="flex gap-2 ml-auto">
            <button onClick={() => handleBulk("mark_contacted")} className="px-3 py-2 rounded-lg bg-blue-600/20 text-blue-300 text-sm hover:bg-blue-600/30">
              Mark Contacted ({selected.size})
            </button>
            <button onClick={() => handleBulk("delete")} className="px-3 py-2 rounded-lg bg-red-600/20 text-red-300 text-sm hover:bg-red-600/30">
              Delete ({selected.size})
            </button>
          </div>
        )}
        <button onClick={exportCSV} className="px-3 py-2 rounded-lg bg-purple-600/20 text-purple-300 text-sm hover:bg-purple-600/30 ml-auto">
          📥 Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-purple-500/15 overflow-hidden" style={{ background: "rgba(26, 14, 46, 0.4)" }}>
        {loading ? (
          <div className="p-8 text-center text-purple-400">Loading...</div>
        ) : leads.length === 0 ? (
          <div className="p-8 text-center text-purple-500">No leads found</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-purple-500/10">
                <th className="p-3 text-left">
                  <input
                    type="checkbox"
                    checked={selected.size === leads.length && leads.length > 0}
                    onChange={(e) => setSelected(e.target.checked ? new Set(leads.map((l) => l.id)) : new Set())}
                    className="accent-purple-500"
                  />
                </th>
                <th className="p-3 text-left text-purple-400 font-medium">Business</th>
                <th className="p-3 text-left text-purple-400 font-medium">Contact</th>
                <th className="p-3 text-left text-purple-400 font-medium">Industry</th>
                <th className="p-3 text-left text-purple-400 font-medium">Status</th>
                <th className="p-3 text-left text-purple-400 font-medium">Priority</th>
                <th className="p-3 text-left text-purple-400 font-medium">Created</th>
                <th className="p-3 text-left text-purple-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-purple-500/5 hover:bg-purple-600/5 transition-colors">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selected.has(lead.id)}
                      onChange={(e) => {
                        const next = new Set(selected);
                        e.target.checked ? next.add(lead.id) : next.delete(lead.id);
                        setSelected(next);
                      }}
                      className="accent-purple-500"
                    />
                  </td>
                  <td className="p-3">
                    <Link href={`/admin/leads/${lead.id}`} className="text-purple-100 hover:text-purple-50 font-medium">
                      {lead.business_name}
                    </Link>
                    <div className="text-xs text-purple-500">{lead.email}</div>
                  </td>
                  <td className="p-3 text-purple-300">{lead.contact_name || "—"}</td>
                  <td className="p-3 text-purple-300">{lead.industry || "—"}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${STATUS_COLORS[lead.status] || ""}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className={`p-3 text-sm ${PRIORITY_COLORS[lead.priority] || ""}`}>{lead.priority}</td>
                  <td className="p-3 text-purple-400 text-xs">{format(new Date(lead.created_at), "MMM d, yyyy")}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {demoResults[lead.id] ? (
                        <>
                          <a
                            href={demoResults[lead.id].html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 rounded text-xs bg-green-600/20 text-green-300 hover:bg-green-600/30 transition-colors"
                          >
                            🌐 View Demo
                          </a>
                          {demoResults[lead.id].screenshot_url && (
                            <a
                              href={demoResults[lead.id].screenshot_url!}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 rounded text-xs bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 transition-colors"
                            >
                              📸
                            </a>
                          )}
                        </>
                      ) : (
                        <button
                          onClick={() => handleGenerateDemo(lead.id)}
                          disabled={generatingDemo === lead.id}
                          className="px-2 py-1 rounded text-xs bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 transition-colors disabled:opacity-50"
                        >
                          {generatingDemo === lead.id ? (
                            <span className="flex items-center gap-1">
                              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                              Generating...
                            </span>
                          ) : "🎨 Generate Demo"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Lead Modal */}
      {showAdd && <AddLeadModal onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); fetchLeads(); }} />}
    </div>
  );
}

function AddLeadModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ business_name: "", industry: "", contact_name: "", email: "", phone: "", current_tools: "", time_waster: "", priority: "Medium" });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="w-full max-w-lg p-6 rounded-xl border border-purple-500/20" style={{ background: "rgba(15, 10, 26, 0.95)", backdropFilter: "blur(20px)" }} onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-purple-100 mb-4">Add New Lead</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          {[
            { key: "business_name", label: "Business Name *", required: true },
            { key: "contact_name", label: "Contact Name" },
            { key: "email", label: "Email", type: "email" },
            { key: "phone", label: "Phone" },
            { key: "industry", label: "Industry" },
            { key: "current_tools", label: "Current Tools" },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-xs text-purple-400 mb-1">{f.label}</label>
              <input
                type={f.type || "text"}
                required={f.required}
                value={form[f.key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-purple-900/30 border border-purple-500/20 text-purple-100 text-sm focus:outline-none focus:border-purple-400"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs text-purple-400 mb-1">Priority</label>
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-purple-900/30 border border-purple-500/20 text-purple-200 text-sm">
              {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg border border-purple-500/20 text-purple-300 text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2 rounded-lg font-medium text-sm text-black" style={{ background: "linear-gradient(135deg, #facc15, #eab308)" }}>
              {saving ? "Saving..." : "Add Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
