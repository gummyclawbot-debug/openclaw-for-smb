"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Do I need to be tech-savvy?",
    a: "Not at all. I handle the entire setup from start to finish. You just tell me what your business needs, and I install, configure, and train the AI for you. If you can use a smartphone, you're more than qualified.",
  },
  {
    q: "Is my data safe?",
    a: "100% safe. Your AI runs entirely on your own computer — nothing goes to the cloud, no third-party servers, no data harvesting. Your business data never leaves your office. Period.",
  },
  {
    q: "What if I want new features later?",
    a: "Easy — just request them. New features and integrations start at $99 per request. Your AI reviews the scope so you know exactly what you're paying for before any work begins.",
  },
  {
    q: "How long does setup take?",
    a: "Most setups are completed within a single business day. Complex configurations with multiple integrations may take 2-3 days, but your AI will be answering calls within 24 hours.",
  },
  {
    q: "What if something breaks?",
    a: "Reach out anytime. Fixes are included in the $99+ per-request pricing, or covered under an optional monthly maintenance plan. Most issues are resolved same-day.",
  },
  {
    q: "Can it integrate with my existing tools?",
    a: "Yes — Gmail, Google Calendar, QuickBooks, Square, Stripe, Outlook, spreadsheets, and hundreds more. If you use it, we can probably connect it.",
  },
  {
    q: "Is there a monthly fee?",
    a: "No required monthly fee. The $500 setup is one-time. Optional monthly maintenance is available if you want ongoing monitoring and proactive updates, priced based on your needs.",
  },
  {
    q: "What kind of businesses is this for?",
    a: "Any small business that answers phones, books appointments, sends invoices, or follows up with clients. Dentists, contractors, restaurants, salons, law firms, gyms — if you're busy, this is for you.",
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
                className="text-xl ml-4 transition-transform"
                style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)", color: "#a855f7" }}
              >
                +
              </span>
            </button>
            {open === i && (
              <div className="px-5 pb-5" style={{ color: "#c4b5fd", lineHeight: 1.7 }}>
                {faq.a}
              </div>
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
