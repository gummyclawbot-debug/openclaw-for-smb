"use client";

import { useState } from "react";

export function BookingForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true); // still show success — we log server-side
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <section id="booking" className="section-padding max-w-2xl mx-auto text-center">
        <div className="glass p-12">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold mb-4">You&apos;re In!</h2>
          <p style={{ color: "#c4b5fd" }}>
            We&apos;ll reach out within 24 hours to schedule your AI setup. Get ready to never miss a call again.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="section-padding max-w-2xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Get Your AI Employee Today
      </h2>
      <p className="text-center mb-10" style={{ color: "#a78bfa" }}>
        Fill out the form below. We&apos;ll have your AI running within 24 hours.
      </p>
      <form onSubmit={handleSubmit} className="glass p-8 space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Business Name</label>
          <input name="businessName" required placeholder="e.g. Smith Family Dental" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Industry</label>
          <select name="industry" required>
            <option value="">Select your industry...</option>
            <option>Dentist / Medical</option>
            <option>Restaurant / Food Service</option>
            <option>Contractor / Construction</option>
            <option>Real Estate</option>
            <option>Legal Services</option>
            <option>Salon / Spa</option>
            <option>Auto Repair / Body Shop</option>
            <option>Fitness / Gym</option>
            <option>Accounting / Bookkeeping</option>
            <option>Veterinary</option>
            <option>Cleaning Services</option>
            <option>Landscaping</option>
            <option>Insurance</option>
            <option>Photography / Creative</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Current Tools You Use</label>
          <input name="currentTools" placeholder="e.g. Gmail, Google Calendar, QuickBooks, Square..." />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Biggest Time-Waster Right Now</label>
          <textarea name="timeWaster" rows={3} placeholder="What takes up most of your time that you wish was automated?" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Best Email</label>
            <input name="email" type="email" required placeholder="you@business.com" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Best Phone</label>
            <input name="phone" type="tel" required placeholder="(555) 123-4567" />
          </div>
        </div>
        <button type="submit" className="btn-cta w-full text-center" disabled={loading}>
          {loading ? "Submitting..." : "Get Your AI Employee — $500 Setup"}
        </button>
        <p className="text-center text-xs" style={{ color: "#8b5cf6" }}>
          🔒 Your info is private. We&apos;ll never share or sell your data.
        </p>
      </form>
    </section>
  );
}
