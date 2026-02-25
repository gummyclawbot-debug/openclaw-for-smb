"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import type { Lead, LeadStatus, LeadPriority, ActivityLog } from "@/lib/supabase";

const STATUSES: LeadStatus[] = ["New", "Contacted", "Consultation Scheduled", "Proposal Sent", "Won", "Lost"];
const PRIORITIES: LeadPriority[] = ["Low", "Medium", "High", "Urgent"];

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [lead, setLead] = useState<Lead | null>(null);
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Lead>>({});
  const [noteText, setNoteText] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/leads/${id}`).then((r) => r.json()).then((d) => { setLead(d); setForm(d); });
    fetch(`/api/leads/${id}/activity`).then((r) => r.json()).then(setActivity);
  }, [id]);

  async function handleSave() {
    await fetch(`/api/leads/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const res = await fetch(`/api/leads/${id}`);
    const updated = await res.json();
    setLead(updated);
    setForm(updated);
    setEditing(false);
    // Refresh activity
    fetch(`/api/leads/${id}/activity`).then((r) => r.json()).then(setActivity);
  }

  async function addNote() {
    if (!noteText.trim()) return;
    await fetch(`/api/leads/${id}/activity`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "Note Added", details: noteText }),
    });
    setNoteText("");
    fetch(`/api/leads/${id}/activity`).then((r) => r.json()).then(setActivity);
  }

  async function handleDelete() {
    if (!confirm("Delete this lead permanently?")) return;
    await fetch(`/api/leads/${id}`, { method: "DELETE" });
    router.push("/admin/leads");
  }

  if (!lead) return <div className="text-purple-400">Loading...</div>;

  const fields = [
    { key: "business_name", label: "Business Name" },
    { key: "contact_name", label: "Contact Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "industry", label: "Industry" },
    { key: "current_tools", label: "Current Tools" },
    { key: "time_waster", label: "Biggest Time-Waster" },
    { key: "notes", label: "Notes", multiline: true },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={() => router.push("/admin/leads")} className="text-sm text-purple-400 hover:text-purple-200 mb-2 block">← Back to Leads</button>
          <h1 className="text-2xl font-bold text-purple-100">{lead.business_name}</h1>
          <p className="text-purple-400 text-sm">{lead.email} · {lead.phone}</p>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <button onClick={() => { setForm(lead); setEditing(false); }} className="px-4 py-2 rounded-lg border border-purple-500/20 text-purple-300 text-sm">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 rounded-lg font-medium text-sm text-black" style={{ background: "linear-gradient(135deg, #facc15, #eab308)" }}>Save</button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)} className="px-4 py-2 rounded-lg bg-purple-600/20 text-purple-300 text-sm">Edit</button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-lg bg-red-600/20 text-red-300 text-sm">Delete</button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Details */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-purple-500/15 p-5" style={{ background: "rgba(26, 14, 46, 0.4)" }}>
            <h2 className="text-lg font-semibold text-purple-100 mb-4">Lead Details</h2>

            {/* Status and Priority */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs text-purple-400 mb-1">Status</label>
                {editing ? (
                  <select value={form.status || ""} onChange={(e) => setForm({ ...form, status: e.target.value as LeadStatus })} className="w-full px-3 py-2 rounded-lg bg-purple-900/30 border border-purple-500/20 text-purple-200 text-sm">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                ) : (
                  <div className="px-3 py-2 rounded-lg bg-purple-500/10 text-purple-200 text-sm">{lead.status}</div>
                )}
              </div>
              <div>
                <label className="block text-xs text-purple-400 mb-1">Priority</label>
                {editing ? (
                  <select value={form.priority || ""} onChange={(e) => setForm({ ...form, priority: e.target.value as LeadPriority })} className="w-full px-3 py-2 rounded-lg bg-purple-900/30 border border-purple-500/20 text-purple-200 text-sm">
                    {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                ) : (
                  <div className="px-3 py-2 rounded-lg bg-purple-500/10 text-purple-200 text-sm">{lead.priority}</div>
                )}
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-3">
              {fields.map((f) => (
                <div key={f.key}>
                  <label className="block text-xs text-purple-400 mb-1">{f.label}</label>
                  {editing ? (
                    f.multiline ? (
                      <textarea
                        value={(form as Record<string, string>)[f.key] || ""}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg bg-purple-900/30 border border-purple-500/20 text-purple-100 text-sm focus:outline-none"
                      />
                    ) : (
                      <input
                        value={(form as Record<string, string>)[f.key] || ""}
                        onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-purple-900/30 border border-purple-500/20 text-purple-100 text-sm focus:outline-none"
                      />
                    )
                  ) : (
                    <div className="px-3 py-2 rounded-lg bg-purple-900/10 text-purple-200 text-sm min-h-[36px]">
                      {(lead as unknown as Record<string, string | null>)[f.key] || "—"}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-purple-500/10 flex gap-4 text-xs text-purple-500">
              <span>Created: {format(new Date(lead.created_at), "MMM d, yyyy h:mm a")}</span>
              <span>Updated: {format(new Date(lead.updated_at), "MMM d, yyyy h:mm a")}</span>
            </div>
          </div>
        </div>

        {/* Activity Log */}
        <div className="space-y-4">
          <div className="rounded-xl border border-purple-500/15 p-5" style={{ background: "rgba(26, 14, 46, 0.4)" }}>
            <h2 className="text-lg font-semibold text-purple-100 mb-4">Activity Log</h2>

            {/* Add Note */}
            <div className="mb-4">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note..."
                rows={2}
                className="w-full px-3 py-2 rounded-lg bg-purple-900/30 border border-purple-500/20 text-purple-100 text-sm focus:outline-none placeholder-purple-500 mb-2"
              />
              <button onClick={addNote} className="px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-300 text-xs hover:bg-purple-600/30">Add Note</button>
            </div>

            {/* Activity entries */}
            <div className="space-y-3">
              {activity.length === 0 ? (
                <p className="text-purple-500 text-xs">No activity yet</p>
              ) : (
                activity.map((a) => (
                  <div key={a.id} className="p-3 rounded-lg bg-purple-900/20 border-l-2 border-purple-500/30">
                    <div className="text-xs font-medium text-purple-200">{a.action}</div>
                    {a.details && <div className="text-xs text-purple-400 mt-1">{a.details}</div>}
                    <div className="text-xs text-purple-600 mt-1">{format(new Date(a.created_at), "MMM d, h:mm a")}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
