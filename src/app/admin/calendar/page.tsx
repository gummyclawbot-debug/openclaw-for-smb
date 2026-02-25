"use client";

import { useEffect, useState, useMemo } from "react";
import { Calendar, dateFnsLocalizer, type View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addMinutes, startOfMonth, endOfMonth, addMonths, setHours, setMinutes, isBefore } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import type { Consultation, Lead, ConsultationStatus } from "@/lib/supabase";

const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales: { "en-US": enUS } });

const CONSULT_STATUS_COLORS: Record<string, string> = {
  Scheduled: "#a855f7",
  Completed: "#22c55e",
  "No-Show": "#ef4444",
  Cancelled: "#6b7280",
};

export default function CalendarPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [view, setView] = useState<View>("week");
  const [date, setDate] = useState(new Date());
  const [showBook, setShowBook] = useState(false);
  const [selectedConsult, setSelectedConsult] = useState<Consultation | null>(null);

  function fetchConsultations() {
    const from = startOfMonth(addMonths(date, -1)).toISOString();
    const to = endOfMonth(addMonths(date, 1)).toISOString();
    fetch(`/api/consultations?from=${from}&to=${to}`).then((r) => r.json()).then((d) => setConsultations(Array.isArray(d) ? d : []));
  }

  useEffect(() => { fetchConsultations(); }, [date]);
  useEffect(() => { fetch("/api/leads").then((r) => r.json()).then((d) => setLeads(Array.isArray(d) ? d : [])); }, []);

  const events = useMemo(
    () =>
      consultations.map((c) => ({
        id: c.id,
        title: c.leads?.business_name || "Consultation",
        start: new Date(c.scheduled_at),
        end: addMinutes(new Date(c.scheduled_at), c.duration_min || 30),
        resource: c,
      })),
    [consultations]
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-purple-100">Consultation Calendar</h1>
        <button onClick={() => setShowBook(true)} className="px-4 py-2 rounded-lg font-medium text-sm text-black" style={{ background: "linear-gradient(135deg, #facc15, #eab308)" }}>
          + Book Consultation
        </button>
      </div>

      <div className="rounded-xl border border-purple-500/15 p-4" style={{ background: "rgba(26, 14, 46, 0.4)" }}>
        <style>{`
          .rbc-calendar { color: #e9d5ff; }
          .rbc-toolbar button { color: #c4b5fd; background: rgba(139, 92, 246, 0.1); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 8px; padding: 4px 12px; font-size: 13px; }
          .rbc-toolbar button:hover { background: rgba(139, 92, 246, 0.2); }
          .rbc-toolbar button.rbc-active { background: rgba(139, 92, 246, 0.3); color: #f3e8ff; }
          .rbc-header { color: #a78bfa; font-size: 13px; padding: 8px; border-bottom: 1px solid rgba(139, 92, 246, 0.1); }
          .rbc-off-range-bg { background: rgba(0,0,0,0.2); }
          .rbc-today { background: rgba(139, 92, 246, 0.05) !important; }
          .rbc-event { border-radius: 6px; font-size: 12px; padding: 2px 6px; }
          .rbc-time-slot { border-top: 1px solid rgba(139, 92, 246, 0.05); }
          .rbc-time-content { border-top: 1px solid rgba(139, 92, 246, 0.1); }
          .rbc-time-header-content { border-left: 1px solid rgba(139, 92, 246, 0.1); }
          .rbc-day-slot .rbc-time-slot { border-top-color: rgba(139, 92, 246, 0.05); }
          .rbc-timeslot-group { border-bottom: 1px solid rgba(139, 92, 246, 0.08); }
          .rbc-time-view, .rbc-month-view { border: 1px solid rgba(139, 92, 246, 0.1); border-radius: 8px; overflow: hidden; }
          .rbc-month-row + .rbc-month-row { border-top: 1px solid rgba(139, 92, 246, 0.1); }
          .rbc-day-bg + .rbc-day-bg { border-left: 1px solid rgba(139, 92, 246, 0.05); }
          .rbc-time-gutter { color: #8b5cf6; font-size: 11px; }
          .rbc-label { color: #8b5cf6; }
          .rbc-current-time-indicator { background-color: #facc15; }
        `}</style>
        <Calendar
          localizer={localizer}
          events={events}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 650 }}
          min={setMinutes(setHours(new Date(), 9), 0)}
          max={setMinutes(setHours(new Date(), 17), 0)}
          step={30}
          timeslots={1}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: CONSULT_STATUS_COLORS[(event.resource as Consultation).status] || "#a855f7",
              border: "none",
            },
          })}
          onSelectEvent={(event) => setSelectedConsult(event.resource as Consultation)}
        />
      </div>

      {showBook && (
        <BookModal
          leads={leads}
          onClose={() => setShowBook(false)}
          onSaved={() => { setShowBook(false); fetchConsultations(); }}
        />
      )}

      {selectedConsult && (
        <ConsultDetailModal
          consultation={selectedConsult}
          onClose={() => setSelectedConsult(null)}
          onUpdated={() => { setSelectedConsult(null); fetchConsultations(); }}
        />
      )}
    </div>
  );
}

function BookModal({ leads, onClose, onSaved }: { leads: Lead[]; onClose: () => void; onSaved: () => void }) {
  const [leadId, setLeadId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  // Generate time slots Mon-Fri 9AM-5PM
  const timeSlots = [];
  for (let h = 9; h < 17; h++) {
    timeSlots.push(`${h.toString().padStart(2, "0")}:00`);
    timeSlots.push(`${h.toString().padStart(2, "0")}:30`);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const scheduled_at = new Date(`${date}T${time}:00-05:00`).toISOString(); // EST
    await fetch("/api/consultations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lead_id: leadId, scheduled_at, notes, duration_min: 30 }),
    });
    onSaved();
  }

  // Filter to weekdays only for date input
  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="w-full max-w-md p-6 rounded-xl border border-purple-500/20" style={{ background: "rgba(15, 10, 26, 0.95)" }} onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-purple-100 mb-4">Book Consultation</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-purple-400 mb-1">Select Lead *</label>
            <select value={leadId} onChange={(e) => setLeadId(e.target.value)} required className="w-full px-3 py-2 rounded-lg bg-purple-900/30 border border-purple-500/20 text-purple-200 text-sm">
              <option value="">Choose a lead...</option>
              {leads.map((l) => <option key={l.id} value={l.id}>{l.business_name} — {l.email}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-purple-400 mb-1">Date *</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={today} required className="w-full px-3 py-2 rounded-lg bg-purple-900/30 border border-purple-500/20 text-purple-200 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-purple-400 mb-1">Time (EST) *</label>
              <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-purple-900/30 border border-purple-500/20 text-purple-200 text-sm">
                {timeSlots.map((t) => <option key={t} value={t}>{format(parse(t, "HH:mm", new Date()), "h:mm a")}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-purple-400 mb-1">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg bg-purple-900/30 border border-purple-500/20 text-purple-100 text-sm focus:outline-none placeholder-purple-500" placeholder="Consultation notes..." />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg border border-purple-500/20 text-purple-300 text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2 rounded-lg font-medium text-sm text-black" style={{ background: "linear-gradient(135deg, #facc15, #eab308)" }}>
              {saving ? "Booking..." : "Book Consultation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConsultDetailModal({ consultation, onClose, onUpdated }: { consultation: Consultation; onClose: () => void; onUpdated: () => void }) {
  const [status, setStatus] = useState(consultation.status);
  const [notes, setNotes] = useState(consultation.notes || "");
  const statuses: ConsultationStatus[] = ["Scheduled", "Completed", "No-Show", "Cancelled"];

  async function handleUpdate() {
    await fetch(`/api/consultations/${consultation.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, notes }),
    });
    onUpdated();
  }

  async function handleDelete() {
    if (!confirm("Cancel this consultation?")) return;
    await fetch(`/api/consultations/${consultation.id}`, { method: "DELETE" });
    onUpdated();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="w-full max-w-md p-6 rounded-xl border border-purple-500/20" style={{ background: "rgba(15, 10, 26, 0.95)" }} onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-purple-100 mb-1">Consultation Details</h2>
        <p className="text-sm text-purple-400 mb-4">{consultation.leads?.business_name}</p>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-purple-400">Date/Time</span>
            <span className="text-purple-200">{format(new Date(consultation.scheduled_at), "MMM d, yyyy h:mm a")}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-purple-400">Duration</span>
            <span className="text-purple-200">{consultation.duration_min} min</span>
          </div>
          <div>
            <label className="block text-xs text-purple-400 mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as ConsultationStatus)} className="w-full px-3 py-2 rounded-lg bg-purple-900/30 border border-purple-500/20 text-purple-200 text-sm">
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-purple-400 mb-1">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg bg-purple-900/30 border border-purple-500/20 text-purple-100 text-sm focus:outline-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleDelete} className="px-4 py-2 rounded-lg bg-red-600/20 text-red-300 text-sm">Delete</button>
            <div className="flex-1" />
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-purple-500/20 text-purple-300 text-sm">Cancel</button>
            <button onClick={handleUpdate} className="px-4 py-2 rounded-lg font-medium text-sm text-black" style={{ background: "linear-gradient(135deg, #facc15, #eab308)" }}>Update</button>
          </div>
        </div>
      </div>
    </div>
  );
}
