"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Do I need to be tech-savvy?",
    a: "Not at all. I handle the entire setup from start to finish. You just tell me what your business needs, and I install, configure, and train the AI for you. If you can use a smartphone, you're more than qualified. You'll get a simple dashboard where you can see calls, appointments, and messages — no coding or technical knowledge required.",
  },
  {
    q: "Is my data safe?",
    a: "100% safe. Your AI runs entirely on your own computer — nothing goes to the cloud, no third-party servers, no data harvesting. Your business data never leaves your office. All communication is encrypted, and you have full control over what data the AI can access. You can wipe or export your data at any time.",
  },
  {
    q: "What if I want new features later?",
    a: "Easy — just request them. New features and integrations start at $99 per request. Your AI reviews the scope so you know exactly what you're paying for before any work begins. Common requests include adding new booking flows, connecting a new tool, or customizing how the AI responds to specific questions.",
  },
  {
    q: "How long does setup take?",
    a: "Most setups are completed within a single business day. Complex configurations with multiple integrations may take 2-3 days, but your AI will be answering calls within 24 hours. Setup includes connecting your phone line, configuring your business hours, training the AI on your services and pricing, and testing everything end-to-end.",
  },
  {
    q: "What if something breaks?",
    a: "Reach out anytime. Fixes are included in the $99+ per-request pricing, or covered under an optional monthly maintenance plan. Most issues are resolved same-day. The AI also monitors itself — if it detects something unusual (like a failed integration or missed call), it alerts you immediately.",
  },
  {
    q: "Can it integrate with my existing tools?",
    a: "Yes — here are some popular integrations:\n\n• **Google Calendar** — Appointments booked by the AI appear instantly on your calendar. It checks availability in real-time so there are never double bookings.\n\n• **QuickBooks / Xero** — Invoices are generated and sent automatically after a job is completed. Payment status syncs back so the AI can send follow-up reminders for unpaid invoices.\n\n• **CRM (HubSpot, Salesforce, Zoho)** — Every new lead is logged with contact info, call notes, and follow-up status. The AI updates deal stages as conversations progress.\n\n• **Email (Gmail / Outlook)** — The AI sends appointment confirmations, estimates, and follow-ups from your business email. Replies are tracked and flagged if they need your attention.\n\n• **Slack / Microsoft Teams** — Get real-time notifications when the AI books an appointment, receives a lead, or needs your input on something it can't handle alone.\n\n• **Stripe / Square** — Accept payments and deposits during the booking process. The AI can collect payment info and send receipts automatically.\n\nIf you use a tool not listed here, ask — we can likely connect it.",
  },
  {
    q: "Is there a monthly fee?",
    a: "No required monthly fee. The $500 setup is one-time. Optional monthly maintenance is available if you want ongoing monitoring and proactive updates, priced based on your needs. Maintenance plans typically include priority support, automatic updates, performance monitoring, and monthly usage reports.",
  },
  {
    q: "What kind of businesses is this for?",
    a: "Any small business that answers phones, books appointments, sends invoices, or follows up with clients. Dentists, contractors, restaurants, salons, law firms, gyms, cleaning services, real estate agents, auto shops — if you're busy and losing leads because you can't respond fast enough, this is for you. The AI adapts to your specific industry and workflow.",
  },
  {
    q: "Can I customize how the AI talks to my customers?",
    a: "Absolutely. During setup, we train the AI on your tone of voice, your services, your pricing, and your common Q&A. You can make it formal, friendly, or anything in between. If you want it to answer a specific question a certain way — like how you describe your services or handle objections — just tell us and we'll program it in.",
  },
  {
    q: "What happens if the AI can't handle a call?",
    a: "It gracefully hands off to you. The AI recognizes when a conversation goes beyond its training — like a complex complaint or a highly specific technical question — and either transfers the call to you live, or takes a detailed message and sends it to you immediately via text, email, or Slack. You never lose the customer.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="section-padding max-w-3xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Frequently Asked Questions
      </h2>
      <p className="text-center mb-10" style={{ color: "#a78bfa" }}>
        Everything you need to know before getting started.
      </p>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="glass overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full text-left p-5 flex justify-between items-center font-semibold"
              style={{ background: "transparent", border: "none", color: "#f3e8ff", cursor: "pointer", fontSize: "1rem" }}
            >
              {faq.q}
              <span
                className="text-xl ml-4 transition-transform flex-shrink-0"
                style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)", color: "#a855f7" }}
              >
                +
              </span>
            </button>
            {open === i && (
              <div
                className="px-5 pb-5"
                style={{ color: "#c4b5fd", lineHeight: 1.7, whiteSpace: "pre-line" }}
                dangerouslySetInnerHTML={{
                  __html: faq.a
                    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#e9d5ff">$1</strong>')
                    .replace(/\n/g, "<br />"),
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-16">
        <a href="#booking" className="btn-cta text-lg">
          Get Your AI Employee — $500 Setup
        </a>
      </div>
    </section>
  );
}
